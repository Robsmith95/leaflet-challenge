// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

function createMap(earthquakes) {


  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY})

  var baseMaps = {
    "Street Map": streetmap
  };

  var overlayMaps = {
    Earthquakes: earthquakes
  };


  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });


  function getColor(d) {
      return d < 0 ? 'rgb(17,233,82)' :
            d < 2 ? 'rgb(17,233,82)' :
            d < 4  ? 'rgb(233, 190,17)' :
            d < 6  ? 'rgb(233,161,17)' :
            d < 8  ? 'rgb(255,45,45)' :
            d < 9  ? 'rgb(255,15,15)' :
                        'rgb(255,0,0)';
  }

  // Legend Creation
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {
  
      var div = L.DomUtil.create('div', 'info legend'),
      grades = [0, 2, 4, 6, 8],
      labels = ["-10-10", "10-30", "30-50", "50-70", "70-90", "90+"];

      div.innerHTML+='Magnitude of Earthquakes<br><hr>'
  
      // Lables
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(grades[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }
  
  return div;
  };
  
  legend.addTo(myMap);

}

d3.json(queryUrl, function(data) {

  createFeatures(data.features);
});

function createFeatures(eqMagData) {

// Pop Up Info
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
      "</h3><hr><p>Magnitude: " + feature.properties.mag + "</p>" +
      "</h3><hr><p>Location: " + feature.properties.place + "</p>");
      
  }

  

  var earthquakes = L.geoJSON(eqMagData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
      var color;
      var r = 76;
      var g = Math.floor(218*feature.properties.mag);
      var b = Math.floor(24*feature.properties.mag);
      color= "rgb("+r+" ,"+g+","+ b+")"
      
      var geojsonMarkerOptions = {
        radius: 3.5*feature.properties.mag,
        fillColor: color,
        color: "black",
        weight: 2,
        opacity: 2,
        fillOpacity: 2

      };
      return L.circleMarker(latlng, geojsonMarkerOptions);
    }
  });



  createMap(earthquakes);
  
}