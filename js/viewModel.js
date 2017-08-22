var viewModel = function() {
  var self = this;
  var map;
  var markers = [];

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
    // Create map
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 33.364070, lng: -111.858903},
      zoom: 13,
      mapTypeControl: false
    });
  };

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
