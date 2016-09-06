#!/usr/bin/env node

var turf = require('turf');
var fs = require('fs');
var path = require('path');
var d3 = require('d3-queue');

var q = d3.queue();

var sourcePath = 'bikelanes';
var clipPath = 'counties';

// See https://github.com/dcfemtech/hackforgood-waba-map/issues/1 for background

function generateBuffers(name, geojson, clipFile, callback) {
    try {
        console.log('merging features for ' + name);
        var unionedJson = featureUnion(geojson);

        generateBuffer(unionedJson, 0.094697, clipFile, name + '_buffer_500ft.geojson');
        generateBuffer(unionedJson, 0.189394, clipFile, name + '_buffer_1000ft.geojson');
        generateBuffer(unionedJson, 0.4734848, clipFile, name + '_buffer_2500ft.geojson');
        generateBuffer(unionedJson, 1, clipFile, name + '_buffer_1mile.geojson');

    } catch (ex) {
        console.log('ERROR! ' + ex);
        callback(ex, name);
    }
    callback(null, name);
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

function done(error, name) {
    if (error) {
        console.log('error [' + name + ']: ' + error);
    } else {
        console.log('done with ' + name);
    }    
}

function generateBuffer(geojson, distanceInMiles, clipFile, fileName) {
    console.log('generating ' + fileName);
    var buffer = turf.buffer(geojson, distanceInMiles, 'miles');
    //clip buffer down to the jurisdictional boundaries
    console.log('clipping buffer');
    buffer = turf.intersect(buffer, clipFile.features[0]);
    var areaInSqMeters = turf.area(buffer);
    var areaInSqKm = areaInSqMeters / 1000000;
    var areaInSqMiles = areaInSqKm / 2.58999;
    buffer.area = areaInSqMiles;
    
    fs.writeFileSync(path.resolve('buffers', fileName), JSON.stringify(buffer));
}

var sourceFiles = fs.readdirSync(sourcePath);
for (var i = 0; i < sourceFiles.length; i++) {
    var sourceFileName = sourceFiles[i];
    var sourceJson = JSON.parse(fs.readFileSync(path.resolve(sourcePath, sourceFileName)));
    var sourceFileNameBase = sourceFileName.replace(/\.[^/.]+$/, '');
    var clipFileName = sourceFileNameBase + '_Clip.geojson';
    var clipFile = JSON.parse(fs.readFileSync(path.resolve(clipPath, clipFileName)));
    q.defer(generateBuffers, sourceFileNameBase, sourceJson, clipFile);    
}
q.await(done);

