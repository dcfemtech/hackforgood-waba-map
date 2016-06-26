L.mapbox.accessToken = 'pk.eyJ1IjoiYWx1bHNoIiwiYSI6ImY0NDBjYTQ1NjU4OGJmMDFiMWQ1Y2RmYjRlMGI1ZjIzIn0.pngboKEPsfuC4j54XDT3VA';

var map = L.mapbox.map('map', 'mapbox.light', { zoomControl: false })
    .setView([38.898, -77.043], 12);

var dcBikeData = L.mapbox.featureLayer().addTo(map);
var mocoBikeLanes = L.mapbox.featureLayer().addTo(map);
var alexBikeTrails = L.mapbox.featureLayer().addTo(map);
var arlingtonBikeTrails = L.mapbox.featureLayer().addTo(map);

dcBikeData.loadURL('./data/DC_Bike_Paths_all.geojson')
    .on('ready', bikelane_loaded);

mocoBikeLanes.loadURL('./data/MD_MontgomeryCounty_bike.geojson')
    .on('ready', bikelane_loaded);

alexBikeTrails.loadURL('./data/VA_Alexandria_Bike.geojson')
    .on('ready', bikelane_loaded);

arlingtonBikeTrails.loadURL('./data/VA_Arlington_Bike.geojson')
    .on('ready', bikelane_loaded);

// load buffers
var dcbuffer_500 = L.mapbox.featureLayer().addTo(map);
dcbuffer_500.loadURL('./buffers/dcBikeLanes_buff_500ft.geojson')
    .on('ready', buffer_loaded);

var dcbuffer_1000 = L.mapbox.featureLayer();
dcbuffer_1000.loadURL('./buffers/dcBikeLanes_buff_1000ft.geojson')
    .on('ready', buffer_loaded);

var dcbuffer_2500 = L.mapbox.featureLayer();
dcbuffer_2500.loadURL('./buffers/dcBikeLanes_buff_2500ft.geojson')
    .on('ready', buffer_loaded);

var dcbuffer_5280 = L.mapbox.featureLayer();
dcbuffer_5280.loadURL('./buffers/dcBikeLanes_buff_5280ft.geojson')
    .on('ready', buffer_loaded);

// controls
var overlayMaps = {
    "500ft": dcbuffer_500,
    "1000ft": dcbuffer_1000,
    "2500ft": dcbuffer_2500,
    "1 mile": dcbuffer_5280
};

L.control.layers({},overlayMaps).addTo(map);
var geocoder = L.mapbox.geocoderControl('mapbox.places')
geocoder.setPosition('topright')
map.addControl(geocoder);

var search_marker
geocoder.on('select', function(e){
    // close the address selection dropdown and add a marker
    if(search_marker){
        map.removeLayer(search_marker)
    }
    this._closeIfOpen()
    search_marker = L.marker(e.feature.center.reverse());
    search_marker.bindPopup(e.feature.place_name);
    search_marker.addTo(map);
})

new L.Control.Zoom({ position: 'bottomright' }).addTo(map);


// styles and color paletter for map
var bikeLaneStyle = { color: 'green', weight: 2 };
var bufferStyle = { "fill": "#56B6DB",
                    "stroke": "#1A3742",
                    "stroke-width": 2
                };

// Each buffer feature object needs to have the properties set individually
function setProperties (buffer) {
    for (var i = 0; i < buffer.features.length; i++) {
        buffer.features[i].properties = bufferStyle;
    }
}

// onload callbacks for buffers and bikelanes
function buffer_loaded(e){
    var buffer = e.target;
    setProperties(buffer.getGeoJSON());
    buffer.setGeoJSON(buffer.getGeoJSON())
}

function bikelane_loaded(e) {
    var BikeLanes = e.target;

    BikeLanes.setStyle(bikeLaneStyle);

}
