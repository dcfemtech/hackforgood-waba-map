L.mapbox.accessToken = 'pk.eyJ1IjoiYWx1bHNoIiwiYSI6ImY0NDBjYTQ1NjU4OGJmMDFiMWQ1Y2RmYjRlMGI1ZjIzIn0.pngboKEPsfuC4j54XDT3VA';

var map = L.mapbox.map('map', 'mapbox.light', { zoomControl: false })
            .setView([38.898, -77.043], 12);

new L.Control.Zoom({ position: 'bottomright' }).addTo(map);

var bufferLayer = L.mapbox.featureLayer().addTo(map);
var dcBikeLanes = L.mapbox.featureLayer().addTo(map);

dcBikeLanes.loadURL('./DC_bikelanes.geojson')
    .on('ready', done);

function done() {
    dcBikeLanes.setStyle({ color: 'green', weight: 2 });

    function run() {
        var radius = parseInt(document.getElementById('radius').value);
        if (isNaN(radius)) radius = 500;

        var dcBikeLanesGeoJSON = dcBikeLanes.getGeoJSON();

        var dcBikeLaneUnion = featureUnion(dcBikeLanesGeoJSON);

        var buffer = turf.buffer(dcBikeLaneUnion, radius/5280, 'miles');
        bufferLayer.setGeoJSON(buffer)
            .setStyle({
                "fill": "#FF69B4",
                "stroke": "#FF69B4",
                "stroke-width": 2
            });
    }

    function featureUnion(geojson){
        var merged = geojson.features[0];

        var length = geojson.features.length;

        for (var i = 1; i < length; i++) {
            console.log("Processing feature " + i);
            merged = turf.union(merged, geojson.features[i]);
        }

        return merged
    }

    run();

    document.getElementById('radius').onchange = run;
}