#!/usr/bin/env node

var turf = require('turf');
var fs = require('fs');
var path = require('path');
var d3 = require('d3-queue');

var q = d3.queue(1);

var arlington = JSON.parse(fs.readFileSync(path.resolve('bikelanes', 'VA_Arlington_Bike.geojson'), 'utf8'));
var dc = JSON.parse(fs.readFileSync(path.resolve('bikelanes', 'DC_Bike_Paths_All.geojson'), 'utf8'));

// See https://github.com/dcfemtech/hackforgood-waba-map/issues/1 for background

function featureUnion(name, geojson, callback){
    var merged = geojson.features[0];

    console.log("merging " + name);

    var length = geojson.features.length;

    for (var i = 1; i < length; i++) {
        console.log("processing " + name + " feature " + i);
        merged = turf.union(merged, geojson.features[i]);
    }
    
    geojson.features = [merged];

    callback(null, {"name": name, "geojson": geojson});
}

function end(error, result) {
    console.log("generating 1 mile buffer for " + result.name);
    var buffer1mile = turf.buffer(result.geojson, 1, 'miles');
    fs.writeFileSync(path.resolve('buffers', result.name + '_buffer_1mile.geojson'), JSON.stringify(buffer1mile));
}

q.defer(featureUnion, 'VA_Arlington', arlington);
q.defer(featureUnion, 'DC_Washington', dc)
q.await(end);
