L.mapbox.accessToken = 'pk.eyJ1IjoiYWx1bHNoIiwiYSI6ImY0NDBjYTQ1NjU4OGJmMDFiMWQ1Y2RmYjRlMGI1ZjIzIn0.pngboKEPsfuC4j54XDT3VA';

var map = L.mapbox.map('map', 'mapbox.light', { zoomControl: false })
    .setView([38.898, -77.043], 12);

new L.Control.Zoom({ position: 'bottomright' }).addTo(map);

// styles and color palette for map
var bikeLaneStyle = { 'color': 'green', 'weight': 2 };
var bufferStyle = { 'fill': '#56B6DB',
                    'stroke': '#1A3742',
                    'stroke-width': 2 };

var dcBikeData = L.mapbox.featureLayer().addTo(map);
var mocoBikeLanes = L.mapbox.featureLayer().addTo(map);
var alexandriaBikeLanes = L.mapbox.featureLayer().addTo(map);
var arlingtonBikeLanes = L.mapbox.featureLayer().addTo(map);

dcBikeData.loadURL('./data/DC_Bike_Paths_all.geojson')
    .on('ready', loadBikeLanes);
mocoBikeLanes.loadURL('./data/MD_MontgomeryCounty_bike.geojson')
    .on('ready', loadBikeLanes);
alexandriaBikeLanes.loadURL('./data/VA_Alexandria_Bike.geojson')
    .on('ready', loadBikeLanes);
arlingtonBikeLanes.loadURL('./data/VA_Arlington_Bike.geojson')
    .on('ready', loadBikeLanes);

// load buffers
var dcBuffer500 = L.mapbox.featureLayer().addTo(map);
var dcBuffer1000 = L.mapbox.featureLayer();
var dcBuffer2500 = L.mapbox.featureLayer();
var dcBuffer5280 = L.mapbox.featureLayer();

dcBuffer500.loadURL('./buffers/dcBikeLanes_buff_500ft.geojson')
    .on('ready', loadBuffer);
dcBuffer1000.loadURL('./buffers/dcBikeLanes_buff_1000ft.geojson')
    .on('ready', loadBuffer);
dcBuffer2500.loadURL('./buffers/dcBikeLanes_buff_2500ft.geojson')
    .on('ready', loadBuffer);
dcBuffer5280.loadURL('./buffers/dcBikeLanes_buff_5280ft.geojson')
    .on('ready', loadBuffer);

// Buffer layers overlay control
var overlayMaps = {
    '500 ft': dcBuffer500,
    '1000 ft': dcBuffer1000,
    '2500 ft': dcBuffer2500,
    '1 mile': dcBuffer5280 
};

L.control.layers(null, overlayMaps).addTo(map);

// Geocoder control
var geocoder = L.mapbox.geocoderControl('mapbox.places');
geocoder.setPosition('topright');
map.addControl(geocoder);

var searchMarker;
geocoder.on('select', function(data) {
    // close the address selection dropdown and add a marker
    if (searchMarker) {
        map.removeLayer(searchMarker);
    }
    this._closeIfOpen();
    searchMarker = L.marker(data.feature.center.reverse());
    searchMarker.bindPopup(data.feature.place_name);
    searchMarker.addTo(map);
});

// Each buffer feature object needs to have the properties set individually
function setProperties(buffer) {
    for (var i = 0; i < buffer.features.length; i++) {
        buffer.features[i].properties = bufferStyle;
    }
}

// onload callbacks for buffers and bikelanes
function loadBuffer(data) {
    var buffer = data.target;
    buffer.setStyle(bufferStyle);
    setProperties(buffer.getGeoJSON());
    buffer.setGeoJSON(buffer.getGeoJSON())
}

function loadBikeLanes(data) {
    var bikeLanes = data.target;
    bikeLanes.setStyle(bikeLaneStyle);
}
