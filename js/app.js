var ViewModel = function () {
  // Data
  // API objects
  this.map = null;
  this.geoCoder = null;
  this.placesService = null;
  this.markers = [];
  this.markerIcon = null;

  // The collection of places
  this.places = ko.observableArray();

  // The places currently shown in the menu list
  this.shownPlaces = ko.observableArray();

  // The currently selected city
  this.city = ko.observable('Mesa, AZ');

  // The mode of the interface (main, list, or info)
  this.mode = ko.observable('main');

  // Functions
  // Get hotels
  this.getHotels = function () {
    this.getPlaces('hotel');
  };

  // Get restaurants
  this.getRestaurants = function () {
    this.getPlaces('food');
  };

  // Get entertainment
  this.getEntertainment = function () {
    this.getPlaces('entertainment');
  };

  // Get shopping
  this.getShopping = function () {
    this.getPlaces('shopping');
  };

  // Get ATMs
  this.getATMs = function () {
    this.getPlaces('ATM');
  };

  // Get hotels
  this.getTourism = function () {
    this.getPlaces('tourism');
  };

  // Get places with given query
  this.getPlaces = function(query) {
    var self = this;
    // Convert this.city to a latLng
    this.geoCoder.geocode({address: this.city()}, function(result){
      var location = result[0].geometry.location;
      var request = {
        location: location,
        radius: 200,
        query: query
      };
      self.placesService.textSearch(request, function(result) {
        self.places(result);
        self.showPlaces();
      });
    });
  };

  // Show places on the map and in the list
  this.showPlaces = function() {
    // Get the first 5 places
    var shown = [];
    for (var i = 0; i < 5; i++){
      shown[i] = this.places()[i];
    };

    // Show the first 5 places
    this.shownPlaces(shown);

    // Clear markers
    this.clearMarkers();

    // Make new markers
    this.makeMarkers();

    // Set mode to list
    this.mode('list');
  };

  // Make new markers
  this.makeMarkers = function() {
    var bounds = new google.maps.LatLngBounds();
    for (i = 0; i < this.places().length; i++) {
      var title = this.places()[i].name;
      var position = this.places()[i].geometry.location;
      var icon = this.markerIcon;
      var marker = new google.maps.Marker({
        position: position,
        title: title,
        icon: icon,
        optimize: false,
        animation: null,
        id: i
      });
      // Add marker to map
      marker.setMap(this.map);
      bounds.extend(marker.position);
      this.markers.push(marker);
    };
    this.map.fitBounds(bounds);
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

  // Initialize the placesService
  this.initPlacesService = function() {
    this.placesService = new google.maps.places.PlacesService(this.map);
  };

  // Initialize the geoCoder
  this.initGeoCoder = function() {
    this.geoCoder = new google.maps.Geocoder();
  };

  // Initialize the map icon
  this.initIcon = function() {
    var markerColor = '0091ff';
    this.markerIcon = new google.maps.MarkerImage(
      'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
      '|40|_|%E2%80%A2',
      new google.maps.Size(21, 34),
      new google.maps.Point(0, 0),
      new google.maps.Point(10, 34),
      new google.maps.Size(21, 34));
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
    this.initIcon();
    this.initGeoCoder();
    this.initPlacesService();
  }
};

// Instantiate a viewModel so viewModel.init can be used as the google api callback
var viewModel = new ViewModel();
ko.applyBindings(viewModel);
