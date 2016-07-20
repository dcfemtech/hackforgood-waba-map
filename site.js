/**
* Dependencies:
*    Mapbox JS SDK 2.4.0
*/

//Prove we're legit
L.mapbox.accessToken = 'pk.eyJ1IjoiYWx1bHNoIiwiYSI6ImY0NDBjYTQ1NjU4OGJmMDFiMWQ1Y2RmYjRlMGI1ZjIzIn0.pngboKEPsfuC4j54XDT3VA';

/**
*Initialize the map through the Mapbox Javascript SDK.
*    L.mapbox.map(
*        element: ID of the div of where to put the map
*        map base: mapbox.light is the basic OpenStreetsMap with a light colored theme
*        options: {array of options})
*        .setView([lat/lon of center], zoom level where larger is more zoomed)
*/
var map = L.mapbox.map('map', 'mapbox.light', { zoomControl: false })
            .setView([38.898, -77.043], 12);

// styles and color palette for map
var bikeLaneStyle = { 'color': 'green', 'weight': 2 };
var bufferStyle = { 'fill': '#56B6DB',
                    'stroke': '#1A3742',
                    'stroke-width': 2 };

//Add zoom control manually (instead of in mapbox.map call) so we can decide the position (default is upper left)
new L.Control.Zoom({ position: 'bottomright' }).addTo(map);

//Create a variable for each bike lane layer, and then asycronously load it
var dcBikeData = L.mapbox.featureLayer().addTo(map);
var mocoBikeLanes = L.mapbox.featureLayer().addTo(map);
var alexandriaBikeLanes = L.mapbox.featureLayer().addTo(map);
var arlingtonBikeLanes = L.mapbox.featureLayer().addTo(map);

dcBikeData.loadURL('./bikelanes/DC_Bike_Paths_All.geojson')
    .on('ready', loadBikeLanes);
mocoBikeLanes.loadURL('./bikelanes/MD_MontgomeryCounty_Bikeways.geojson')
    .on('ready', loadBikeLanes);
alexandriaBikeLanes.loadURL('./bikelanes/VA_Alexandria_Bike.geojson')
    .on('ready', loadBikeLanes);
arlingtonBikeLanes.loadURL('./bikelanes/VA_Arlington_Bike.geojson')
    .on('ready', loadBikeLanes);

// load the pre-calculated buffers for each distance ()
var dcBuffer500 = L.mapbox.featureLayer().addTo(map);
var dcBuffer1000 = L.mapbox.featureLayer();
var dcBuffer2500 = L.mapbox.featureLayer();
var dcBuffer5280 = L.mapbox.featureLayer();

dcBuffer500.loadURL('./buffers/DC_Bike_Buffer_500ft.geojson')
    .on('ready', loadBuffer);
dcBuffer1000.loadURL('./buffers/DC_Bike_Buffer_1000ft.geojson')
    .on('ready', loadBuffer);
dcBuffer2500.loadURL('./buffers/DC_Bike_Buffer_2500ft.geojson')
    .on('ready', loadBuffer);
dcBuffer5280.loadURL('./buffers/DC_Bike_Buffer_5280ft.geojson')
    .on('ready', loadBuffer);

/**
* Add the layers toolbar to toggle different distance buffers on/off
*/

// Put the layers that are toggleable into an object
var overlayMaps = {
    '500 ft': dcBuffer500,
    '1000 ft': dcBuffer1000,
    '2500 ft': dcBuffer2500,
    '1 mile': dcBuffer5280 
};

//L.control is Leaflet. Syntax: .layers(baseLayers, overlays)
L.control.layers(null, overlayMaps).addTo(map);


/**
* Add a search control to the map (Geocoder).
* First, add the control. 
* second, specify behavior of the map after a search
*/
var geocoder = L.mapbox.geocoderControl('mapbox.places');
geocoder.setPosition('topright');
map.addControl(geocoder);

var searchMarker;
geocoder.on('select', function(data) {
    // close the address selection dropdown and add a marker
    if (searchMarker) {
        map.removeLayer(searchMarker);
    }
    this._closeIfOpen(); //'this' is the geocoder search bar on the page
    searchMarker = L.marker(data.feature.center.reverse());
    searchMarker.bindPopup(data.feature.place_name);
    searchMarker.addTo(map);
});


/**
* Onload callbacks for buffers and bikelanes
*/

//Styles the buffer using bufferStyle variable, and 
function loadBuffer(data) {
    var buffer = data.target;
    setProperties(buffer.getGeoJSON());
    //buffer.setGeoJSON(buffer.getGeoJSON())
}

// Each buffer feature object needs to have the properties set individually
function setProperties(buffer) {
    for (var i = 0; i < buffer.features.length; i++) {
        buffer.features[i].properties = bufferStyle;
    }
}

//Add styles to bikelanes
function loadBikeLanes(data) {
    var bikeLanes = data.target;
    bikeLanes.setStyle(bikeLaneStyle);
}
