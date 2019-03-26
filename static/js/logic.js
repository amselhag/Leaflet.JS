
function getColor(d) {
  return d > 5 ? '#d73027' :
         d > 4  ? '#fc8d59' :
         d > 3  ? '#fee08b' :
         d > 2  ? '#d9ef8b' :
         d > 1   ? '#91cf60' :
                    '#1a9850';
}

function getRadius(r){
  return r*3
};

function onEachFeature(feature, layer) {
  layer.bindPopup("<h3>" + `Title: `+ feature.properties.place +
    "</h3><hr><h4>" +`Magnitude: `+ feature.properties.mag + "</h4>");
}

var myMap = L.map("map", {
  center: [15.5994, -28.6731],
  zoom: 2.5
});

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
}).addTo(myMap);

// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  L.geoJson(data, {
    pointToLayer: function (feature,latlng){
    return L.circleMarker(latlng,{
      radius:getRadius(feature.properties.mag), //expressed in pixels
      fillColor: getColor(feature.properties.mag),
      color: "#000", //black outline
      weight: 1, //outline width
      opacity: 1, //line opacity
      fillOpacity: 0.8});
    },

    onEachFeature: onEachFeature
   }).addTo(myMap);
});


var legend = L.control({position: 'bottomright'});

legend.onAdd = function (myMap) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);


