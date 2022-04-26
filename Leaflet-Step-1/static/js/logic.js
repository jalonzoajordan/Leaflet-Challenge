// Store our API endpoint as queryUrl. Utilized week data of earthquakes for easier loading and to match readMe.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//create the map object
myMap = L.map("map", {
    center: [25, 0],
    zoom: 2.5
});

//create the map tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

//query the URL and get the JSON object to feed into the map creation object
d3.json(queryUrl).then(function (data) {
  //call the function with the features extracted from the GeoJSON data
  createClusterMap(data.features);
});

function createClusterMap(earthquakeData){
    //add layer using geoJSON data
    for(var i=0; i<earthquakeData.length;i++){
        //get the instance of earthquake data
        earthquake = earthquakeData[i];

        //get the variables from the feature object
        place = earthquake.properties.place;
        datetime = Date(earthquake.properties.time);
        mag = earthquake.properties.mag;
        lat = earthquake.geometry.coordinates[1];
        lon = earthquake.geometry.coordinates[0];
        depth = earthquake.geometry.coordinates[2];

        //determine color based on depth, using Earthquake magnitude scale from https://www.mtu.edu/geo/community/seismology/learn/earthquake-measure/magnitude/
        color = "";
        if(depth < 10){
            color = "#0ed145";
        }
        else if(depth < 30){
            color = "#c4ff0e";
        }
        else if(depth < 50){
            color = "#fff200";
        }
        else if(depth < 70){
            color = "#ffca18";
        }
        else if(depth < 90){
            color = "#ff7f27";
        }
        else {
            color = "#ec1c24";
        };

        //add circle to the map
        L.circle([lat,lon],{
            fillOpacity: 0.75,
            color: color,
            radius: mag*5000
        }).bindPopup(`<h3>${place}</h3><p>Magnitude: ${mag}</p><p>Depth: ${depth}km</p><p>Time: ${datetime}</p>`).addTo(myMap);
    };

    //create a placeholder for the legend
    legend = L.control({position:"bottomright"});
    //create the legend add function using the example from https://leafletjs.com/examples/choropleth/
    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            labels = ["-10-10","10-30","30-50","50-70","70-90","90+"];
            colors = ["#0ed145","#c4ff0e","#fff200","#ffca18","#ff7f27","#ec1c24"];
    
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < labels.length; i++) {
            div.innerHTML +=
                '<i style="background:' + colors[i] + '"></i> ' + labels[i] + '<br>';
        }
    
        return div;
    };
    //add the legend to the map
    legend.addTo(myMap);
};

