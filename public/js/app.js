var map;

var config = {
    center: [
        -122.3321,
        47.6062
    ],
    treeAreas: {
        1: [-122.3321, 47.6062],
        2: [-125.3321, 46.6062],
        3: [-123.3321, 41.6062],
        4: [-122.4321, 47.6062]
    }
};

var app = {
    state: {
        actionTab: 'action-home'
    },
    classes: {},
    map: null,
    init: init
};

function emptyFn() {

}

var wizard = function() {
    this.step = 0;
    this.area = null;
    this.num_trees = 0;
    this.credit_card_num = null;
    this.credit_card_name = null;
    this.credit_card_expire_month = null;
    this.credit_card_expire_day = null;
    this.cvv = null;

    this.started = false;
};

wizard.prototype.statics = {
    steps: [1, 2, 3, 4],
    num_trees: [
        {
            num: 1,
            written: 'One tree',
            cancelled: 5
        },
        {
            num: 5,
            written: 'Five trees',
            cancelled: 30
        },
        {
            num: 10,
            written: 'Ten trees',
            cancelled: 60
        },
        {
            num: 50,
            written: 'Fifty trees',
            cancelled: 5
        }
    ]
};

wizard.prototype.start = function() {
    this.step = 1;
    this.started = true
    this.showStep(this.step);
}

wizard.prototype.back = function() {
    if (!this.started) {
        console.log('Have not started');
        return
    }

    if (this.step <= this.statics.steps[0]) {
        console.log('Cant go back. First step');
        return;
    }

    this.step--;
    this.showStep(this.step);
}

wizard.prototype.next = function() {
    if (!this.started) {
        console.log('Have not started');
        return
    }

    var num_steps = this.statics.steps.length

    if (this.step >= this.statics.steps[num_steps - 1]) {
        console.log('Reached last step. Can not go forward');
        return;
    }

    this.step++;
    this.showStep(this.step);
}

wizard.prototype.validate = function(el) {
    return true
}

wizard.prototype.showStep = function(step) {
    var me = this;
    
    if (this.statics.steps.indexOf(step) == -1) {
        console.log('Invalid step');
        return
    }

    var titleHtml = [
            'Plant a tree'
        ],
        descriptionHtml = [],
        mainHtml = [],
        buttonsHtml = []
        fn = emptyFn;

    if (step == 1) {

        descriptionHtml = [
            '<div class="x-description">',
                'Drop pins where you want to plant',
            '</div>'
        ];

        mainHtml = [
            '<div class="x-map-drop">',
                '<div data-dojo-type="dijit/layout/BorderContainer" ',
                    'data-dojo-props="design:\'headline\',gutters:false" ',
                    'style="width: 100%; height: 100%; margin: 0;">',
                    '<div id="map-drop" ',
                         'data-dojo-type="dijit/layout/ContentPane"',
                         'data-dojo-props="region:\'center\'"> ',
                    '</div>',
                '</div>',
            '</div>'                        
        ];
        
        buttonsHtml = [
            '<div class="x-btn x-btn-next">',
                'Next',
            '</div>'
        ];

        fn = function(win) {            
            var newMap = new app.classes.Map('map-drop', {
                basemap: "oceans",
                center: config.center,
                zoom: 13
            });

            newMap.on("load", function() {                
                $.each(config.treeAreas, function(key, value) {
                   app.addPoint(value, newMap);                                      
                });
                
                $('#map-drop').css({
                    position: 'inherit'
                });
            });
        }
    } else if(step == 2) {
        descriptionHtml = [
            '<div class="x-description">',
                'How many trees to you want to plant in this area?',
            '</div>'
        ];
        
        var radios = [];
       
       var i = 0;
        
        me.statics.num_trees.forEach(function(n){            
            var num = n.num,
                written = n.written,
                cancelled = n.cancelled;
            
            var cls = i % 2;
            i++;
            
            var radio = [
                '<div class="x-option x-row-' + cls + '">',
                    '<div class="x-form-part">',
                        '<input type="radio" name="num-trees" value="' + num + '"/>',
                        '<span class="x-radio-value">',
                            written,
                        '</span>',
                    '</div>',
                    '<div class="x-explanation-part">',
                        '<span class="x-t-orange-text">',
                            cancelled + ' ' + 'lbs ',
                        '</span>',
                        'of CO2 emissions will be cancelled',
                    '</div>',
                '</div>'
            ];
            
            radios.push(radio.join(''))
        });

        mainHtml = [
            '<form class="x-num-trees-selector">',
                radios.join(''),
            '</form>'
        ];
        
        buttonsHtml = [
            '<div class="x-btn x-btn-prev">',
                'Next',
            '</div>',
            '<div class="x-btn x-btn-next">',
                'Next',
            '</div>'
        ];
    }
    
    var stepDivs = [];
    
    this.statics.steps.forEach(function(s){
       var cls = '';
       
       if (s == step) {
           cls = 'x-active';
       }
       
       stepDivs.push('<div class="x-step ' + cls + '"></div>');
    });
    
    // @todo
    var html = [
        '<div class="x-window">',
            '<div class="x-win-title x-t-green-background">',
                titleHtml.join(''),
            '</div>',
            '<div class="x-win-body">',
                '<div class="x-win-description">',
                    descriptionHtml.join(''),
                '</div>',
                '<div class="x-win-main">',
                    mainHtml.join(''),
                '</div>',    
                '<div class="x-steps">',
                    stepDivs.join(''),
                '</div>',
                '<div class="x-win-buttons">',
                    buttonsHtml.join(''),
                '</div>',
            '</div>',
        '</div>'
    ];
    
    var el = $(html.join(''));  
    
    
    el.find('.x-btn').click(function(){
        var btn = $(this);
        
        if (btn.hasClass('x-btn-next')){
            if (me.validate(el)) {
                me.next();
            }     
            return;
        }
        
        if (btn.hasClass('x-btn-prev')) {
            me.prev();
            return;
        }
    });
    
    var modal = $('.x-modal');
    
    modal.empty();
    modal.append(el);
    
    setTimeout(function(){
        fn(el);
    }, 10);    
}

require([
    "dojo/parser",
    "dojo/ready",
    "dojo/_base/array",
    "esri/Color",
    "dojo/dom-style",
    "dojo/query",
    "esri/map",
    "esri/request",
    "esri/graphic",
    "esri/geometry/Extent",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/PictureMarkerSymbol",
    "esri/renderers/ClassBreaksRenderer",
    "esri/layers/GraphicsLayer",
    "esri/SpatialReference",
    "esri/dijit/PopupTemplate",
    "esri/geometry/Point",
    "esri/geometry/webMercatorUtils",
    "extras/ClusterLayer",
    "dijit/layout/BorderContainer",
    "dijit/layout/ContentPane",
    "dojo/domReady!"
], function(
        parser, ready, arrayUtils, Color, domStyle, query,
        Map, esriRequest, Graphic, Extent,
        SimpleMarkerSymbol, SimpleFillSymbol, PictureMarkerSymbol, ClassBreaksRenderer,
        GraphicsLayer, SpatialReference, PopupTemplate, Point, webMercatorUtils,
        ClusterLayer
        ) {
    ready(function() {
        parser.parse();

        var clusterLayer;
        var popupOptions = {
            "markerSymbol": new SimpleMarkerSymbol("circle", 20, null, new Color([0, 0, 0, 0.25])),
            "marginLeft": "20",
            "marginTop": "20"
        };
        map = new Map("map", {
            basemap: "oceans",
            center: config.center,
            zoom: 13
        });


        app.map = map;
        
        app.classes.Map = Map

        map.on("load", function() {
            // hide the popup's ZoomTo link as it doesn't make sense for cluster features
            domStyle.set(query("a.action.zoomTo")[0], "display", "none");

//            var photos = esriRequest({
//                url: "data/1000-photos.json",
//                handleAs: "json"
//            });
//            photos.then(addClusters, error);

            app.init();
        });
        
        
        //@todo
        function addPoint(geo, map) {
            var markerSymbol = new SimpleMarkerSymbol();
            
            var wgs = new SpatialReference({
                "wkid": 4326
            });
            
            var latlng = new Point(parseFloat(geo[0]), parseFloat(geo[1]), wgs);
            var webMercator = webMercatorUtils.geographicToWebMercator(latlng);

            var a = {
                "x": webMercator.x,
                "y": webMercator.y
            };
            
            map.graphics.add(new Graphic(a, markerSymbol));
        }

        function addClusters(resp, map) {
            var photoInfo = {};
            var wgs = new SpatialReference({
                "wkid": 4326
            });

            photoInfo.data = arrayUtils.map(resp, function(p) {
                var latlng = new Point(parseFloat(p.lng), parseFloat(p.lat), wgs);
                var webMercator = webMercatorUtils.geographicToWebMercator(latlng);

                var attributes = {
                    "Caption": p.caption,
                    "Name": p.full_name,
                    "Image": p.image,
                    "Link": p.link
                };

                return {
                    "x": webMercator.x,
                    "y": webMercator.y,
                    "attributes": attributes
                };
            });

            // popupTemplate to work with attributes specific to this dataset
            var popupTemplate = new PopupTemplate({
                "title": "",
                "fieldInfos": [{
                        "fieldName": "Caption",
                        visible: true
                    }, {
                        "fieldName": "Name",
                        "label": "By",
                        visible: true
                    }, {
                        "fieldName": "Link",
                        "label": "On Instagram",
                        visible: true
                    }],
                "mediaInfos": [{
                        "title": "",
                        "caption": "",
                        "type": "image",
                        "value": {
                            "sourceURL": "{Image}",
                            "linkURL": "{Link}"
                        }
                    }]
            });

            // cluster layer that uses OpenLayers style clustering
            clusterLayer = new ClusterLayer({
                "data": photoInfo.data,
                "distance": 100,
                "id": "clusters",
                "labelColor": "#fff",
                "labelOffset": 10,
                "resolution": map.extent.getWidth() / map.width,
                "singleColor": "#888",
                "singleTemplate": popupTemplate
            });

            var defaultSym = new SimpleMarkerSymbol().setSize(4);
            var renderer = new ClassBreaksRenderer(defaultSym, "clusterCount");

            var picBaseUrl = "https://static.arcgis.com/images/Symbols/Shapes/";
            var blue = new PictureMarkerSymbol(picBaseUrl + "BluePin1LargeB.png", 32, 32).setOffset(0, 15);
            var green = new PictureMarkerSymbol(picBaseUrl + "GreenPin1LargeB.png", 64, 64).setOffset(0, 15);
            var red = new PictureMarkerSymbol(picBaseUrl + "RedPin1LargeB.png", 72, 72).setOffset(0, 15);
            renderer.addBreak(0, 2, blue);
            renderer.addBreak(2, 200, green);
            renderer.addBreak(200, 1001, red);

            clusterLayer.setRenderer(renderer);
            map.addLayer(clusterLayer);

            // close the info window when the map is clicked
            map.on("click", cleanUp);
            // close the info window when esc is pressed
            map.on("key-down", function(e) {
                if (e.keyCode === 27) {
                    cleanUp();
                }
            });
        }

        function cleanUp() {
            map.infoWindow.hide();
            clusterLayer.clearSingles();
        }

        function error(err) {
            console.log("something failed: ", err);
        }

        // show cluster extents...
        // never called directly but useful from the console 
        window.showExtents = function() {
            var extents = map.getLayer("clusterExtents");
            if (extents) {
                map.removeLayer(extents);
            }
            extents = new GraphicsLayer({id: "clusterExtents"});
            var sym = new SimpleFillSymbol().setColor(new Color([205, 193, 197, 0.5]));

            arrayUtils.forEach(clusterLayer._clusters, function(c, idx) {
                var e = c.attributes.extent;
                extents.add(new Graphic(new Extent(e[0], e[1], e[2], e[3], map.spatialReference), sym));
            }, this);
            map.addLayer(extents, 0);
        };

        app.addClusters = addClusters;
        app.addPoint = addPoint;
        app.cleanUp = cleanUp;
    });
});


function init() {
    /*
     * Aweful hack to make the widths work
     */
    $('#map').css({
        position: 'inherit'
    });

    initEvents();
}

function initEvents() {
    var actionButtons = $('.x-action');

    actionButtons.click(function(e) {
        var target = $(e.target).closest('.x-action'),
                action = target.attr('id');


        switch (action) {
            case 'action-home':
                initActionHome();
                break;
            case 'action-my-trees':
                initActionMyTrees();
                break;
            case 'action-ranking':
                initActionRanking();
                break;
            default:
                console.log('Unknown action ', action);
        }
    });
}

function setBodyAction(action) {
    var body = $(document.body);

    var actions = [
        'action-home',
        'action-my-trees',
        'action-ranking'
    ];

    actions.forEach(function(act) {
        if (act != action) {
            body.removeClass('x-' + act);
        }
    });

    body.addClass('x-' + action);
    $(window).trigger('resize');
}

function initActionHome(force) {
    var action = 'action-home';

    if (!force && app.state.actionTab == action) {
        console.log('Action already clicked');
        return;
    }

    var actionButtons = $('.x-action'),
            actionBtn = $('#' + action);

    actionButtons.removeClass('x-active');
    actionBtn.addClass('x-active');

    app.state.actionTab = action;

    setBodyAction(action);
}

function initActionMyTrees(force) {
    var action = 'action-my-trees';

    if (!force && app.state.actionTab == action) {
        console.log('Action already clicked');
        return;
    }

    var actionButtons = $('.x-action'),
            actionBtn = $('#' + action);

    actionButtons.removeClass('x-active');
    actionBtn.addClass('x-active');

    app.state.actionTab = action;

    setBodyAction(action);

    app.cleanUp();

    var url = '/data/1000-photos.json';
    $.ajax({
        url: url,
        success: function(response) {
            app.addClusters(response);
        },
        error: function() {
            console.log('Error in url ', url)
        }
    });
}

function initActionRanking(force) {
    var action = 'action-ranking';

    if (!force && app.state.actionTab == action) {
        console.log('Action already clicked');
        return;
    }

    var actionButtons = $('.x-action'),
            actionBtn = $('#' + action);

    actionButtons.removeClass('x-active');
    actionBtn.addClass('x-active');

    app.state.actionTab = action;

    setBodyAction(action);
}


function displayError(error) {
    console.log(error);
}

function loginCallBack() {
    
}