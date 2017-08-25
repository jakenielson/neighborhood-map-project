var ViewModel = function () {
  // Data
  // API objects
  this.map = null;
  this.geoCoder = null;
  this.placesService = null;
  this.markers = [];

  // The collection of places
  this.places = ko.observableArray();

  // The currently selected city
  this.city = ko.observable('Mesa, AZ');

  // Search query input
  this.queryText = ko.observable('Food');
  this.queryRadius = ko.observable(5);

  // The mode of the interface (main, list, or info)
  this.mode = ko.observable('main');

  // Functions
  // Get places with queryText and queryRadius
  this.getPlaces = function() {
    var self = this;
    // Convert this.city to a latLng
    this.geoCoder.geocode({address: this.city()}, function(result){
      var location = result[0].geometry.location;
      var query = self.queryText();
      var radius = self.milesToMeters(self.queryRadius());
      var request = {
        location: location,
        radius: radius,
        query: query
      };
      self.placesService.textSearch(request, function(result) {
        self.places(result);
        self.filterPlaces();
        self.showPlaces();
      });
    });
  };

  // Remove places that do not fit the current bounds
  this.filterPlaces = function() {
    var bounds = this.map.getBounds();
    this.places(this.places().filter(function(place){
      return bounds.contains(place.geometry.location);
    }));
  };

  // Show places on the map and in the list
  this.showPlaces = function() {
    // Clear markers and make new ones
    this.clearMarkers();
    this.makeMarkers();

    // Set mode to list
    this.mode('list');
  };

  // Make new markers
  this.makeMarkers = function() {
    var bounds = this.map.getBounds();
    for (i = 0; i < this.places().length; i++) {
      var title = this.places()[i].name;
      var position = this.places()[i].geometry.location;

      // Check if marker is in bounds (redundancy)
      if (bounds.contains(position)){
        var marker = new google.maps.Marker({
          position: position,
          title: title,
          optimize: false,
          animation: null,
          id: i
        });

        // Add marker to map
        marker.setMap(this.map);
        this.markers.push(marker);
      }
    };
  };

  // Clear all markers
  this.clearMarkers = function() {
    if (this.markers) {
      for (var i = 0; i < this.markers.length; i++) {
        this.markers[i].setMap(null);
      };
    };
    this.markers = [];
  };

  // Move the map to a new latLng
  this.moveMap = function () {
    self = this;
    // Convert this.city to a latLng
    this.geoCoder.geocode({address: this.city()}, function(result) {
      var location = result[0].geometry.location;
      self.map.panTo(location);
    });
  };

  // Return to a previous menu
  this.menuBack = function() {
    console.log("Meep!");
    switch (this.mode()){
      case 'list':
        this.clearMarkers();
        this.mode('main');
        break;
      default:
        break;
    };
  };

  // Convert miles to meters
  this.milesToMeters = function(miles) {
    var meters = miles * 1609; // 1 mi = 1609 m
    return meters;
  };

  // Find distance between two latLngs
  this.distanceBetween = function(point1, point2) {
    // Haversine formula
    var R = 6371e3; // Hokay. So. Here's the earth's radius...
    var lat1 = point1.lat();
    var lat2 = point2.lat();
    var lon1 = point1.lng();
    var lon2 = point2.lng();
    var φ1 = lat1.toRadians();
    var φ2 = lat2.toRadians();
    var Δφ = (lat2-lat1).toRadians();
    var Δλ = (lon2-lon1).toRadians();

    var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);

    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    var d = R * c;

    return d;
  };

  // Initialize the placesService
  this.initPlacesService = function() {
    this.placesService = new google.maps.places.PlacesService(this.map);
  };

  // Initialize the geoCoder
  this.initGeoCoder = function() {
    this.geoCoder = new google.maps.Geocoder();
  };

  // Initialize the map
  this.initMap = function() {
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 33.364070, lng: -111.858903},
      zoom: 13,
      mapTypeControl: false
    });
  };

  // Initialize the app
  this.init = function() {
    this.initMap();
    this.initGeoCoder();
    this.initPlacesService();
  }
};

// Instantiate a viewModel so viewModel.init can be used as the google api callback
var viewModel = new ViewModel();
ko.applyBindings(viewModel);
