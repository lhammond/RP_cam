function resizeMapIfVisible() {
    if ( map.map && $('#map_id').is(':visible') ) {
        $('#map_id').height( $(window).height() );
        $('#map_id').width( $(window).width() );
        map.map.invalidateSize();
        console.log("invalidating size");
    }
}
$(window).bind('orientationchange pageshow resize', resizeMapIfVisible);

function onLocationFound(event) {
    console.log("location found");
    // Update our location and accuracy
    // Even if we don't auto-pan nor display the marker, we may need LOCATION updated for future distance-to-point calculations.
    map.LOCATION.setLatLng(event.latlng);
    map.ACCURACY.setLatLng(event.latlng);
    map.ACCURACY.setRadius(event.accuracy);

    // center the map
    if (map.AUTO_RECENTER) map.map.panTo(map.LOCATION.getLatLng());
}


function fmap(cfg) {
    this.AUTO_RECENTER = true;
    this.name = cfg.name;
    this.jsonUrl = '/'+this.name;
    this.lat = cfg.lat;
    this.lon = cfg.lon;
    this.graphType = "";
    this.insights = "";
    this.map = undefined;
    this.DEFAULT_LAT = 44.5875;
    this.DEFAULT_LNG = -123.1712;
    this.DEFAULT_ZOOM = 15;
    this.LOCATION_ICON = L.icon({
        iconUrl: '../assets/img/marker-gps.png',
        iconSize: [25, 41], // size of the icon
        iconAnchor: [13, 41], // point of the icon which will correspond to marker's location
        popupAnchor: [13, 1] // point from which the popup should open relative to the iconAnchor
    });
    this.LOCATION = new L.Marker(new L.LatLng(this.DEFAULT_LAT,this.DEFAULT_LNG), { clickable:false, draggable:false, icon:this.LOCATION_ICON });
    this.ACCURACY = new L.Circle(new L.LatLng(this.DEFAULT_LAT,this.DEFAULT_LNG), 1);
    this.MIN_ZOOM = 10;
    this.MAX_ZOOM = 16;
    this.BASEMAPS = {};
    this.BASEMAPS['terrain'] = new L.TileLayer("http://{s}.tiles.mapbox.com/v3/greeninfo.map-fdff5ykx/{z}/{x}/{y}.jpg", { name:'Terrain', subdomains:['a','b','c','d'] });
    this.BASEMAPS['photo'] = new L.TileLayer("http://{s}.tiles.mapbox.com/v3/greeninfo.map-zudfckcw/{z}/{x}/{y}.jpg", { name:'Photo', subdomains:['a','b','c','d'] });
    //this.address = new address(cfg);
    //this.renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
    //this.renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;
    //defaultDashboardRange: ${dashboardDateRange},
    //defaultGraphDateRange: ${graphDateRange},
    //this.defaultUsageDateRange = cfg.defaultUsageDateRange;
    this.dateOverride = false;
    this.layers = {
        "mapnik":{"url":undefined,"layer":undefined},
        "clu":{"url":"/public/apps/data/bass.kml?key=" + Math.random(),"layer":undefined},
        "clu2":{"url":"/public/apps/data/Watts_BehindWymans_soil.kml?key=" + Math.random(),"layer":undefined},
        "kml1":{"url":"https://my.farmify.com/public/apps/data/test.kml?key=" + Math.random(),"layer":undefined},
        "kml2":{"url":"/raveninsight/clu/5026966a4e641aea4d118059?key=" + Math.random(),"layer":undefined},
        "kml":{"url":"/public/data/kfc/locations.kml","layer":undefined},
        "kml2":{"url":"http://www.2owls.com/public/data/84776.kml","layer":undefined},
        "jobkml":{"url":"/raveninsight/clu/5026966a4e641aea4d118059?key=" + Math.random(),"layer":undefined},
        "kml2":{"url":"/public/apps/data/jacks1.kml?key=" + Math.random(),"layer":undefined},
        "wms":{"url":"","layer":undefined},
        "wfs":{"url":"http://demo.opengeo.org/geoserver/wfs","layer":undefined},
        "json":{"url":"/public/data/kfc/locations.json","layer":undefined}
    }
    //this.load();
}
fmap.prototype.setKmlLayer = function () {
    this.layers["kml"]["layer"] = new OpenLayers.Layer.Vector("kml", {
        projection: new OpenLayers.Projection("EPSG:4326"),
        strategies: [new OpenLayers.Strategy.Fixed()],
        protocol: new OpenLayers.Protocol.HTTP({
            url: this.layers["kml"]["url"],
            format: new OpenLayers.Format.KML({
                //maxDepth is how deep it will follow network links//
                maxDepth2: 1,
                //extract styles from the KML Layer//
                extractStyles: true,
                //extract attributes from the KML Layer//
                extractAttributes: true
            })
        })
    });
}
fmap.prototype.setJobKmlLayer = function () {
    this.layers["jobkml"]["layer"] = new OpenLayers.Layer.Vector("kml", {
        projection: new OpenLayers.Projection("EPSG:4326"),
        strategies: [new OpenLayers.Strategy.Fixed()],
        protocol: new OpenLayers.Protocol.HTTP({
            url: this.layers["jobkml"]["url"],
            format: new OpenLayers.Format.KML({
                //maxDepth is how deep it will follow network links//
                maxDepth2: 1,
                //extract styles from the KML Layer//
                extractStyles: true,
                //extract attributes from the KML Layer//
                extractAttributes: true
            })
        })
    });
}
fmap.prototype.init = function () {
    console.log("initFmap()");
    $("#map_wrapper").html("").append('<div id="map_id" style="height:100%;width:100%;min-height:300px;"></div>');
    var self = this;
    //this.map = new L.map('map_id');
    this.map = new L.Map('map_id', {
        attributionControl: true,
        zoomControl: true,
        dragging: true,
        closePopupOnClick: false,
        crs: L.CRS.EPSG3857,
        minZoom: this.MIN_ZOOM, maxZoom: this.MAX_ZOOM,
        layers : [ this.BASEMAPS['terrain'], this.ACCURACY, this.LOCATION ]
    });
    this.map.attributionControl.setPrefix(''); // Don't show the 'Powered by Leaflet' text.
    this.map.setView(this.LOCATION.getLatLng(),this.DEFAULT_ZOOM);
    this.map.on('locationfound', onLocationFound);
    this.map.locate({ enableHighAccuracy:true, watch:true });

    // Leaflet behavior patch: on a zoomend event, check whether we're at MIN_ZOOM or MAX_ZOOM and show/hide the +/- buttons in the Zoom control
    this.map.on('zoomend', function () {
        var z = self.map.getZoom();
        z <= this.MIN_ZOOM ? $('.leaflet-control-zoom-out').hide() : $('.leaflet-control-zoom-out').show();
        z >= this.MAX_ZOOM ? $('.leaflet-control-zoom-in').hide() : $('.leaflet-control-zoom-in').show();
    });
    /*
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery Â© <a href="http://cloudmade.com">CloudMade</a>'
    }).addTo(this.map);

    this.map.locate({setView: true, maxZoom: 16});

    this.map.on('locationfound', function(e){
        self.map.invalidateSize();
        var radius = ((e.accuracy / 2)*3);

        L.marker(e.latlng).addTo(self.map)
            .bindPopup("You are within " + radius + " feet from this payment location").openPopup();

        L.circle(e.latlng, radius).addTo(self.map);
    });

    this.map.on('locationerror', function(e){
        alert(e.message);
    });

*/
    console.log(this.layers["kml"]["url"]);
    //this.layers["kml"]["layer"] = new L.KML(this.layers["kml"]["url"], {async: true});

    /*
    var json;
    $.ajax({
        type: "GET",
        url: this.layers["json"]["url"],
        dataType: 'json',
        async:'false',
        success: function (response) {
            json = L.geoJson(response, {
            }).addTo(self.map);
        }
    });
    */
    //this.layers["json"]["layer"] = new L.geoJson(this.layers["json"]["url"]);
    /*
     this.layers["kml"]["layer"].on("loaded", function(e) {
     console.log("about to fit bounds");
     //self.map.fitBounds(e.target.getBounds());
     });
     */

    //this.map.addLayer(this.layers["kml"]["layer"]);
    //this.map.addLayer(json);
    /*
     this.map.addControl(new L.Control.Layers({},
     {'Locations':this.layers["kml"]["layer"],
     'Json':this.layers["json"]["layer"]}));

     this.map.addControl(new L.Control.Layers({},
     {'Locations':this.layers["json"]["layer"]}));
     */

}