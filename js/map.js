var map;
var markers = [];

function initMap() {
  // Create map
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 33.364070, lng: -111.858903},
    zoom: 13,
    mapTypeControl: false
  });
}
