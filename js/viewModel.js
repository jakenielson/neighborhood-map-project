var viewModel = function() {
  var self = this;
  this.map;
  this.markers = [];

  // Holds all places
  this.allPlaces = ko.observableArray([]);
  initialPlaces.forEach(function(place){
    self.allPlaces.push(new Place(place));
  });

  // Holds currently filtered places
  this.currentPlaces = ko.observableArray();
  this.allPlaces().forEach(function(place){
    self.currentPlaces.push(place);
  });

  // Initializes the map
  this.initMap = function() {
    this.createMap();
    this.createMarkers(this.allPlaces());
  };

  // Create map
  this.createMap = function() {
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 33.364070, lng: -111.858903},
      zoom: 13,
      mapTypeControl: false
    });
  };

  // Create markers
  this.createMarkers = function(places) {
    console.log("Places passed into createMarkers:");
    console.log(places);
    for (i = 0; i < places.length; i++) {
      var title = places[i].title;
      var position = places[i].position;
      var marker = new google.maps.Marker({
        position: position,
        title: title,
        animation: google.maps.Animation.DROP,
        id: i
      });
      this.markers.push(marker);
    }
    console.log("Markers created by createMarkers:");
    console.log(this.markers);
    // Show markers
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < this.markers.length; i++) {
      console.log(this.markers[i]);
      this.markers[i].setMap(this.map);
      bounds.extend(this.markers[i].position);
    }
    //this.map.fitBounds(bounds);
  }

  // Shows all places
  this.showPlaces = function(){
    this.currentPlaces.removeAll();
    this.allPlaces().forEach(function(place){
      self.currentPlaces.push(place);
    });
  };

  // Hides all places
  this.hidePlaces = function(){
    this.currentPlaces.removeAll();
  };
}

var viewModel = new viewModel();
// Apply HTML bindings to viewmodel
ko.applyBindings(viewModel);
