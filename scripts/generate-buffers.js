#!/usr/bin/env node

var turfBuffer = require('turf-buffer');
var fs = require('fs');
var path = require('path');
var d3 = require('d3-queue');

var q = d3.queue(1);

var dcBikeLanes = fs.readFileSync(path.resolve('bikelanes', 'DC_Bike_Paths_All.geojson'), 'utf8');

// See https://github.com/dcfemtech/hackforgood-waba-map/issues/1 for background

function featureUnion(geojson){

    var merged = geojson.features[0];

    var length = geojson.features.length;

    for (var i = 1; i < length; i++) {
        console.log("Processing feature " + i);
        merged = turf.union(merged, geojson.features[i]);
    }

    return merged
}

function end() {
	var dcBikeLaneBuffer500 = turfBuffer(dcBikeLanes, 1, 'miles');
	console.log(dcBikeLaneBuffer500);
}

q.defer(featureUnion, dcBikeLanes);
q.await(end);