
// ======= constants =======
const TITLE = "WABA Bike Infrastructure Map Project";

// ======= display =======
let defaultDisplay = {
    geopathFilesArray: [],
    featureLayersArray: []
}

// ======= map =======
let defaultMap = {
    mapEl: document.getElementById("map"),
    mapStyle: "mapbox.light",
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
    selRegions: { DC: false, MO: false, PG: false, AR: false, AL: false },
    regionData: { DC: null, MO: null, PG: null, AR: null, AL: null },
    regionLayers: { DC: [], MO: [], PG: [], AR: [], AL: [] },
    laneType: { lanes: true, paths: true, trails: true },
    bufferSize: 0,
    zone: { show: false},
    activePlace: { placeIndex: null, placeName: null },
    selPlaces: []
}

// ======= regions =======
let regions = {
    DC: {
        id: "DC_0",
        name: "District of Columbia",
        center: { lat: 38.91, lng: -77.04 },
        zoneFiles: ["District_Mask.geojson", "Ward__2012.geojson"],
        laneFile: "DC_Bike_Lanes.geojson",
        pathFile: "DC_Bike_Paths_All.geojson",
        trailFile: "DC_Bike_Trails.geojson",
        bufferFiles: {
            ft500: "DC_Bike_Buffer_500ft.geojson",
            ft1000: "DC_Bike_Buffer_1000ft.geojson",
            ft2500: "DC_Bike_Buffer_2500ft.geojson",
            ft5280: "DC_Bike_Buffer_5280ft.geojson" }
    },
    MO: {
        id: "MO_1",
        name: "Montgomery County",
        center: { lat: null, lng: null },
        zoneFiles: [],
        laneFile: "MD_MontgomeryCounty_Bikeways.geojson",
        pathFile: null,
        trailFile: null,
        bufferFiles: {
            ft500: "MD_MontgomeryCounty_Bikeways_Buffer_500ft.geojson",
            ft1000: "MD_MontgomeryCounty_Bikeways_Buffer_1000ft.geojson",
            ft2500: "MD_MontgomeryCounty_Bikeways_Buffer_2500ft.geojson",
            ft5280: "MD_MontgomeryCounty_Bikeways_Buffer_5280ft.geojson" }
    },
    PG: {
        id: "PG_2",
        name: "Prince George's County",
        center: { lat: null, lng: null },
        zoneFiles: [],
        laneFile: null,
        pathFile: null,
        trailFile: null,
        bufferFiles: { ft500:null, ft1000:null, ft2500:null, ft5280:null}
    },
    AR: {
        id: "AR_3",
        name: "Arlington",
        center: { lat: null, lng: null },
        zoneFiles: [],
        laneFile: "VA_Arlington_Bike.geojson",
        pathFile: null,
        trailFile: null,
        bufferFiles: {
            ft500:"VA_Arlington_Bike_Buffer_500ft.geojson",
            ft1000:"VA_Arlington_Bike_Buffer_1000ft.geojson",
            ft2500:"VA_Arlington_Bike_Buffer_2500ft.geojson",
            ft5280:"VA_Arlington_Bike_Buffer_5280ft.geojson"}
    },
    AL: {
        id: "AL_4",
        name: "Alexandria",
        center: { lat: null, lng: null },
        zoneFiles: [],
        laneFile: "VA_Alexandria_Bike.geojson",
        pathFile: null,
        trailFile: null,
        bufferFiles: {
            ft500:"VA_Alexandria_Bike_Buffer_500ft.geojson",
            ft1000:"VA_Alexandria_Bike_Buffer_1000ft.geojson",
            ft2500:"VA_Alexandria_Bike_Buffer_2500ft.geojson",
            ft5280:"VA_Alexandria_Bike_Buffer_5280ft.geojson" }
    }
}

// ======= app =======
let app;
$(() => app.initialize());
app = {
    map: defaultMap,
    state: defaultState,
    display: defaultDisplay,
    activeMap: null,

    // ======= displayBuffers =======
    displayBuffers: function(bufferSize) {
        console.log("app.displayBuffers");

        var bufferStyle = { "fill": "#56B6DB", "stroke": "#1A3742", "stroke-width": 2 };
        var bufferFileArray = [];
        var buffers = null;
        var loopCount = 0;
        var url, bufferFile;

        _.forEach(app.state.selRegions, function(value, key) {
            if (value && (bufferSize != "none")) {
                bufferFile = regions[key].bufferFiles[bufferSize];
                url = "buffers/" + bufferFile;
                console.log("  url: ", url);
                bufferFileArray.push([key, url]);
            }
        });
        console.log("  bufferFileArray: ", bufferFileArray);

        if (bufferFileArray.length > 0) {
            key = bufferFileArray[0][0];
            url = bufferFileArray[0][1];
            bufferQueue(key, url, bufferFileArray);
        }

        // == show selected region data
        function bufferQueue(key, url, bufferFileArray) {
            console.log("bufferQueue");
            console.log("  url: ", url);
            $.ajax({
                url: url,
                method: "GET",
                dataType: "text"
            }).done(function(jsonData){
                console.log("*** ajax success ***");
                console.log("  loopCount: ", loopCount);
                var jsonData2 = $.parseJSON(jsonData);
                buffers = L.mapbox.featureLayer(jsonData2).addTo(app.activeMap);
                app.state.regionLayers[key].push(buffers);
                buffers.setStyle(bufferStyle);
                if (loopCount < bufferFileArray.length - 1) {
                    loopCount++;
                    url = bufferFileArray[loopCount];
                    bufferQueue(url, bufferFileArray);
                }
            }).fail(function(){
                console.log("*** ajax fail T ***");
            });
        }
    },

    // ======= displayLanes =======
    displayLanes: function() {
        console.log("app.displayLanes");

        var bikeLaneStyle = { "color": "green", "weight": 2 };
        var bikeLanes = null;
        var loopCount = 0;

        // == store files for selected regions in array
        // app.display.geopathFilesArray = [];
        _.forEach(app.state.selRegions, function(value, key) {
            if (value) {
                app.state.regionData[key] = app.makeLanesArray(key);
                console.log("  app.state.regionData: ", app.state.regionData);
            } else {
                app.state.regionData[key] = null;
                app.state.regionLayers[key].forEach(function (bikeLanes) {
                    app.activeMap.removeLayer(bikeLanes);
                })
                app.state.regionLayers[key] = [];
            }
        });

        _.forEach(app.state.regionData, function(value, key) {
            console.log("  value: ", value);

            // == init selected region data display
            if (value && (app.state.regionLayers[key].length == 0)) {
                var regionArray = value;
                var nextFile = regionArray[0];
                var url = "bikelanes/" + nextFile;
                if (nextFile) { ajaxQueue(url, regionArray, key); }
            }
        });

        // == show selected region data
        function ajaxQueue(url, regionArray, key) {
            console.log("ajaxQueue");
            console.log("  url: ", url);
            $.ajax({
                url: url,
                method: "GET",
                dataType: "text"
            }).done(function(jsonData){
                console.log("*** ajax success ***");
                console.log("  loopCount: ", loopCount);
                var jsonData2 = $.parseJSON(jsonData);
                bikeLanes = L.mapbox.featureLayer(jsonData2).addTo(app.activeMap);
                app.state.regionLayers[key].push(bikeLanes);
                bikeLanes.setStyle(bikeLaneStyle);
                if (loopCount < regionArray.length - 1) {
                    loopCount++;
                    nextFile = regionArray[loopCount];
                    url = "bikelanes/" + nextFile;
                    ajaxQueue(url, regionArray, key);
                }
            }).fail(function(){
                console.log("*** ajax fail T ***");
            });
        }
    },

    // ======= makeLanesArray =======
    makeLanesArray: function(key) {
        console.log("app.makeLanesArray");
        var pathDataArray = [];
        if (app.state.laneType.lanes) {
            var laneFile = regions[key].laneFile;
            laneFile ? pathDataArray.push(laneFile) : console.log("NO LANES");
        }
        if (app.state.laneType.paths) {
            var pathFile = regions[key].pathFile;
            pathFile ? pathDataArray.push(pathFile) : console.log("NO PATHS");
        }
        if (app.state.laneType.trails) {
            var trailFile = regions[key].trailFile;
            trailFile ? pathDataArray.push(trailFile) : console.log("NO TRAILS");
        }
        return pathDataArray;
    },

    // ======= initMap =======
    initMap: function () {
        console.log("app.initMap");
        L.mapbox.accessToken = "pk.eyJ1IjoiYWx1bHNoIiwiYSI6ImY0NDBjYTQ1NjU4OGJmMDFiMWQ1Y2RmYjRlMGI1ZjIzIn0.pngboKEPsfuC4j54XDT3VA";
        var map = L.mapbox.map(
            app.map.mapEl,
            app.map.mapStyle,
            { zoomControl: false })
                .setView([app.map.centerLat, app.map.centerLng], app.map.zoom);
        new L.Control.Zoom({ position: "bottomright" }).addTo(map);
        return map;
    },

    // ======= initialize =======
    initialize: function () {
        console.log("app.initialize");
        app.activeMap = app.initMap();
        app.displayLanes();

        // ======= mouse location =======
        app.activeMap.on("mousemove", function (e) {
            document.getElementById("loc").innerHTML =
                "x:   " + JSON.stringify(e.layerPoint.x) + "   y:   " + JSON.stringify(e.layerPoint.y) + "<br />" +
                "lat: " + (e.latlng.lat).toFixed(2) + "   lng: " + (e.latlng.lng).toFixed(2);
        });

        // ======= filters =======
        $(".filterBoxes").on("mouseover", function (e) {
            if (e.target.id) { updateFilterBox(e.target.id, true); }
        });
        $(".filterBoxes").on("mouseout", function (e) {
            if (e.target.id) { updateFilterBox(e.target.id, false); }
            $("#hoverText").html("&nbsp;");
        });
        $(".filterBoxes").on("click", function (e) {
            console.log("\n-- click --");
            if (e.target.id) {
                if (app.state.selRegions[e.target.id]) {
                    app.state.selRegions[e.target.id] = false;
                    updateFilterBox(e.target.id, false);
                } else {
                    app.state.selRegions[e.target.id] = true;
                    updateFilterBox(e.target.id, true);
                }
            }
            console.log("  app.state.selRegions[e.target.id]: ", app.state.selRegions[e.target.id]);
            app.displayLanes();
        });
        $("#buffer").on("change", function (e) {
            console.log("buffer change");
            console.log("  $('#buffer').val(): ", $('#buffer').val());
            app.displayBuffers($('#buffer').val());
            // if (e.target.id) { updateFilterBox(e.target.id, true); }
        });

        function updateFilterBox(whichBox, hilite) {
            // console.log("updateFilterBox");
            if (hilite) {
                $("#" + whichBox).css("color", "white");
                $("#" + whichBox).css("background-color", "#9999ff");
                $("#hoverText").html(regions[whichBox].name);
            } else if (!app.state.selRegions[whichBox]) {
                $("#" + whichBox).css("color", "#9999ff");
                $("#" + whichBox).css("background-color", "white");
                $("#hoverText").html("&nbsp;");
            }
        }
    }
}

// ======= ARCHIVE =======

// ======= select filters =======
// $("#region").change(function (e) {
//     console.log("region");
//     let region = $(e.target).val();
//     console.log("region: ", region);
//     app.state.selRegions[region] = true;
//     console.log("  app.state.selRegions[region]: ", app.state.selRegions[region]);
//     app.displayLanes();
// });
//
// $("#buffer").change(function (e) {
//     console.log("buffer");
//     let buffer = $(e.target).val();
//     console.log("buffer: ", buffer);
// });











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
