mapboxgl.accessToken = 'pk.eyJ1IjoiYWx1bHNoIiwiYSI6ImY0NDBjYTQ1NjU4OGJmMDFiMWQ1Y2RmYjRlMGI1ZjIzIn0.pngboKEPsfuC4j54XDT3VA';

var lanesUrl = 'https://raw.githubusercontent.com/dcfemtech/hackforgood-waba-map/master/bikelanes/';
var buffersUrl = 'https://raw.githubusercontent.com/dcfemtech/hackforgood-waba-map/master/buffers/';

// ======= regions =======
var regions = {
    AL: {
        id: 'AL_4',
        name: 'Alexandria',
        box: {
            NW: [null, null],
            SE: [null, null]
        },
        laneFiles: {
            lanes: lanesUrl + 'VA_Alexandria.geojson',
            paths: null,
            trails: null
        },
        bufferFiles: {
            ft500: buffersUrl + 'VA_Alexandria_Bike_Buffer_500ft.geojson',
            ft1000: buffersUrl + 'VA_Alexandria_Bike_Buffer_1000ft.geojson',
            ft2500: buffersUrl + 'VA_Alexandria_Bike_Buffer_2500ft.geojson',
            ft5280: buffersUrl + 'VA_Alexandria_Bike_Buffer_5280ft.geojson'
        }
    },
    AR: {
        id: 'AR_3',
        name: 'Arlington',
        box: {
            NW: [null, null],
            SE: [null, null]
        },
        laneFiles: {
            lanes: lanesUrl + 'VA_Arlington.geojson',
            paths: null,
            trails: null
        },
        bufferFiles: {
            ft500: buffersUrl + 'VA_Arlington_Bike_Buffer_500ft.geojson',
            ft1000: buffersUrl + 'VA_Arlington_Bike_Buffer_1000ft.geojson',
            ft2500: buffersUrl + 'VA_Arlington_Bike_Buffer_2500ft.geojson',
            ft5280: buffersUrl + 'VA_Arlington_Bike_Buffer_5280ft.geojson'
        }
    },
    DC: {
        id: 'DC_0',
        name: 'District of Columbia',
        box: {
            NW: [null, null],
            SE: [null, null]
        },
        laneFiles: {
            lanes: lanesUrl + 'DC_Washington.geojson',
            paths: null,
            trails: null
        },
        bufferFiles: {
            ft500: buffersUrl + 'DC_Bike_Buffer_500ft.geojson',
            ft1000: buffersUrl + 'DC_Bike_Buffer_1000ft.geojson',
            ft2500: buffersUrl + 'DC_Bike_Buffer_2500ft.geojson',
            ft5280: buffersUrl + 'DC_Bike_Buffer_5280ft.geojson'
        }
    },
    MO: {
        id: 'MO_1',
        name: 'Montgomery County',
        box: {
            NW: [null, null],
            SE: [null, null]
        },
        laneFiles: {
            lanes: lanesUrl + 'MD_MontgomeryCounty.geojson',
            paths: null,
            trails: null
        },
        bufferFiles: {
            ft500: buffersUrl + 'MD_MontgomeryCounty_Bikeways_Buffer_500ft.geojson',
            ft1000: buffersUrl + 'MD_MontgomeryCounty_Bikeways_Buffer_1000ft.geojson',
            ft2500: buffersUrl + 'MD_MontgomeryCounty_Bikeways_Buffer_2500ft.geojson',
            ft5280: buffersUrl + 'MD_MontgomeryCounty_Bikeways_Buffer_5280ft.geojson'
        }
    },
    PG: {
        id: 'PG_2',
        name: 'Prince George\'s County',
        box: {
            NW: [null, null],
            SE: [null, null]
        },
        laneFiles: {
            lanes: lanesUrl + 'MD_PrinceGeorgesCounty.geojson',
            paths: null,
            trails: null
        },
        bufferFiles: {
            ft500: null,
            ft1000: null,
            ft2500: null,
            ft5280: null
        }
    },
}

// ======= initialize map =======
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v8',
    center: [-77.0354, 38.8990],
    zoom: 11
});

map.addControl(new mapboxgl.Navigation({
    'position': 'bottom-right'
}));

// ======= directions =======
var directions = new mapboxgl.Directions({
    position: 'top-left',
    profile: 'cycling'
});

map.addControl(directions);

// ======= add bike lanes =======
function addLanes(REGION) {
    map.addSource(REGION + 'lanes-src', {
        type: 'geojson',
        data: regions[REGION].laneFiles.lanes
    });
    map.addLayer({
        id: REGION + 'lanes-layer',
        type: 'line',
        source: REGION + 'lanes-src',
        layout: {
            'line-join': 'round',
            'line-cap': 'round',
            'visibility': 'visible'
        },
        paint: {
            'line-color': 'green',
            'line-width': 2
        }
    });
}

// ======= add buffer =======
function addBuffer(REGION, FEET) {
    map.addSource(REGION + FEET + 'buffers-src', {
        type: 'geojson',
        data: regions[REGION].bufferFiles[FEET]
    });
    map.addLayer({
        id: REGION + FEET + 'buffers-layer',
        type: 'fill',
        source: REGION + FEET + 'buffers-src',
        layout: {
            visibility: 'none',
        },
        paint: {
            'fill-outline-color': '#1A3742',
            'fill-color': '#56B6DB',
            'fill-opacity': 0.5
        }
    });
}

// ======= make layer visibile or invisible =======
function toggleLayerVisibility(LAYER) {
    var vis = map.getLayoutProperty(LAYER, 'visibility');
    if (vis == 'none') {
        map.setLayoutProperty(LAYER, 'visibility', 'visible');
    } else {
        map.setLayoutProperty(LAYER, 'visibility', 'none');
    }
}

// ======= initialize map layers =======
map.on('load', function () {
    for (r in regions) {
        addLanes(r);
        if (regions[r].bufferFiles.ft500) {
            addBuffer(r, 'ft500');
        }
        //console.log(regions[r].id + 'ft500' + 'buffers-layer')
        if (regions[r].bufferFiles.ft1000) {
            addBuffer(r, 'ft1000');
        }
        if (regions[r].bufferFiles.ft2500) {
            addBuffer(r, 'ft2500');
        }
        if (regions[r].bufferFiles.ft5280) {
            addBuffer(r, 'ft5280');
        }
    }
});

// ======= get coordinates under the mouse =======
map.on('mousemove', function (e) {
    document.getElementById('lat').innerHTML = JSON.stringify(e.lngLat['lat']);
    document.getElementById('lng').innerHTML = JSON.stringify(e.lngLat['lng']);
});

// ======= toggle buffers visibile or invisible =======
$('.buffer').on('click', function () {
    toggleLayerVisibility($(this).parent().parent().attr("id") + $(this).attr("class").split(' ')[1] + 'buffers-layer');
    $(this).toggleClass('selected');
});

// ======= toggle lanes visibile or invisible =======
$('.label-r').on('click', function () {
    if ($(this).text() == "all") {
        for (r in regions) {
            map.setLayoutProperty(r + 'lanes-layer', 'visibility', 'none');
        }
        $('.region').removeClass('selected');
    } else {
        toggleLayerVisibility($(this).text() + 'lanes-layer');
    }
    $(this).parent().toggleClass('selected');
});