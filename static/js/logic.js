// Create our map
var myMap = L.map("map", {
    center: [
        39.8283, -98.5795
    ],
    zoom: 3
  });
// Define satellite map layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
}).addTo(myMap);

//Query URL to the GeoJSON of the weekly earthquake data
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson"
// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {
  console.log("Creating features...");
  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing details of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p><b>Magnitude:</b> " + feature.properties.mag + "</p>");
  }

  //Function that assigns a color according to the magnitude of an earthquake
  function getcolor(magnitude){
      switch (true) {
          case magnitude>5:
              return "red";
          case magnitude>=4:
              return "orangered";
          case magnitude>=3:
              return "orange";
          case magnitude>=2:
              return "yellow";
          case magnitude>=1:
              return "greenyellow";
          case magnitude>=0:
              return "green"   
          default:
              return "silver";
      }
  }

  //Function that gets the radius according to the magnitude to plot relative strength of the earthquake
  function getradius(magnitude){
      return magnitude*5;
  }
  
  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  L.geoJSON(earthquakeData, {
               
    onEachFeature: onEachFeature,
    //Change the default marker to a circle marker that calls the getcolor and getradius functions according to each earthquake's magnitude
    pointToLayer: function (feature, latlng) {
              var magnitude = feature.properties.mag;
              return new L.circleMarker(latlng, {
          color: "Black",
          weight: 1,
          fillColor: getcolor(magnitude),
          radius: getradius(magnitude),
          fillOpacity: 1
      });
    }
  //Adds the earthquake layer to the map
  }).addTo(myMap);

  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = [0, 1, 2, 3, 4, 5];
    var colors = ["#008000", "#ADFF2F", "#FFFF00", "#FFA500", "#FF4500", "#FF0000" ];
    var labels = [];

    // Add min & max
    var legendInfo = "<h1>Earthquake Magnitude</h1>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">" + limits[0] + "</div>" +
        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
      "</div>";

    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  // Adding legend to the map
  legend.addTo(myMap); }

