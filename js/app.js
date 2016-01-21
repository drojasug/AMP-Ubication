/*
AMP-Ubication is a project that aims to help people know when they are in a
marine protected area.
*/

/*
This is the main section of the app.
*/

/*
Here we define our map.
*/

var map = L.map( 'map', {
  center:[5.520, -87.050],
  zoom: 12
});

/*
Time to fill the map with tiles.
We add the online way second, if you don't have internet,
you will load local tiles/
*/
var tiles = L.tileLayer('img/MapQuest/{z}/{x}/{y}.png').addTo(map);
tiles = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
console.log(tiles._tiles);


/*
This listens to location found.
*/
map.on('locationfound', found);

/*
At this point we define the center, where we are going to put our marker.
*/

var center = [5.520, -87.050];
var marker = L.marker(center, {
  draggable: true
});

/*
Here we define our area. Later this is going to be a group of areas.
We also define our polygon. This receives our area.
*/
var pts = [[6.133,-87],[5.733,-86.433],[4.8,-87.283],[4.966,-88]];
var polygon =  L.polygon(pts, {
  color: '#FF0000',
  opacity: 0.1,
  fillOpacity: 0.1
});
/*
Here we add our polygon to a layerGroup.
TODO: use addLayer to use more polygons.
*/
var layer1 = L.layerGroup([polygon]);
/*
Here we add the marker previously defined and latter add our layer to the map.
*/
layer1.addLayer(marker);
layer1.addTo(map);

/*
In these lines we fill our fields with our center position.
And later we convert it to Degrees Minutes Seconds.
*/
document.getElementById("p_lat").value = center[0];
document.getElementById("p_lng").value = center[1];
ConvertDDToDMS(document.getElementById("p_lat").value,"lat");
ConvertDDToDMS(document.getElementById("p_lng").value,"lng");

/*
We listen to an event where marker is dragged.
We also invoke the checkGeoFence method.
*/
marker.on('dragend', function (ev) {
  var timestamp = new Date();
  var coords = ev.target._latlng;
  checkGeoFence(coords.lat.toFixed(3), coords.lng.toFixed(3));
});






/*
Function section.
After this we define all our functions.
*/


/*
Here we define a sign function and assign it to Math.prototype.
This function returns 1 or -1, if the number is positive or negative.
*/
Math.sign = Math.sign || function(x) {
  x = +x; // convert to a number
  if (x === 0 || isNaN(x)) {
    return x;
  }
  return x > 0 ? 1 : -1;
};

/*
This method detects the user location automatically.
*/
function detectLocation(){
  map.locate({setView: true, maxZoom: 1});
  map.setView((map.locate({setView: true, maxZoom: 1})).getCenter(),10);
}

/*
This method delete all the values from the fields in the index.
*/

function deleteValues(){
  document.getElementById("lat_deg").value = 0;
  document.getElementById("lat_min").value = 0;
  document.getElementById("lat_sec").value = 0;
  document.getElementById("lng_deg").value = 0;
  document.getElementById("lng_min").value = 0;
  document.getElementById("lng_sec").value = 0;
  document.getElementById("p_lat").value = 0;
  document.getElementById("p_lng").value = 0;

}

/*
This methods converts Decimal Degrees to Degrees Minutes and Seconds.
*/
function ConvertDDToDMS(dd,option)
{
  var deg = dd | 0; // truncate dd to get degrees
  var frac = Math.abs(dd - deg); // get fractional part
  var min = (frac * 60) | 0; // multiply fraction by 60 and truncate
  var sec = frac * 3600 - min * 60;
  if (option =="lat"){
    document.getElementById("lat_deg").value = deg;
    document.getElementById("lat_min").value = min;
    document.getElementById("lat_sec").value = +sec.toFixed(3);
  }else{
    document.getElementById("lng_deg").value = deg;
    document.getElementById("lng_min").value = min;
    document.getElementById("lng_sec").value = +sec.toFixed(3);
  }
}
/*
This methods converts Degrees Minutes and Seconds to Decimal Degrees.
*/
function ConvertDMSToDD(degress,minutes,seconds,option)
{
  if (option =="lat"){
    document.getElementById("p_lat").value = parseFloat((Math.sign(degress) * (Math.abs(degress) + (minutes / 60.0) + (seconds / 3600.0))).toFixed(3));
  }else{
    document.getElementById("p_lng").value = parseFloat((Math.sign(degress) * (Math.abs(degress) + (minutes / 60.0) + (seconds / 3600.0))).toFixed(3));
  }
}

/*
This method checks if the point is inside a Geofence.
*/

var checkGeoFence = function (lat, lng) {
  var res;
  var gjLayer = L.geoJson(polygon.toGeoJSON());
  res = leafletPip.pointInLayer([lng, lat], gjLayer);
  var status = 'inside';
  document.getElementById("p1").innerHTML = "Dentro del AMMS";
  document.getElementById("p1").style.color = "green";
  document.getElementById("icon-status").style.color = "green";
  document.getElementById("icon-status").className = "glyphicon glyphicon-ok";
  if (res.length === 0 || res === false) {
    status = 'outside';
    document.getElementById("p1").innerHTML = "Afuera del AMMS";
    document.getElementById("p1").style.color = "red";
    document.getElementById("icon-status").className = "glyphicon glyphicon-remove";
    document.getElementById("icon-status").style.color = "red";

  }
  document.getElementById("p_lat").value = lat;
  document.getElementById("p_lng").value = lng;
  ConvertDDToDMS(document.getElementById("p_lat").value,"lat");
  ConvertDDToDMS(document.getElementById("p_lng").value,"lng");
  return status;
};

/*
This method is activated when a decimal field is changed in the html.
*/

var changeValueDec = function(option){
  if(option=="lat"){
    ConvertDDToDMS(document.getElementById("p_lat").value,option);
  }else{
    ConvertDDToDMS(document.getElementById("p_lng").value,option);
  }
  checkGeoFence(document.getElementById("p_lat").value, document.getElementById("p_lng").value);
  marker.setLatLng(L.latLng(document.getElementById("p_lat").value, document.getElementById("p_lng").value));
  map.setView(L.latLng(document.getElementById("p_lat").value, document.getElementById("p_lng").value),10);
};

/*
This method is activated when a degrees field is changed in the html.
*/

var changeValueDeg = function(option){
  if(option=="lat"){
    ConvertDMSToDD(document.getElementById("lat_deg").value,document.getElementById("lat_min").value,document.getElementById("lat_sec").value,option);
  }else{
    ConvertDMSToDD(document.getElementById("lng_deg").value,document.getElementById("lng_min").value,document.getElementById("lng_sec").value,option);
  }
  checkGeoFence(document.getElementById("p_lat").value, document.getElementById("p_lng").value);
  marker.setLatLng(L.latLng(document.getElementById("p_lat").value, document.getElementById("p_lng").value));
  map.setView(L.latLng(document.getElementById("p_lat").value, document.getElementById("p_lng").value),10);
};

/*
This method is fired when something is found on the map. It set a marker.
*/

var found = function onLocationFound(e) {
  var radius = e.accuracy / 2;
  marker.setLatLng(e.latlng);
  document.getElementById("p_lat").value = e.latlng.lat;
  document.getElementById("p_lng").value = e.latlng.lng;
  ConvertDDToDMS(document.getElementById("p_lat").value,"lat");
  ConvertDDToDMS(document.getElementById("p_lng").value,"lng");
};
