var fs = require('fs');
var path = require('path');
var request = require("request");

var mocoUrl = "https://data.montgomerycountymd.gov/resource/972w-rnvw.json";

function fetchMoCo(url) {
    request({
        url: url,
        json: true
    }, function (error, response, body) {

        if (!error && response.statusCode === 200) {
            //successfully fetched arcgis json
            var geoJson = arcGisToGeoJson(body);
            //filter it so we don't have sharrows and wide shoulders and other things WABA doesn't consider infrastructure
            geoJson.features = geoJson.features.filter(isRealMoCoBikeFacility);
            //write to disk
            fs.writeFileSync(path.resolve('bikelanes', 'MD_MontgomeryCounty_Bikeways.geojson'), JSON.stringify(geoJson));
        }
    })
}

function arcGisToGeoJson(arcgisJson) {
    var geojson = { "type": "FeatureCollection", "features": [] };
    for (var i = 0; i < arcgisJson.length; i++) {
        var jsonFeature = arcgisJson[i];
        var geoJsonFeature = { "type": "Feature", "properties": { "objectid": jsonFeature.objectid, "category": jsonFeature.category }, "geometry": jsonFeature.the_geom };

        geojson.features.push(geoJsonFeature);
    }

    return geojson;
}

function isRealMoCoBikeFacility(value) {
    return (value.properties.category == "Paved Off-Road Trail" || value.properties.category == "Bike Lanes");
}

fetchMoCo(mocoUrl);