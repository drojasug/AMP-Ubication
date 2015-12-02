/*
Location Method: 
map.locate({setView: true, maxZoom: 12});
*/
Math.sign = Math.sign || function(x) {
    x = +x; // convert to a number
    if (x === 0 || isNaN(x)) {
    	return x;
    }
    return x > 0 ? 1 : -1;
};
function detectLocation(){
	map.locate({setView: true, maxZoom: 1});
	console.log((map.locate({setView: true, maxZoom: 1})).getCenter());
	map.setView((map.locate({setView: true, maxZoom: 1})).getCenter(),10);
}



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

function ConvertDMSToDD(degress,minutes,seconds,option)
{
	if (option =="lat"){
		document.getElementById("p_lat").value = parseFloat((Math.sign(degress) * (Math.abs(degress) + (minutes / 60.0) + (seconds / 3600.0))).toFixed(3));
	}else{
		document.getElementById("p_lng").value = parseFloat((Math.sign(degress) * (Math.abs(degress) + (minutes / 60.0) + (seconds / 3600.0))).toFixed(3));
	}
}

var map = L.map( 'map', {
	center:[5.520, -87.050],
	zoom: 12
});
var pt = [5.520, -87.050];
var pts = [[6.133,-87],[5.733,-86.433],[4.8,-87.283],[4.966,-88]];
var polygon =  L.polygon(pts, {
	color: '#FF0000',
	opacity: 0.1,
	fillOpacity: 0.1
});
var marker = L.marker(pt, {
	draggable: true
});
var layer1 = L.layerGroup([polygon]);
layer1.addLayer(marker);
layer1.addTo(map);
document.getElementById("p_lat").value = pt[0];
document.getElementById("p_lng").value = pt[1];
marker.on('dragend', function (ev) {
	var timestamp = new Date();
	var coords = ev.target._latlng;
	checkGeoFence(coords.lat.toFixed(3), coords.lng.toFixed(3));
});

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
ConvertDDToDMS(document.getElementById("p_lat").value,"lat");
ConvertDDToDMS(document.getElementById("p_lng").value,"lng");
L.tileLayer('img/MapQuest/{z}/{x}/{y}.png').addTo(map);

var found = function onLocationFound(e) {
	var radius = e.accuracy / 2;
    //L.marker(e.latlng).addTo(map);
    marker.setLatLng(e.latlng);	
    document.getElementById("p_lat").value = e.latlng.lat;
    document.getElementById("p_lng").value = e.latlng.lng;
    ConvertDDToDMS(document.getElementById("p_lat").value,"lat");
    ConvertDDToDMS(document.getElementById("p_lng").value,"lng");

};

map.on('locationfound', found);