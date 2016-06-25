L.mapbox.accessToken = 'pk.eyJ1IjoiYWx1bHNoIiwiYSI6ImY0NDBjYTQ1NjU4OGJmMDFiMWQ1Y2RmYjRlMGI1ZjIzIn0.pngboKEPsfuC4j54XDT3VA';

var map = L.mapbox.map('map', 'mapbox.light', { zoomControl: false })
    .setView([38.898, -77.043], 12);

new L.Control.Zoom({ position: 'bottomright' }).addTo(map);

var dcBufferLayer = L.mapbox.featureLayer().addTo(map);
var bufferMocoLayer = L.mapbox.featureLayer().addTo(map);
var dcBikeLanes = L.mapbox.featureLayer().addTo(map);
var mocoBikeLanes = L.mapbox.featureLayer().addTo(map);

dcBikeLanes.loadURL('./DC_bikelanes.geojson')
    .on('ready', done);

mocoBikeLanes.loadURL('./MontgomeryCountyBikelanes.geojson')
    .on('ready', done);

// styles and color paletter for map
var bikeLaneStyle = { color: 'green', weight: 2 };
var bufferStyle = { "fill": "#56B6DB",
                    "stroke": "#1A3742",
                    "stroke-width": 2
                };
function setProperties (buffer) {
    for (var i = 0; i < buffer.features.length; i++) {
        buffer.features[i].properties = bufferStyle;
    }
}
function done() {
    dcBikeLanes.setStyle(bikeLaneStyle);
    mocoBikeLanes.setStyle(bikeLaneStyle);

    function run() {
        var radius = parseInt(document.getElementById('radius').value);
        if (isNaN(radius)) radius = 500;

        var buffer = turf.buffer(dcBikeLanes.getGeoJSON(), radius / 5280, 'miles');
        // Each buffer feature object needs to have the properties set individually
        setProperties(buffer);
        dcBufferLayer.setGeoJSON(buffer);

        var bufferMoco = turf.buffer(mocoBikeLanes.getGeoJSON(), radius / 5280, 'miles');
        setProperties(bufferMoco);
        bufferMocoLayer.setGeoJSON(bufferMoco);


    }

    run();

    document.getElementById('radius').onchange = run;
}