
// ======= constants =======
const TITLE = 'WABA Bike Infrastructure Map Project';

// ======= display =======
let defaultDisplay = {
    geopathFilesArray: [],
    geopathCount: 0
}

// ======= map =======
let defaultMap = {
    mapEl: document.getElementById("map"),
    mapStyle: 'mapbox.light',
    centerLat: 38.99,
    centerLng: -77.20,
    zoom: 11,
    zoomControl: false,
    dataLayers: [],
    markersGroup: [],
    markersSelected: []
}

// ======= state =======
let defaultState = {
    selRegions: { DC: true, MO: true, PG: true, AR: true, AL: true },
    laneType: { lanes: true, paths: false, trails: false },
    bufferSize: 0,
    zone: { show: false},
    activePlace: { placeIndex: null, placeName: null },
    selPlaces: []
}

// ======= regions =======
let regions = {
    DC: {
        id: "DC_0",
        name: "DC",
        center: { lat: 38.91, lng: -77.04 },
        zoneFiles: ["District_Mask.geojson", "Ward__2012.geojson"],
        laneFile: "DC_Bike_Lanes.geojson",
        pathFile: "DC_Bike_Paths_All.geojson",
        trailFile: "DC_Bike_Trails.geojson",
        bufferFiles: [
            { ft500: "DC_Bike_Buffer_1000ft.geojson" },
            { ft1000: "DC_Bike_Buffer_2500ft.geojson" },
            { ft1500: "DC_Bike_Buffer_500ft.geojson" },
            { ft5280: "DC_Bike_Buffer_5280ft.geojson" }
        ]
    },
    MO: {
        id: "MO_1",
        name: "MO",
        center: { lat: null, lng: null },
        zoneFiles: [],
        laneFile: "MD_MontgomeryCounty_Bikeways.geojson",
        pathFile: null,
        trailFile: null,
        bufferFiles: [
            { ft500: "DC_Bike_Buffer_1000ft.geojson" },
            { ft1000: "DC_Bike_Buffer_2500ft.geojson" },
            { ft1500: "DC_Bike_Buffer_500ft.geojson" },
            { ft5280: "DC_Bike_Buffer_5280ft.geojson" }
        ]
    },
    PG: {
        id: "PG_2",
        name: "PG",
        center: { lat: null, lng: null },
        zoneFiles: [],
        laneFile: null,
        pathFile: null,
        trailFile: null,
        bufferFiles: [
            { ft500: "DC_Bike_Buffer_1000ft.geojson" },
            { ft1000: "DC_Bike_Buffer_2500ft.geojson" },
            { ft1500: "DC_Bike_Buffer_500ft.geojson" },
            { ft5280: "DC_Bike_Buffer_5280ft.geojson" }
        ]
    },
    AR: {
        id: "AR_3",
        name: "AR",
        center: { lat: null, lng: null },
        zoneFiles: [],
        laneFile: "VA_Arlington_Bike.geojson",
        pathFile: null,
        trailFile: null,
        bufferFiles: [
            { ft500: "DC_Bike_Buffer_1000ft.geojson" },
            { ft1000: "DC_Bike_Buffer_2500ft.geojson" },
            { ft1500: "DC_Bike_Buffer_500ft.geojson" },
            { ft5280: "DC_Bike_Buffer_5280ft.geojson" }
        ]
    },
    AL: {
        id: "AL_4",
        name: "AL",
        center: { lat: null, lng: null },
        zoneFiles: [],
        laneFile: "VA_Alexandria_Bike.geojson",
        pathFile: null,
        trailFile: null,
        bufferFiles: [
            { ft500: "DC_Bike_Buffer_1000ft.geojson" },
            { ft1000: "DC_Bike_Buffer_2500ft.geojson" },
            { ft1500: "DC_Bike_Buffer_500ft.geojson" },
            { ft5280: "DC_Bike_Buffer_5280ft.geojson" }
        ]
    }
}

// ======= app =======
let app;
$(() => app.initialize());
app = {
    map: defaultMap,
    state: defaultState,
    activeMap: null,

    // ======= displayLanes =======
    displayLanes: function() {
        console.log("app.displayLanes");
        defaultDisplay.geopathCount = defaultDisplay.geopathFilesArray.length;
        var host = window.location.hostname;
        var nextFile = defaultDisplay.geopathFilesArray[1];
        var url = "bikelanes/" + nextFile;
        var bikeLaneStyle = { 'color': 'green', 'weight': 2 };

        // == get selected path data
        $.ajax({
            url: url,
            method: "GET",
            dataType: "text"
        }).done(function(jsonData){
            console.log("*** ajax success ***");
            var jsonData2 = $.parseJSON(jsonData);
            var bikeLanes = L.mapbox.featureLayer(jsonData2).addTo(app.activeMap);
            bikeLanes.setStyle(bikeLaneStyle);
        }).fail(function(){
            console.log("*** ajax fail T ***");
        });
    },

    // ======= initMap =======
    initMap: function () {
        console.log("app.initMap");
        L.mapbox.accessToken = 'pk.eyJ1IjoiYWx1bHNoIiwiYSI6ImY0NDBjYTQ1NjU4OGJmMDFiMWQ1Y2RmYjRlMGI1ZjIzIn0.pngboKEPsfuC4j54XDT3VA';
        var map = L.mapbox.map(
            app.map.mapEl,
            app.map.mapStyle,
            { zoomControl: false })
                .setView([app.map.centerLat, app.map.centerLng], app.map.zoom);
        new L.Control.Zoom({ position: 'bottomright' }).addTo(map);
        return map;
    },

    // ======= initialize =======
    initialize: function () {
        console.log("app.initialize");
        _.forEach(app.state.selRegions, function(value, key) {
            if (value) {
                app.showLanes(key);
            }
        });
        console.log("  defaultDisplay.geopathFilesArray.length: ", defaultDisplay.geopathFilesArray.length);
        app.activeMap = app.initMap();
        app.displayLanes();
    },

    // ======= showLanes =======
    showLanes: function(key) {
        console.log("app.showLanes");
        if (app.state.laneType.lanes) {
            var laneFile = regions[key].laneFile;
            laneFile ? defaultDisplay.geopathFilesArray.push(laneFile) : console.log("NO LANES");
        }
        if (app.state.laneType.paths) {
            var pathFile = regions[key].pathFile;
            pathFile ? defaultDisplay.geopathFilesArray.push(pathFile) : console.log("NO PATHS");
        }
        if (app.state.laneType.trails) {
            var trailFile = regions[key].trailFile;
            trailFile ? defaultDisplay.geopathFilesArray.push(trailFile) : console.log("NO TRAILS");
        }
    }
}












// ======= styles/color palette =======
// var bikeLaneStyle = { 'color': 'green', 'weight': 2 };
// var bufferStyle = { 'fill': '#56B6DB',
//                     'stroke': '#1A3742',
//                     'stroke-width': 2 };

// ======= mouse location =======
// app.map.on('mousemove', function (e) {
//     // console.log("  e: ", e);
//     // console.log("  e.latlng.lat: ", e.latlng.lat);
//     document.getElementById('loc').innerHTML =
//         "x:   " + JSON.stringify(e.layerPoint.x) + "   y:   " + JSON.stringify(e.layerPoint.y) + '<br />' +
//         "lat: " + (e.latlng.lat).toFixed(2) + "   lng: " + (e.latlng.lng).toFixed(2);
// });


// ======= add empty data layers =======
// var dcBikeData = L.mapbox.featureLayer().addTo(map);
// var mocoBikeLanes = L.mapbox.featureLayer().addTo(map);
// var alexandriaBikeLanes = L.mapbox.featureLayer().addTo(map);
// var arlingtonBikeLanes = L.mapbox.featureLayer().addTo(map);

// ======= load data =======
// function loadBikeData(whichArea, whichBuffer) {
//     console.log("loadBikeData");
//     console.log("  whichArea: ", whichArea);
//     console.log("  whichBuffer: ", whichBuffer);
//
//     var urlLanes, layerLanes, urlBuffer, layerBuffer;
//
//     switch(whichArea) {
//         case 'DC':
//             urlLanes = './bikelanes/DC_Bike_Paths_All.geojson';
//             layerLanes = dcBikeData;
//             break;
//         case 'MoCo':
//             urlLanes = './bikelanes/MD_MontgomeryCounty_Bikeways.geojson';
//             layerLanes = dcBikeData;
//             break;
//     }
//
//     switch(whichBuffer) {
//         case '500':
//             urlBuffer = './buffers/DC_Bike_Buffer_500ft.geojson';
//             layerBuffer = L.mapbox.featureLayer().addTo(map);
//             break;
//         case '1000':
//             urlBuffer = './buffers/DC_Bike_Buffer_1000ft.geojson';
//             layerBuffer = L.mapbox.featureLayer().addTo(map);
//             break;
//     }
//
//     layerLanes.loadURL(urlLanes).on('ready', loadSelectedLanes);
//
//     function loadSelectedLanes(data) {
//         console.log("loadSelectedLanes");
//         // console.log("  data: ", data);
//         var bikeLanes = data.target;
//         console.log("  bikeLanes: ", bikeLanes);
//         bikeLanes.setStyle(bikeLaneStyle);
//         layerBuffer.loadURL(urlBuffer).on('ready', loadSelectedBuffer);
//     }
//
//     function loadSelectedBuffer(data) {
//         console.log("loadSelectedBuffer");
//         var buffer = data.target;
//         console.log("  buffer: ", buffer);
//         setProperties(buffer.getGeoJSON());
//         buffer.setGeoJSON(buffer.getGeoJSON())
//     }
// }


// dcBikeData.loadURL('./bikelanes/DC_Bike_Paths_All.geojson')
//     .on('ready', loadBikeLanes);
// mocoBikeLanes.loadURL('./bikelanes/MD_MontgomeryCounty_Bikeways.geojson')
//     .on('ready', loadBikeLanes);
// alexandriaBikeLanes.loadURL('./bikelanes/VA_Alexandria_Bike.geojson')
//     .on('ready', loadBikeLanes);
// arlingtonBikeLanes.loadURL('./bikelanes/VA_Arlington_Bike.geojson')
//     .on('ready', loadBikeLanes);

// ======= load buffers =======
// var dcBuffer500 = L.mapbox.featureLayer().addTo(map);
// var dcBuffer1000 = L.mapbox.featureLayer();
// var dcBuffer2500 = L.mapbox.featureLayer();
// var dcBuffer5280 = L.mapbox.featureLayer();

// dcBuffer500.loadURL('./buffers/DC_Bike_Buffer_500ft.geojson')
//     .on('ready', loadBuffer);      // .on('ready'): iterate over each feature in the layer
// dcBuffer1000.loadURL('./buffers/DC_Bike_Buffer_1000ft.geojson')
//     .on('ready', loadBuffer);
// dcBuffer2500.loadURL('./buffers/DC_Bike_Buffer_2500ft.geojson')
//     .on('ready', loadBuffer);
// dcBuffer5280.loadURL('./buffers/DC_Bike_Buffer_5280ft.geojson')
//     .on('ready', loadBuffer);

// ======= controls =======
// new L.Control.Zoom({ position: 'bottomright' }).addTo(map);

// var overlayMaps = {
//     '500 ft': dcBuffer500,
//     '1000 ft': dcBuffer1000,
//     '2500 ft': dcBuffer2500,
//     '1 mile': dcBuffer5280
// };
//
// L.control.layers(null, overlayMaps).addTo(map);

// Geocoder control
// var geocoder = L.mapbox.geocoderControl('mapbox.places');
// geocoder.setPosition('topright');
// map.addControl(geocoder);
//
// var searchMarker;
// geocoder.on('select', function(data) {
//     // close the address selection dropdown and add a marker
//     if (searchMarker) {
//         map.removeLayer(searchMarker);
//     }
//     this._closeIfOpen();
//     searchMarker = L.marker(data.feature.center.reverse());
//     searchMarker.bindPopup(data.feature.place_name);
//     searchMarker.addTo(map);
// });

// onload callbacks for buffers and bikelanes
// function loadBuffer(data) {
//     console.log("loadBuffer");
//     console.log("  data: ", data);
//     var buffer = data.target;
//     setProperties(buffer.getGeoJSON());
//     buffer.setGeoJSON(buffer.getGeoJSON())
// }

// function loadBikeLanes(data) {
//     console.log("loadBikeLanes");
//     var bikeLanes = data.target;
//     bikeLanes.setStyle(bikeLaneStyle);
// }

// Each buffer feature object needs to have the properties set individually
// function setProperties(buffer) {
//     console.log("setProperties");
//     for (var i = 0; i < buffer.features.length; i++) {
//         buffer.features[i].properties = bufferStyle;
//     }
// }

// loadBikeData('MoCo', '1000');
