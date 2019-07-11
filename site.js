(function() {

    // if testing locally get data from local folders, else retrieve from GitHub Pages
    if (location.hostname == 'localhost' || location.hostname == '127.0.0.1') {
        var lanesUrl = '/bikelanes/';
        var buffersUrl = '/buffers/';
        var countyUrl = '/counties/';
    } else {
        var baseUrl = 'https://dcfemtech.com/hackforgood-waba-map/';
        var lanesUrl = baseUrl + 'bikelanes/';
        var buffersUrl = baseUrl + 'buffers/';
        var countyUrl = baseUrl + 'counties/';
    }

    // ======= regions =======
    var regions = {
        AL: {
            id: 'AL_4',
            name: 'Alexandria',
            countyFile: countyUrl + 'VA_Alexandria.geojson',
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
                ft500: buffersUrl + 'VA_Alexandria_buffer_500ft.geojson',
                ft1000: buffersUrl + 'VA_Alexandria_buffer_1000ft.geojson',
                ft2500: buffersUrl + 'VA_Alexandria_buffer_2500ft.geojson',
                ft5280: buffersUrl + 'VA_Alexandria_buffer_1mile.geojson'
            }
        },
        AR: {
            id: 'AR_3',
            name: 'Arlington',
            countyFile: countyUrl + 'VA_Arlington.geojson',
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
                ft500: buffersUrl + 'VA_Arlington_buffer_500ft.geojson',
                ft1000: buffersUrl + 'VA_Arlington_buffer_1000ft.geojson',
                ft2500: buffersUrl + 'VA_Arlington_buffer_2500ft.geojson',
                ft5280: buffersUrl + 'VA_Arlington_buffer_1mile.geojson'
            }
        },
        DC: {
            id: 'DC_0',
            name: 'District of Columbia',
            countyFile: countyUrl + 'DC_Washington.geojson',
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
                ft500: buffersUrl + 'DC_Washington_buffer_500ft.geojson',
                ft1000: buffersUrl + 'DC_Washington_buffer_1000ft.geojson',
                ft2500: buffersUrl + 'DC_Washington_buffer_2500ft.geojson',
                ft5280: buffersUrl + 'DC_Washington_buffer_1mile.geojson'
            }
        },
        FX: {
            id: 'FX_4',
            name: 'Fairfax',
            countyFile: countyUrl + 'VA_Fairfax.geojson',
            box: {
                NW: [null, null],
                SE: [null, null]
            },
            laneFiles: {
                lanes: lanesUrl + 'VA_Fairfax.geojson',
                paths: null,
                trails: null
            },
            bufferFiles: {
                ft500: buffersUrl + 'VA_Fairfax_buffer_500ft.geojson',
                ft1000: buffersUrl + 'VA_Fairfax_buffer_1000ft.geojson',
                ft2500: buffersUrl + 'VA_Fairfax_buffer_2500ft.geojson',
                ft5280: buffersUrl + 'VA_Fairfax_buffer_1mile.geojson'
            }
        },
        MO: {
            id: 'MO_1',
            name: 'Montgomery County',
            countyFile: countyUrl + 'MD_MontgomeryCounty.geojson',
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
                ft500: buffersUrl + 'MD_MontgomeryCounty_buffer_500ft.geojson',
                ft1000: buffersUrl + 'MD_MontgomeryCounty_buffer_1000ft.geojson',
                ft2500: buffersUrl + 'MD_MontgomeryCounty_buffer_2500ft.geojson',
                ft5280: buffersUrl + 'MD_MontgomeryCounty_buffer_1mile.geojson'
            }
        },
        PG: {
            id: 'PG_2',
            name: 'Prince George\'s County',
            countyFile: countyUrl + 'MD_PrinceGeorgesCounty.geojson',
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
                ft500: buffersUrl + 'MD_PrinceGeorgesCounty_buffer_500ft.geojson',
                ft1000: buffersUrl + 'MD_PrinceGeorgesCounty_buffer_1000ft.geojson',
                ft2500: buffersUrl + 'MD_PrinceGeorgesCounty_buffer_2500ft.geojson',
                ft5280: buffersUrl + 'MD_PrinceGeorgesCounty_buffer_1mile.geojson'
            }
        }
    }

    // ======= initialize map =======
    mapboxgl.accessToken = 'pk.eyJ1IjoiYWx1bHNoIiwiYSI6ImY0NDBjYTQ1NjU4OGJmMDFiMWQ1Y2RmYjRlMGI1ZjIzIn0.pngboKEPsfuC4j54XDT3VA';

    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v9',
        center: [-77.0354, 38.8990],
        zoom: 9
    });

    map.addControl(new mapboxgl.Navigation({
        'position': 'bottom-right'
    }));

    // ======= add county lines =======
    function addCounties(region) {
        map.addSource(region + 'county-src', {
            type: 'geojson',
            data: regions[region].countyFile
        });
        map.addLayer({
            id: region + 'county-layer',
            type: 'line',
            source: region + 'county-src',
            layout: {
                'line-join': 'round',
                'line-cap': 'round',
                'visibility': 'visible'
            },
            paint: {
                'line-color': '#707070',
                'line-width': 1
            }
        });
    }


    // ======= add bike lanes =======
    function addLanes(region) {
        map.addSource(region + 'lanes-src', {
            type: 'geojson',
            data: regions[region].laneFiles.lanes
        });

        map.addLayer({
            id: region + 'lanes-layer',
            type: 'line',
            source: region + 'lanes-src',
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
    function addBuffer(region, feet) {
        map.addSource(region + feet + 'buffers-src', {
            type: 'geojson',
            data: regions[region].bufferFiles[feet]
        });

        map.addLayer({
            id: region + feet + 'buffers-layer',
            type: 'fill',
            source: region + feet + 'buffers-src',
            layout: {
                visibility: 'none',
            },
            paint: {
                'fill-outline-color': '#1A3742',
                'fill-color': '#7BEA7B',
                'fill-opacity': 0.3
            }
        });
    }

    // ======= make layer visibile or invisible =======
    function toggleLayerVisibility(layer) {
        var vis = map.getLayoutProperty(layer, 'visibility');

        if (vis == 'none') {
            map.setLayoutProperty(layer, 'visibility', 'visible');
        } else {
            map.setLayoutProperty(layer, 'visibility', 'none');
        }
    }

    // ======= initialize map layers =======
    map.on('load', function() {
        for (region in regions) {
            addCounties(region);
            if (regions[region].bufferFiles.ft500) {
                addBuffer(region, 'ft500');
            }
            //console.log(regions[r].id + 'ft500' + 'buffers-layer')
            if (regions[region].bufferFiles.ft1000) {
                addBuffer(region, 'ft1000');
            }
            if (regions[region].bufferFiles.ft2500) {
                addBuffer(region, 'ft2500');
            }
            if (regions[region].bufferFiles.ft5280) {
                addBuffer(region, 'ft5280');
            }
            addLanes(region);
        }
    });

    // ======= toggle buffers visibile or invisible =======
    $('.buffer').on('click', function() {
        toggleLayerVisibility($(this).parent().parent().attr('id') + $(this).attr('class').split(' ')[1] + 'buffers-layer');
        $(this).toggleClass('selected');
    });

    // ======= toggle lanes visibile or invisible =======
    $('.label-r').on('click', function() {
        if ($(this).text() == 'all') {
            for (r in regions) {
                map.setLayoutProperty(r + 'lanes-layer', 'visibility', 'none');
            }
            $('.region').removeClass('selected');
        } else {
            toggleLayerVisibility($(this).text() + 'lanes-layer');
        }
        $(this).parent().toggleClass('selected');
    });

    // ======= menu drag functions =======
    var dragger, startLoc;

    $('#menuDrag, #infoDrag').on('mousedown', function(e) {
        dragger = $(e.currentTarget).parent('div');
        e.preventDefault();
        initDrag(e);
    });

    function initDrag(e){
        var locXY = $(dragger).offset();

        $(dragger).css('position', 'absolute');
        startLoc = { x: 0, y: 0 };
        startLoc.x = e.clientX - locXY.left;
        startLoc.y = e.clientY - locXY.top;

        window.addEventListener('mousemove', draggerMove, true);
        window.addEventListener('mouseup', mouseUp, true);
    }

    function draggerMove(e){
        var top = e.clientY - startLoc.y;
        var left = e.clientX - startLoc.x;
        $(dragger).css('top', top + 'px');
        $(dragger).css('left', left + 'px');
    }

    function mouseUp() {
        window.removeEventListener('mousemove', draggerMove, true);
    }

    // ======= error box =======
    function activateErrorModal() {
        $('#error-box button').on('click', function() {
            $('#error-box').fadeOut(200);
        });
    }

}());