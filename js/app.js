var ViewModel = function () {
  // Data
  // API objects
  this.map = null;
  this.geoCoder = null;
  this.placesService = null;
  this.markers = [];

  // The collection of places
  this.places = [];

  // The places currently shown in the menu list
  this.shownPlaces = ko.observableArray();

  // The currently selected city
  this.city = ko.observable('Mesa, AZ');

  // The mode of the interface (main, list, or info)
  this.mode = ko.observable('main');

  // Functions
  // Return to a previous menu
  this.menuBack = function() {
    console.log("Meep!");
    switch (this.mode()){
      case 'list':
        // Clear markers
        if (this.markers) {
          for (i = 0; i< this.markers.length; i++) {
            this.markers[i].setMap(null);
          };
        };
        this.markers = [];

        // Change mode
        this.mode('main');
        break;
      default:
        break;
    };
  };

  // Show places
  this.showPlaces = function() {
    // Update shownPlaces
    var shown = [];
    for (var i = 0; i < 5; i++){
      shown[i] = this.places[i];
    };
    this.shownPlaces(shown);

    // Clear markers
    if (this.markers) {
      for (i = 0; i< this.markers.length; i++) {
        this.markers[i].setMap(null);
      };
    };

    this.markers = [];

    // Make new markers
    for (i = 0; i < this.places.length; i++) {
      var title = this.places[i].name;
      var position = this.places[i].geometry.location;
      var marker = new google.maps.Marker({
        position: position,
        title: title,
        animation: google.maps.Animation.DROP,
        id: i
      });

      marker.setMap(this.map);
      this.markers.push(marker);

      // Set mode to list
      this.mode('list');
    }
  };

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
        self.places = result;
        self.showPlaces();
      });
    });
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
