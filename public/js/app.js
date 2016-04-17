var map;

var config = {
    center: [
        -122.313126,
        47.6247503
    ],
    treeTypes: {
        'pine': {
            id: '123',
            name: 'Pine',
            o2: 260,
            co2: 48,
            img: ''
        },
        'oak': {
            id: '456',
            name: 'Oak',
            o2: 260,
            co2: 48
        }
    },
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
    this.lat = null;
    this.lng = null;
    this.num_trees = 0;
    this.credit_card_num = null;
    this.credit_card_name = null;
    this.credit_card_expire_month = null;
    this.credit_card_expire_year = null;
    this.credit_card_cvc = null;

    this.co2_rate = 0;
    this.o2_rate = 0
    this.tree_id = null;

    this.started = false;
};

wizard.prototype.statics = {
    steps: [1, 2, 3, 4],
    num_trees: [
        {
            num: 1,
            written: 'One tree',
            cancelled: config.treeTypes.oak.co2 * 1
        },
        {
            num: 5,
            written: 'Five trees',
            cancelled: config.treeTypes.oak.co2 * 5
        },
        {
            num: 10,
            written: 'Ten trees',
            cancelled: config.treeTypes.oak.co2 * 10
        },
        {
            num: 50,
            written: 'Fifty trees',
            cancelled: config.treeTypes.oak.co2 * 50
        }
    ]
};

wizard.prototype.start = function() {
    this.step = 1;
    this.started = true

    $('.x-modal').empty();
    $('.x-modal-background').addClass('x-active');

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

wizard.prototype.end = function(el) {
    $('.x-modal').empty();
    $('.x-modal-background').removeClass('x-active');

    initActionMyTrees(true);
}

wizard.prototype.validate = function(el) {
    return true
}

wizard.prototype.send = function(el) {
    var me = this;
    var x = 0;

    for (var i = 1; i <= this.num_trees; i++) {
        me.performRequest(i);
    }
}

wizard.prototype.performRequest = function(num) {
    var me = this;

    $.ajax({
        url: '/plant',
        method: 'post',
        data: JSON.stringify({
            type: me.tree_id
        }),
        success: function() {
            if (num == me.num_trees) {
                me.next();
            }
        }
    });
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

    if (false) {

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

            newMap.on("click", function(e) {
                console.log(e.geometry);
            });
        }
    } else if (step == 1) {
        descriptionHtml = [
            '<div class="x-description">',
            'Click on the type of tree that you want to plant',
            '</div>'
        ];

        mainHtml = [
            '<div class="x-tree-chooser">',
            '<div class="x-tree-img x-pine"></div>',
            '<div class="x-tree-img x-oak"></div>',
            '</div>'
        ];

        buttonsHtml = [
            '<div class="x-btn x-btn-next">',
            'Next',
            '</div>'
        ];

        fn = function(win) {
            var trees = win.find('.x-tree-img');

            trees.click(function() {
                trees.removeClass('x-selected');
                var target = $(this);

                target.addClass('x-selected');

                var tree = config.treeTypes.pine;

                if (target.hasClass('x-oak')) {
                    tree = config.treeTypes.oak
                }

                me.tree_id = tree.id;
                me.co2_rate = tree.co2;
                me.o2_rate = tree.o2;
            });
        }

    } else if (step == 2) {
        descriptionHtml = [
            '<div class="x-description">',
            'How many trees to you want to plant in this area?',
            '</div>'
        ];

        var radios = [];

        var i = 0;

        me.statics.num_trees.forEach(function(n) {
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

        var cls = i % 2;
        var otherRadio = [
            '<div class="x-option x-other x-row-' + cls + '">',
            '<div class="x-form-part">',
            '<input type="radio" name="num-trees" value="0"/>',
            '<span class="x-radio-value">Other</span>',
            '</div>',
            '<div class="x-explanation-part">',
            '<input type="text" name="other-num" placeholder="Enter number here" />',
            '</div>',
            '</div>'
        ];

        radios.push(otherRadio.join(''));

        mainHtml = [
            '<form class="x-num-trees-selector">',
            radios.join(''),
            '</form>'
        ];

        buttonsHtml = [
            '<div class="x-btn x-btn-next">',
            'Next',
            '</div>'
        ];

        fn = function(win) {
            var radios = win.find('.x-option input[type=radio]'),
                    otherRadio = win.find('.x-other input[type=radio]'),
                    otherOption = win.find('.x-other'),
                    text = win.find('.x-explanation-part input');

            radios.change(function() {
                var target = $(this);

                if (otherRadio.is(':checked')) {
                    otherOption.addClass('x-checked');
                } else {
                    otherOption.removeClass('x-checked');

                    me.num_trees = target.val();
                }
            });

            text.change(function() {
                me.num_trees = text.val();
            });
        }
    } else if (step == 3) {
        descriptionHtml = [
            '<div class="x-description">',
            'Please provide your payment info',
            '</div>'
        ];

        mainHtml = [
            '<div class="x-payment-form-holder">',
            '<div class="x-form-title">',
            'Credit Card Info',
            '</div>',
            '<form class="x-payment-form">',
            '<div class="x-form-row">',
            '<input type="text" name="card_number" placeholder="Card number" />',
            '</div>',
            '<div class="x-form-row">',
            '<input type="text" name="card_name" placeholder="Name on card" />',
            '</div>',
            '<div class="x-form-row x-divided">',
            '<select name="card_month">',
            '<option value="0" selected>Expiration Month</option>',
            '<option value="1">January</option>',
            '<option value="2">February</option>',
            '<option value="3">March</option>',
            '<option value="4">April</option>',
            '<option value="5">May</option>',
            '<option value="6">June</option>',
            '<option value="7">July</option>',
            '<option value="8">August</option>',
            '<option value="9">September</option>',
            '<option value="10">October</option>',
            '<option value="11">November</option>',
            '<option value="12">December</option>',
            '</select>',
            '<input type="text" name="card_year" placeholder="Expiration year" />',
            '<input type="text" name="cvc" placeholder="CVC" />',
            '</div>',
            '</form>',
            '</div>'
        ];

        buttonsHtml = [
            '<div class="x-btn x-btn-send">',
            'Pay',
            '</div>'
        ];

        fn = function(win) {
            var creditnum = win.find('input[name=card_number]'),
                    cardname = win.find('input[name=card_name]'),
                    cardmonth = win.find('select[name=card_month]'),
                    card_year = win.find('input[name=card_year]'),
                    card_cvc = win.find('input[name=cvc]');

            win.find('input, select').change(function() {
                me.credit_card_num = creditnum.val();
                me.credit_card_expire_month = cardmonth.find(':selected').val();
                me.credit_card_name = cardname.val();
                me.credit_card_expire_year = card_year.val();
                me.credit_card_cvc = card_cvc.val();
            });
        }
    } else {
        descriptionHtml = [];

        mainHtml = [
            '<div class="x-plant-congrats">',
            '<h2>Congratulations!</h2>',
            'You\'ve just planted ',
            '<span class="x-t-orange-text">',
            me.num_trees,
            '</span>! ',
            'These trees will generate ',
            '<span class="x-t-orange-text">',
            me.num_trees * me.o2_rate + ' lbs of oxygen ',
            '</span>',
            'per year!',
            '</div>'
        ];

        buttonsHtml = [
            '<div class="x-btn x-btn-finish">',
            'Finish',
            '</div>'
        ];
    }

    var stepDivs = [];

    this.statics.steps.forEach(function(s) {
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


    el.find('.x-btn').click(function() {
        var btn = $(this);

        if (btn.hasClass('x-btn-next')) {
            if (me.validate(el)) {
                me.next();
            }
            return;
        }

        if (btn.hasClass('x-btn-prev')) {
            me.back();
            return;
        }


        if (btn.hasClass('x-btn-send')) {
            me.send();
            return;
        }

        if (btn.hasClass('x-btn-finish')) {
            me.end();
        }
    });

    var modal = $('.x-modal');

    modal.empty();
    modal.append(el);

    setTimeout(function() {
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
                var latlng = new Point(p.location.y, p.location.x, wgs);
                var webMercator = webMercatorUtils.geographicToWebMercator(latlng);


                var attributes = {
                    "Caption": p.type,
                    "Image": p.img,
                    "Oxygen": 'aa'
                };

                return {
                    "x": webMercator.x,
                    "y": webMercator.y,
                    "attributes": attributes
                };
            });

            console.log(photoInfo)

            // popupTemplate to work with attributes specific to this dataset
            var popupTemplate = new PopupTemplate({
                "title": "",
                "fieldInfos": [{
                        "fieldName": "Caption",
                        label: 'Tree type',
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

            function cleanUp() {
                map.infoWindow.hide();
                clusterLayer.clearSingles();
            }

            app.clean = function() {
                clusterLayer.clear();
                map.removeLayer(clusterLayer);
            }

            app.clusterLayer = clusterLayer;
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

    initActionHome(true);
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

    var createDashboard = $('.x-plant-button');
    createDashboard.click(function() {
        var wiz = new wizard();
        wiz.start();
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

    if (app.clean) {
        app.clean();
    }

    var url = '/trees';
    $.ajax({
        url: url,
        success: function(response) {
            app.addClusters(response, app.map);
        },
        error: function() {
            console.log('Error in url ', url)
        }
    });
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

    var congratsDescription = $('.x-congrats-description');
    congratsDescription.empty();

    if (app.clean) {
        app.clean();
    }

    $.ajax({
        url: '/trees/mine',
        success: function(response) {
            console.log(response)
            app.addClusters(response, app.map);


            var congratsHtml = [
                '<div>',
                'You have ',
                '<span class="x-t-orange-text">',
                response.length,
                ' trees ',
                '</span>',
                'planted. These trees generate ',
                '<span class="x-t-orange-text">',
                response.length * config.treeTypes.pine.o2,
                ' lbs of Oxygen ',
                '</span>',
                ' per year!',
                '<p>Thank you for making the world a better place</p>',
                '</div>'
            ];
            
            congratsDescription.append($(congratsHtml.join('')));
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

    var ranking = $('#ranking');
    ranking.empty();
    
    setBodyAction(action);
    
    $.ajax({
       url: '/top-users',
       success: function(response) {
           var ind = response.individuals;
           
           var rankingHtml = [],
               i = 1;
           
           ind.forEach(function(individual){
               var html = [
                   '<div class="x-rank-item">',
                        '<div class="x-left-line"></div>',
                        '<div class="x-name-num">',
                            '<span class="x-num">',
                                i,
                            '</span>',
                            '<span class="x-name">',
                                individual.name,
                            '</span>',
                        '</div>',
                        '<div class="x-trees-planted">',
                            '<div class="x-tree-icon"></div>',
                            '<div class="x-tree-num">',
                                individual.num_trees,
                            '</div>',
                        '</div>',
                   '</div>'
               ];
               
               i++;
               
               rankingHtml.push(html.join(''));
           });
           
           ranking.append($(rankingHtml.join('')));
       }
    });
}


function displayError(error) {
    console.log(error);
}

function loginCallBack() {
    var loginButton = document.getElementById("fb-login-button");
    loginButton.style.display = "none";
    var userName = document.getElementById("user-name");
    var pic = document.getElementById("menu-account-info").getElementsByClassName("x-profile-pic");
    var url = '/profile';
    $.ajax({
        url: url,
        success: function(response) {
            userName.textContent = response.name;
            pic[0].style.backgroundImage = "url('" + response.img + "')";
        },
        error: function() {
            console.log('Error in url ', url)
        }
    });

}
