L.mapbox.accessToken = 'pk.eyJ1IjoiYWx1bHNoIiwiYSI6ImY0NDBjYTQ1NjU4OGJmMDFiMWQ1Y2RmYjRlMGI1ZjIzIn0.pngboKEPsfuC4j54XDT3VA';

var map = L.mapbox.map('map', 'mapbox.light', { zoomControl: false })
            .setView([38.898, -77.043], 12);

new L.Control.Zoom({ position: 'bottomright' }).addTo(map);

var bufferLayer = L.mapbox.featureLayer().addTo(map);
var dcBikeLanes = L.mapbox.featureLayer().addTo(map);

dcBikeLanes.loadURL('./DC_bikelanes.geojson')
    .on('ready', done);

// Try to get user's current location and set the view
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
        map.setView([position.coords.latitude, position.coords.longitude], 16);
    });
}

function done() {
    dcBikeLanes.setStyle({ color: 'green', weight: 2 });

    function run() {
        var radius = parseInt(document.getElementById('radius').value);
        if (isNaN(radius)) radius = 500;

        var buffer = turf.buffer(dcBikeLanes.getGeoJSON(), radius/5280, 'miles');

        // Each buffer feature object needs to have the properties set individually
        for (var i=0; i<buffer.features.length; i++) {
            buffer.features[i].properties = {
                'fill': '#56B6DB',
                'stroke': '#1A3742',
                'stroke-width': 2
            }
        }

        bufferLayer.setGeoJSON(buffer);
    }

    run();

    document.getElementById('radius').onchange = run;
}