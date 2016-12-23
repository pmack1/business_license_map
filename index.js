
var mapboxAccessToken = 'pk.eyJ1IjoicG1hY2siLCJhIjoiY2l0cTJkN3N3MDA4ZTJvbnhoeG12MDM5ZyJ9.ISJHx3VHMvhQade2UQAIZg';
var map = L.map('map').setView([41.8781, -87.6298], 14);
var route_geojson;

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + mapboxAccessToken, {
    id: 'mapbox.light',
}).addTo(map);


function makeMarker(node, color)
{
  // add marker object to map
  var marker = L.marker([node.coordinates[1], node.coordinates[0]],{icon: L.AwesomeMarkers.icon({icon: '', markerColor: color}) }).addTo(map);
  marker.bindPopup('<b>' + node.name + '</b>' );
};

document.getElementById("calculate").onclick = function () {
  createNodes();



};

// add draw interface for route
var drawnItems = new L.LayerGroup();
L.drawLocal.draw.toolbar.buttons.polygon = 'Draw the area you want examine';

     map.addLayer(drawnItems);
     var drawControl = new L.Control.Draw({
         position: 'topright',
         draw: {
          circle: false,
          rectangle: false,
          polyline: false,
          marker: false,
          polygon: {
            shapeOptions:{
              color: 'steelblue'
            }
          },

         },
     });
     map.addControl(drawControl);

    map.on("draw:created", function (e) {
      if (drawnItems.getLayers().length > 0){
        drawnItems.clearLayers();

        };

      var type = e.layerType,
         neighborhood = e.layer;

      drawnItems.addLayer(neighborhood);
      neighborhood_geojson = neighborhood.toGeoJSON().geometry;
      createNodes(neighborhood_geojson)

});


// load node information from plenario
var nodes = new Array();
function createNodes(neighborhood_geojson){
  var url_query =   'http://plenar.io/v1/api/detail/?dataset_name=business_licenses&obs_date__ge=1900-01-01&location_geom__within=' + JSON.stringify(neighborhood_geojson) +  '&business_licenses__filter={"op":"and", "val": [{"op":"eq","col":"license_description","val":"Retail Food Establishment"},{"op":"ge","col":"license_term_expiration_date","val":"2016-12-22"}]}'
  $.ajax({
    type: 'GET',
    url: url_query,
    async: false,
    dataType: 'json',
    success: function (data) {
      console.log(data)

    }
  });


};


//add nodes as markers to map. Flip coordinates for leaflet marker object
for (var i = 0; i < nodes.length; i++) {
var node = nodes[i];
makeMarker(node, 'blue');
};
