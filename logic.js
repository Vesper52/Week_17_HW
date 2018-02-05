var queryUrl ="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

var platesURL = 'https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_steps.json'
var plates;
d3.json(queryUrl, function(data) {
  d3.json(platesURL,function(data_2){
createFeatures(data.features,data_2.features);
  });
  //console.log(data.features[0])
  // Once we get a response, send the data.features object to the c
});






function getColor(d) {
    return d > 5  ? '#b30000' :
           d > 4  ? '#e34a33' :
           d > 3  ? '#fc8d59' :
           d > 2  ? '#fdbb84' :
           d > 1  ? '#fdd49e' :
                    '#fef0d9' ;
}

function createFeatures(earthquakeData,plateData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
      var geojsonMarkerOptions = {
          radius: (feature.properties.mag*5),
          fillColor: getColor(feature.properties.mag),
          color:'white',
          // if (feature.properties.mag < 1){
          //   color: "#000"
          // }else {
          //   color:'#000'
         //
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
      };

       return L.circleMarker(latlng, geojsonMarkerOptions);
     }
  });
  var plates = L.geoJson(plateData)


  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes,plates);
}

function createMap(earthquakes,plates) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1Ijoia2pnMzEwIiwiYSI6ImNpdGRjbWhxdjAwNG0yb3A5b21jOXluZTUifQ." +
    "T6YbdDixkOBWH_k9GbS8JQ");

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1Ijoia2pnMzEwIiwiYSI6ImNpdGRjbWhxdjAwNG0yb3A5b21jOXluZTUifQ." +
    "T6YbdDixkOBWH_k9GbS8JQ");

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  // console.log(plates)
  var overlayMaps = {
    Earthquakes: earthquakes,
    Plates: plates
  };
//   var sliderControl = L.control.sliderControl({position: "topright", layer: earthquakes});
//
// //Make sure to add the slider to the map ;-)
// map.addControl(sliderControl);
//
// //And initialize the slider
// sliderControl.startSlider();

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]

  });


  var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0,1,2,3,4,5],
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

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}

//
// var circle = L.circle([37, -78], {
//     color: 'red',
//     fillColor: '#f03',
//     fillOpacity: 0.5,
//     radius: 500
// }).addTo(mymap);
//
// circle.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
//
// var popup = L.popup();
//
// function onMapClick(e) {
//     popup
//         .setLatLng(e.latlng)
//         .setContent("You clicked the map at " + e.latlng.toString())
//         .openOn(mymap);
// }
//
// mymap.on('click', onMapClick);
