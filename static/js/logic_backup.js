// getting data
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

//getting the map
var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?" +
"access_token=pk.eyJ1IjoiYW5kaW11c2thaiIsImEiOiJjanZlZXFsbjUyaXRrNGRudDkwbW52d2trIn0.PUOybBbIMGqZL2SvD5Q8iw." +
"T6YbdDixkOBWH_k9GbS8JQ");

// to fix the map at the position we are looking for
var myMap = L.map("map", {
  center: [
    40.7, -94.5
  ],
  zoom: 3
});

//add the map
streetmap.addTo(myMap);

d3.json(link, function(link) {

  function getColor(d){
    return
      d <1 ? 'rgb(255,255,255)' :
      d <2 ? 'rgb(255,255,255)':
      d < 3  ? 'rgb(255,195,195)' :
      d < 4  ? 'rgb(255,165,165)' :
      d < 5  ? 'rgb(255,135,135)' :
      d < 6  ? 'rgb(255,105,105)' :
      d < 7  ? 'rgb(255,75,75)' :
      d < 8  ? 'rgb(255,45,45)' :
      d < 9  ? 'rgb(255,15,15)' :
                  'rgb(255,0,0)';
  }
  function styling(feature){
    return {
      radius: find_radius(feature.properties.mag), //4*feature.properties.mag,
      fillColor: getColor(feature.properties.mag),//"#ea2c2c",  //getColor(feature.properties.mag),
      color: "yellow",
      weight: 1,
      stroke: true,
      opacity: 1,
      fillOpacity: 0.8
    };
  }


    function find_radius(mag) {
      if (mag == 0) {
        return 1;
      }
      return 4 * mag;
    }

    L.geoJson(link, {
      pointToLayer: function (feature, position) {
        return L.circleMarker(position);
      },
      //using the function styling
      style: styling,
        onEachFeature: function(feature, layer){
          layer.bindPopup("<h3>" + feature.properties.place + "<h3><hr><p>"+ new Date(feature.properties.time)+"</p>"+ "</h3><hr><p>Magnitude:" + feature.properties.mag + "</p>");
      }
    }).addTo(myMap);

    var legend = L.control({position:'bottomright'});
    legend.onAdd = function(map){
        var div = L.DomUtil.create('div','info legend'),
        grades = [0,1,2,3,4,5,6,7,8],
        labels = [];
        var colors = ["#98ee00",
        "#d4ee00","#98ee00",
        "#d4ee00","#98ee00",
        "#d4ee00",
        "#98ee00",
        "#d4ee00",
        "#98ee00"
        
      
  
  ]

        div.innerHTML+='Magnitude<br><hr>'

        //Loop through our density intervals and generate a label
        for (var i =0;i<grades.length;i++){
            div.innerHTML +=
            '<i style="background:'+ colors[i] + '">&nbsp&nbsp&nbsp&nbsp</i>' +
            grades[i] + (grades[i+1] ? '&ndash;' + grades[i + 1] + ' <br>':'+');

        }
        return div;
    };

    legend.addTo(myMap);
})
