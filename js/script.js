// This script demonstrates some simple things one can do with leaflet.js


var map = L.map('map').setView([40.71,-73.93], 11);

// set a tile layer to be CartoDB tiles 
var CartoDBTiles = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',{
  attribution: 'Map Data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> Contributors, Map Tiles &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
}).addTo(map);

var WaterColorTiles = L.tileLayer('http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.png', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.'
}).addTo(map);

// add these tiles to our map
map.addLayer(CartoDBTiles);

// subway lines

var subwayStyle = {
	"color": "black",
    "weight": 2,
    "opacity": 1
};

var subwayClick = function (feature, layer) {
	// let's bind some feature properties to a pop up
	layer.bindPopup(feature.properties.Line);
}

var subwayLinesGeoJSON = L.geoJson(subwayLines, {
    style: subwayStyle,
    onEachFeature: subwayClick
}).addTo(map);



// museum points

var museumIcon = L.MakiMarkers.icon({
    icon: "museum", 
    color: "#b0b", 
    size: "m"
});

//how can I put a symbol here?
var museumPointToLayer = function (feature, latlng){
	var museumMarker = L.marker(latlng, 100, {
		icon: museumIcon
        //stroke: false,
		//fillColor: '#2ca25f',
		//fillOpacity: 1
	});
	
	return museumMarker;	
}

var museumClick = function (feature, layer) {
	layer.bindPopup("<strong>Name:</strong> " + feature.properties.NAME + "<br /><strong>Address: </strong>" + feature.properties.ADRESS1 + "<br /><strong>Website: </strong>" + feature.properties.URL);
}

var museumGeoJSON = L.geoJson(museum, {
	pointToLayer: museumPointToLayer,
	onEachFeature: museumClick
}).addTo(map);

//school points-different marker
var schoolsToLayer = function (feature, latlng){
    var schoolsMarker = L.circle(latlng, 100, {
        stroke: false,
        fillColor: '#bd0026',
        fillOpacity: 1
    });
    
    return schoolsMarker;    
}

var schoolsClick = function (feature, layer) {
    // let's bind some feature properties to a pop up

    layer.bindPopup("<strong>Name:</strong> " + feature.properties.SCHOOLNAME + "<br /><strong>Address: </strong>" + feature.properties.ADRESS + "<br /><strong>Grades: </strong>" + feature.properties.GRADES);
}

var schoolsGeoJSON = L.geoJson(museum, {
    pointToLayer: schoolsToLayer,
    onEachFeature: schoolsClick
}).addTo(map);


// neighborhood choropleth map
// % in poverty to color the neighborhood map

var povertyStyle = function (feature){
    var value = feature.properties.PovertyPer;
    var fillColor = null;
    if(value >= 0 && value <=0.1){
		fillColor = "#f0f9e8";
    }
    if(value >0.1 && value <=0.15){
        fillColor = "#ccebc5";
    }
    if(value >0.15 && value<=0.2){
    	fillColor = "#a8ddb5";
    }
    if(value > 0.2 && value <=0.3){
    	fillColor = "#7bccc4";
    }
    if(value > 0.3 && value <=0.4) { 
		fillColor = "#43a2ca";
    }
    if(value > 0.4) { 
		fillColor = "#0868ac";
    }

    var style = {
        weight: 1,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.75,
        fillColor: fillColor
    }

    return style;
}

var povertyClick = function (feature, layer) {
	var percent = feature.properties.PovertyPer * 100;
	percent = percent.toFixed(0);
	// let's bind some feature properties to a pop up
	layer.bindPopup("<strong>Neighborhood:</strong> " + feature.properties.NYC_NEIG + "<br /><strong>Percent in Poverty: </strong>" + percent + "%");
}

var neighborhoodsGeoJSON = L.geoJson(neighborhoods, {
    style: povertyStyle,
    onEachFeature: povertyClick
}).addTo(map);


// add in layer controls

var baseMaps = {
    "Water Colors": WaterColorTiles,
    "CartoDB": CartoDBTiles,
};

var overlayMaps = {
    "Museums": museumGeoJSON,
    "Schools": schoolsGeoJSON,
    "Subway Lines": subwayLinesGeoJSON,
    "Povery Map": neighborhoodsGeoJSON
};

// add control
L.control.layers(baseMaps, overlayMaps, {position: 'topleft'}).addTo(map);





