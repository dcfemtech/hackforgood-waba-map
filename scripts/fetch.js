var fs = require('fs');
var path = require('path');
var request = require('request');

var montgomery = { name: 'Montgomery County, MD', url: 'https://data.montgomerycountymd.gov/api/geospatial/icc2-ppee?method=export&format=GeoJSON', type: 'geojson', filename: 'MD_MontgomeryCounty_Bikeways.geojson', mappingFunction: mocomap, done: false };
var arlington = { name: 'Arlington County, VA', url: 'http://gisdata.arlgis.opendata.arcgis.com/datasets/af497e2747104622ac74f4457b3fb73f_4.geojson', type: 'geojson', filename: 'VA_Arlington_Bike.geojson', mappingFunction: arlingtonmap, done: false };
var alexandria = { name: 'Alexandria, VA', url: 'http://data.alexgis.opendata.arcgis.com/datasets/685dfe61f1aa477f8cbd21dceb5ba9b5_0.geojson', type: 'geojson', filename: 'VA_Alexandria_Bike.geojson', mappingFunction: alexandriamap, done: false };
var dcLanes = { name: 'Washington, DC Bike Lanes', url: 'http://opendata.dc.gov/datasets/294e062cdf2c48d5b9cbc374d9709bc0_2.geojson', type: 'geojson', filename: 'DC_Bike_Lanes.geojson', mappingFunction: dclanesmap, done: false, onDone: combineDC };
var dcTrails = { name: 'Washington, DC Trails', url: 'http://opendata.dc.gov/datasets/e8c2b7ef54fb43d9a2ed1b0b75d0a14d_4.geojson', type: 'geojson', filename: 'DC_Bike_Trails.geojson', mappingFunction: dctrailsmap, done: false, onDone: combineDC };
//var princegeorges = { name: 'Prince George\'s County, MD', url: 'http://gisdata.pgplanning.org/opendata/downloadzip.asp?FileName=/data/ShapeFile/Master_Plan_Trail_Ln.zip', type: 'shapefile', filename: 'MD_PrinceGeorgesCounty_Bikeways.geojson', mappingFunction: pgmap, done: false };


function fetch(locality) {
    console.log('fetching file for ' + locality.name);
    request({
        url: locality.url,
        json: true
    }, function (error, response, body) {

        if (!error && response.statusCode === 200) {
            if (locality.type == 'shapefile') {
                //TODO: convert to geojson using ogr2ogr's web service
            }
            else {
                geoJson = body;
            }

            //each locality has their own labeling & categorizing system.  Normalize them.
            console.log('mapping raw file for ' + locality.name);
            var mappedGeoJson = locality.mappingFunction(geoJson);

            //filter it so we don't have sharrows and wide shoulders and other things WABA doesn't consider infrastructure
            console.log('filtering mapped file for ' + locality.name);
            mappedGeoJson.features = mappedGeoJson.features.filter(isRealBikeFacility);

            console.log('writing finalized file to disk for ' + locality.name);
            //write to disk
            fs.writeFileSync(path.resolve('bikelanes', locality.filename), JSON.stringify(mappedGeoJson));
            locality.done = true;
            if (locality.onDone) locality.onDone();
        }
    })
}

function mocomap(rawGeoJson) {
    //keep objectid
    //keep name
    //convert category = 'Paved Off-Road Trail' to wabaclassification = 'Paved Trail'
    //convert category = 'Bike Lanes' to wabaclassification = 'Bike Lane'
    //convert category = 'Bike-Friendly Shoulders' to wabaclassification = 'Shoulder'
    //convert category = 'Signed On-Road Route' to wabaclassification = 'Signed Route'
    //convert category = 'Natural Surface' to wabaclassification = 'Unpaved Trail'
    //convert category = 'Separated Bike Lanes' to wabaclassification = 'Separated Bike Lanes'

    var geojson = { "type": "FeatureCollection", "features": [] };
    for (var i = 0; i < rawGeoJson.features.length; i++) {
        var rawFeature = rawGeoJson.features[i];
        var mappedFeature = { "type": "Feature", "properties": { "objectid": rawFeature.properties.objectid, "name": rawFeature.properties.name }, "geometry": rawFeature.geometry };
        if (rawFeature.properties.category == 'Paved Off-Road Trail') mappedFeature.properties.wabaclassification = 'Paved Trail';
        if (rawFeature.properties.category == 'Bike Lanes') mappedFeature.properties.wabaclassification = 'Bike Lane';
        if (rawFeature.properties.category == 'Bike-Friendly Shoulders') mappedFeature.properties.wabaclassification = 'Shoulder';
        if (rawFeature.properties.category == 'Signed On-Road Route') mappedFeature.properties.wabaclassification = 'Signed Route';
        if (rawFeature.properties.category == 'Natural Surface') mappedFeature.properties.wabaclassification = 'Unpaved Trail';
        if (rawFeature.properties.category == 'Separated Bike Lanes') mappedFeature.properties.wabaclassification = 'Separated Bike Lane';

        geojson.features.push(mappedFeature);
    }

    return geojson;
}

function arlingtonmap(rawGeoJson) {
    //convert OBJECTID to objectid
    //convert Label to name
    //convert Route_Type = 'Off Street Trail' to wabaclassification = 'Paved Trail'
    //convert Route_Type = 'Marked Route' to wabaclassification = 'Bike Lane'
    //convert Route_Type = 'Sharrow' to wabaclassification = 'Sharrows'
    //convert Route_Type = 'Suggested Route' to wabaclassification = 'Signed Route'

    var geojson = { "type": "FeatureCollection", "features": [] };
    for (var i = 0; i < rawGeoJson.features.length; i++) {
        var rawFeature = rawGeoJson.features[i];
        var mappedFeature = { "type": "Feature", "properties": { "objectid": rawFeature.properties.OBJECTID, "name": rawFeature.properties.Label }, "geometry": rawFeature.geometry };
        if (rawFeature.properties.Route_Type == 'Off Street Trail') mappedFeature.properties.wabaclassification = 'Paved Trail';
        if (rawFeature.properties.Route_Type == 'Marked Route') mappedFeature.properties.wabaclassification = 'Bike Lane';
        if (rawFeature.properties.Route_Type == 'Sharrow') mappedFeature.properties.wabaclassification = 'Sharrows';
        if (rawFeature.properties.Route_Type == 'Suggested Route') mappedFeature.properties.wabaclassification = 'Signed Route';

        geojson.features.push(mappedFeature);
    }

    return geojson;
}

function alexandriamap(rawGeoJson) {
    //filter to STATUS = 'Existing'
    //convert FID to objectid
    //convert TRAILTYPE = 'Off Street' to wabaclassification = 'Paved Trail'
    //convert TRAILTYPE = 'On Street' and SHARROW = 'No' to wabaclassification = 'Bike Lane'
    //convert TRAILTYPE = 'On Street' and SHARROW = 'Yes' to wabaclassification = 'Sharrows'

    var geojson = { "type": "FeatureCollection", "features": [] };
    rawGeoJson.features = rawGeoJson.features.filter(function (value) { return value.properties.STATUS == 'Existing'; })

    for (var i = 0; i < rawGeoJson.features.length; i++) {
        var rawFeature = rawGeoJson.features[i];
        var mappedFeature = { "type": "Feature", "properties": { "objectid": rawFeature.properties.FID }, "geometry": rawFeature.geometry };
        if (rawFeature.properties.TRAILTYPE == 'Off Street') mappedFeature.properties.wabaclassification = 'Paved Trail';
        if (rawFeature.properties.TRAILTYPE == 'On Street' && rawFeature.properties.SHARROW == 'No') mappedFeature.properties.wabaclassification = 'Bike Lane';
        if (rawFeature.properties.TRAILTYPE == 'On Street' && rawFeature.properties.SHARROW == 'Yes') mappedFeature.properties.wabaclassification = 'Sharrows';

        geojson.features.push(mappedFeature);
    }

    return geojson;
}

function dclanesmap(rawGeoJson) {
    //convert OBJECTID to objectid
    //convert FACILITY = 'Bus/Bike Lane' to wabaclassification = 'Bus/Bike Lane'
    //convert FACILITY = 'Existing Bike Lane' to wabaclassification = 'Bike Lane'
    //convert FACILITY = 'Cycle Track' to wabaclassification = 'Separated Bike Lane'
    //convert FACILITY = 'Shared Lane' to wabaclassification = 'Sharrows'
    //convert FACILITY = 'Contraflow Bike Lane' to wabaclassification = 'Bike Lane'
    //convert FACILITY = 'Climbing Lane' to wabaclassification = 'Bike Lane'

    var geojson = { "type": "FeatureCollection", "features": [] };
    for (var i = 0; i < rawGeoJson.features.length; i++) {
        var rawFeature = rawGeoJson.features[i];
        var mappedFeature = { "type": "Feature", "properties": { "objectid": rawFeature.properties.OBJECTID }, "geometry": rawFeature.geometry };
        if (rawFeature.properties.FACILITY == 'Bus/Bike Lane') mappedFeature.properties.wabaclassification = 'Bus/Bike Lane';
        if (rawFeature.properties.FACILITY == 'Existing Bike Lane') mappedFeature.properties.wabaclassification = 'Bike Lane';
        if (rawFeature.properties.FACILITY == 'Climbing Lane') mappedFeature.properties.wabaclassification = 'Bike Lane';
        if (rawFeature.properties.FACILITY == 'Shared Lane') mappedFeature.properties.wabaclassification = 'Sharrows';
        if (rawFeature.properties.FACILITY == 'Contraflow Bike Lane') mappedFeature.properties.wabaclassification = 'Bike Lane';
        if (rawFeature.properties.FACILITY == 'Cycle Track') mappedFeature.properties.wabaclassification = 'Separated Bike Lane';

        geojson.features.push(mappedFeature);
    }

    return geojson;
}

function dctrailsmap(rawGeoJson) {
    //convert OBJECTID to objectid
    //convert NAME to name
    //set all to wabaclassification = 'Paved Trail'

    var geojson = { "type": "FeatureCollection", "features": [] };
    for (var i = 0; i < rawGeoJson.features.length; i++) {
        var rawFeature = rawGeoJson.features[i];
        var mappedFeature = { "type": "Feature", "properties": { "objectid": rawFeature.properties.OBJECTID, "name": rawFeature.properties.NAME }, "geometry": rawFeature.geometry };
        mappedFeature.properties.wabaclassification = 'Paved Trail';

        geojson.features.push(mappedFeature);
    }

    return geojson;
}

function isRealBikeFacility(value) {
    return (value.properties.wabaclassification == 'Paved Trail' || value.properties.wabaclassification == 'Bike Lane' || value.properties.wabaclassification == 'Separated Bike Lane');
}

function combineDC() {
    if (dcLanes.done && dcTrails.done) {
        console.log('Combing DC Trails geojson with DC Lanes geojson');
        var lanes = JSON.parse(fs.readFileSync(path.resolve('bikelanes', dcLanes.filename), 'utf8'));
        var trails = JSON.parse(fs.readFileSync(path.resolve('bikelanes', dcTrails.filename), 'utf8'));
        lanes.features = lanes.features.concat(trails.features);

        fs.writeFileSync(path.resolve('bikelanes', 'DC_Bike_Paths_All.geojson'), JSON.stringify(lanes));
    }
    
}

fetch(montgomery);
fetch(arlington);
fetch(alexandria);
fetch(dcLanes);
fetch(dcTrails);

