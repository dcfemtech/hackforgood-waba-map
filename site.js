/**
 * Dependencies:
 *    mapbox.js 2.4.0
 */

//Prove we're legit
mapboxgl.accessToken = 'pk.eyJ1IjoiYWx1bHNoIiwiYSI6ImY0NDBjYTQ1NjU4OGJmMDFiMWQ1Y2RmYjRlMGI1ZjIzIn0.pngboKEPsfuC4j54XDT3VA';

//Initialize the map through mapbox-gl.js
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v8',
    center: [-77.036871, 38.907192],
    zoom: 11
});
// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.Navigation());

// Add bike lanes function
function addLanes(JSONURL, NAME, ID) {
    map.addSource(NAME, {
        "type": "geojson",
        "data": JSONURL
    });
    map.addLayer({
        "id": ID,
        "type": "line",
        "source": NAME,
        "layout": {
            "line-join": "round",
            "line-cap": "round"
        },
        "paint": {
            "line-color": "green",
            "line-width": 2
        }
    });
}
map.on('load', function () {
    addLanes("https://dcfemtech.github.io/hackforgood-waba-map/bikelanes/DC_Bike_Paths_All.geojson", "dcBikeLanes", "dc");
    addLanes("https://dcfemtech.github.io/hackforgood-waba-map/bikelanes/MD_MontgomeryCounty_Bikeways.geojson", "mocoBikeLanes", "moco");
    addLanes("https://dcfemtech.github.io/hackforgood-waba-map/bikelanes/VA_Arlington_Bike.geojson", "arlingtonBikeLanes", "arlington");
    addLanes("https://dcfemtech.github.io/hackforgood-waba-map/bikelanes/VA_Alexandria_Bike.geojson", "alexandriaBikeLanes", "alexandria");
});

/*var bufferStyle = {
    'fill': '#56B6DB',
    'stroke': '#1A3742',
    'stroke-width': 2
};
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
*/
/**
 * Add the layers toolbar to toggle different distance buffers on/off
 */

// Put the layers that are toggleable into an object
//var overlayMaps = {
//    '500 ft': dcBuffer500,
//    '1000 ft': dcBuffer1000,
//    '2500 ft': dcBuffer2500,
//    '1 mile': dcBuffer5280
//};
//
////L.control is Leaflet. Syntax: .layers(baseLayers, overlays)
//L.control.layers(null, overlayMaps).addTo(map);
//
//
///**
// * Add a search control to the map (Geocoder).
// * First, add the control. 
// * second, specify behavior of the map after a search
// */
//var geocoder = L.mapbox.geocoderControl('mapbox.places');
//geocoder.setPosition('topright');
//map.addControl(geocoder);
//
//var searchMarker;
//geocoder.on('select', function (data) {
//    // close the address selection dropdown and add a marker
//    if (searchMarker) {
//        map.removeLayer(searchMarker);
//    }
//    this._closeIfOpen(); //'this' is the geocoder search bar on the page
//    searchMarker = L.marker(data.feature.center.reverse());
//    searchMarker.bindPopup(data.feature.place_name);
//    searchMarker.addTo(map);
//});
//
//
///**
// * Onload callbacks for buffers and bikelanes
// */
//
////Styles the buffer using bufferStyle variable; setGeoJSON is needed to apply the properties to the featureLayer
//function loadBuffer(data) {
//    var buffer = data.target;
//    setProperties(buffer.getGeoJSON());
//    buffer.setGeoJSON(buffer.getGeoJSON())
//}
//
//// Each buffer feature object needs to have the properties set individually
//function setProperties(buffer) {
//    for (var i = 0; i < buffer.features.length; i++) {
//        buffer.features[i].properties = bufferStyle;
//    }
//}
//