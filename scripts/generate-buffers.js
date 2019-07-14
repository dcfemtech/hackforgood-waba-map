#!/usr/bin/env node

const turf = require('turf');
const fs = require('fs');
const path = require('path');
const d3 = require('d3-queue');

const q = d3.queue();

// See https://github.com/dcfemtech/hackforgood-waba-map/issues/1 for background

function generateBuffers(bikeLaneFileName, bikeLaneJson, countyClipJson, callback) {
  try {
    console.log('Merging features for area ' + bikeLaneFileName);
    const unionedJson = featureUnion(bikeLaneJson);

    generateBuffer(unionedJson, 0.094697, countyClipJson, bikeLaneFileName + '_buffer_500ft.geojson');
    generateBuffer(unionedJson, 0.189394, countyClipJson, bikeLaneFileName + '_buffer_1000ft.geojson');
    generateBuffer(unionedJson, 0.4734848, countyClipJson, bikeLaneFileName + '_buffer_2500ft.geojson');
    generateBuffer(unionedJson, 1, countyClipJson, bikeLaneFileName + '_buffer_1mile.geojson');
  } catch(error) {
    console.log(error);
    callback(error, bikeLaneFileName);
  }
  callback(null, bikeLaneFileName);
}

function featureUnion(geojson){
  var merged = geojson.features[0];
  var length = geojson.features.length;

  for (var i = 1; i < length; i++) {
    merged = turf.union(merged, geojson.features[i]);
  }
  geojson.features = [merged];

  return geojson;
}

function generateBuffer(unionedJson, distanceInMiles, countyClipJson, bufferFileName) {
  console.log('Generating buffer for ' + bufferFileName);
  var buffer = turf.buffer(unionedJson, distanceInMiles, 'miles');
  //clip buffer down to the jurisdictional boundaries
  console.log('Clipping buffer for ' + bufferFileName);
  buffer = turf.intersect(buffer, countyClipJson.features[0]);
  const areaInSqMeters = turf.area(buffer);
  const areaInSqKm = areaInSqMeters / 1000000;
  const areaInSqMiles = areaInSqKm / 2.58999;
  buffer.area = areaInSqMiles;
  
  fs.writeFileSync(path.resolve('buffers', bufferFileName), JSON.stringify(buffer));
}

function done(error, name) {
  if (error) {
    console.log('Error [' + name + ']: ' + error);
  } else {
    console.log('Done creating buffer for ' + name);
  }    
}

const bikeLaneFiles = fs.readdirSync('bikelanes');
bikeLaneFiles.forEach(bikeLaneFile => {
  const bikeLaneJson = JSON.parse(fs.readFileSync(path.resolve('bikelanes', bikeLaneFile)));
  const bikeLaneFileName = bikeLaneFile.replace(/\.[^/.]+$/, '');
  const countyClipFileName = bikeLaneFileName + '_Clip.geojson';
  const countyClipJson = JSON.parse(fs.readFileSync(path.resolve('counties', countyClipFileName)));
  q.defer(generateBuffers, bikeLaneFileName, bikeLaneJson, countyClipJson); 
});
q.await(done);
