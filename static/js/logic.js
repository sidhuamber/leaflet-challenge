//API end points with query url

var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

  // Grabbing our GeoJSON data..
  d3.json(link,function(data){
      // Creating a GeoJson layer with the retrieved data
    console.log(data);
    createFeatures(data.features);
  });

  function createFeatures(earthquakeData){
      // Giving each feature a popup describing the place and time of the earthquake
      function onEachFeature(feature,layer){
          layer.bindPopup("<h3>" + feature.properties.place + "<h3><hr><p>"+ new Date(feature.properties.time)+"</p>"+ "</h3><hr><p>Magnitude:" + feature.properties.mag + "</p>");

      }
      // Create a GeoJSON layer containing the feature array on the earthquake data object
      // Run the onEachFeature function once for each piece of data in array

      var earthquakes = L.geoJSON(earthquakeData,{
          onEachFeature: onEachFeature,
          pointTolayer: function(feature,latlng){
              var color;
              var r = 255;
              var g =Math.floor(255-80*feature.properties.mag);
              var b = Math.floor(255-80*feature.properties.mag);
              color = "rbg("+r+" ,"+g+","+ b+")"

              var geoJsonMarkerOptions = {
                  radius:4*feature.properties.mag,
                  fillColor:color,
                  color: "black",
                  weight: 1,
                  opacity: 1,
                  fillOpacity: 0.8
              };
              return L.circleMarker(latlng, geoJsonMarkerOptions);
          }
      });

      // Sending our earthquake layer to creatMap function
      createMap(earthquakes);
      
  }

  function createMap(earthquakes){
      var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
      "access_token=pk.eyJ1IjoiYW5kaW11c2thaiIsImEiOiJjanZlZXFsbjUyaXRrNGRudDkwbW52d2trIn0.PUOybBbIMGqZL2SvD5Q8iw." +
      "T6YbdDixkOBWH_k9GbS8JQ");
  
        //maxZoom: 18,
        //id: "mapbox.streets",
        //accessToken: API_KEY
      
      //Define a base map object to hold our base layer
      var baseMaps = {
          "Street Map": streetmap
      };

      // Create overlay object to hold our overlay layer
      var overlayMaps = {
          Earthquakes: earthquakes
      };

      // Create our map, giving it the streetmap and earthquakes layer to display on load
      var myMap = L.map("map",{
          center: [37.09,-95.71],
          zoom:5,
          layers:[streetmap,earthquakes]
      });

      function getColor(d){
          return d<1 ? 'rgb(255,255,255)' :
                d<2 ? 'rgb(255,255,255)':
                d < 3  ? 'rgb(255,195,195)' :
                d < 4  ? 'rgb(255,165,165)' :
                d < 5  ? 'rgb(255,135,135)' :
                d < 6  ? 'rgb(255,105,105)' :
                d < 7  ? 'rgb(255,75,75)' :
                d < 8  ? 'rgb(255,45,45)' :
                d < 9  ? 'rgb(255,15,15)' :
                            'rgb(255,0,0)';

      }

      // Creating legend

      var legend = L.control({position:'bottomright'});
      legend.onAdd = function(map){
          var div = L.DomUtil.create('div','info legend'),
          grades = [0,1,2,3,4,5,6,7,8],
          labels = [];

          div.innerHTML+='Magnitude<br><hr>'

          //Loop through our density intervals and generate a label 
          for (var i =0;i<grades.length;i++){
              div.innerHTML +=
              '<i style="background:'+ getColor(grades[i] +1) + '">&nbsp&nbsp&nbsp&nbsp</i>' +
              grades[i] + (grades[i+1] ? '&ndash;' + grades[i + 1] + ' <br>':'+');

          }
          return div;
      };

      legend.addTo(myMap);

    
  
  }

