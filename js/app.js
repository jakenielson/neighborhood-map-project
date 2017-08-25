var ViewModel = function () {
  // Data
  // API objects
  this.map = null;
  this.geoCoder = null;
  this.placesService = null;
  this.markers = [];
  this.infoWindow = null;

  // The collection of places
  this.places = ko.observableArray();

  // The currently selected city
  this.city = ko.observable('Mesa, AZ');
  this.cityLocation = null;

  // Search query input
  this.queryText = ko.observable('Food');
  this.queryRadius = ko.observable(5);

  // The currently selected place
  this.placeName = ko.observable();
  this.placePhoto = ko.observable();

  // The mode of the interface (main, list, or info)
  this.mode = ko.observable('main');

  // Functions
  // Get info about a place
  this.getInfo = function(place) {
    this.placeName(place.name);

    if (place.photos) {
      this.placePhoto(place.photos[0].getUrl({maxWidth: 640}));
    }
    else {
      this.placePhoto(null);
    }

    this.showInfo(place);
  };

  // Show info about a place
  this.showInfo = function(place) {
    var marker = this.getMarker(place);
    this.makeInfoWindow(place);
    this.mode('info');
  };

  // Get places with queryText and queryRadius
  this.getPlaces = function() {
    var self = this;
    var location = this.cityLocation;
    var query = this.queryText();
    var radius = this.milesToMeters(this.queryRadius());
    var request = {
      location: location,
      radius: radius,
      query: query
    };
    this.placesService.textSearch(request, function(result, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        self.places(result);
        self.filterPlaces();
        self.showPlaces();
      }
      else {
        window.alert('Places service request failed.');
      }
    });
  };

  // Remove places that do not fit the current bounds
  this.filterPlaces = function() {
    var self = this;
    this.places(this.places().filter(function(place){
      var distance = self.distanceBetween(place.geometry.location, self.cityLocation);
      var radius = self.milesToMeters(self.queryRadius());
      return distance <= radius;
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

  // Make an infoWindow
  this.makeInfoWindow = function(place, marker) {
    var content = this.placeName();
    var marker = this.getMarker(place);
    if (this.infoWindow.marker != marker) {
      this.infoWindow.setContent(content);
      this.infoWindow.marker = marker;
      this.infoWindow.open(this.map, this.infoWindow.marker);
    }
  };

  // Get the place that matches a marker
  this.getPlace = function(marker) {
    for (var i = 0; i < this.places().length; i++) {
      if (marker.position.equals(this.places()[i].geometry.location)) {
        return this.places()[i];
      }
    };
  };

  // Get the marker that matches a place
  this.getMarker = function(place) {
    for (var i = 0; i < this.markers.length; i++) {
      if (this.markers[i].position.equals(place.geometry.location)) {
        return this.markers[i];
      }
    };
  };

  // Make new markers
  this.makeMarkers = function() {
    var bounds = new google.maps.LatLngBounds();
    for (i = 0; i < this.places().length; i++) {
      var title = this.places()[i].name;
      var position = this.places()[i].geometry.location;
      var marker = new google.maps.Marker({
        position: position,
        title: title,
        optimize: false,
        animation: null,
        id: i
      });

      // Add marker to map
      marker.setMap(this.map);
      bounds.extend(marker.position);

      // Get info when marker is clicked
      var self = this;
      marker.addListener('click', function() {
        var place = self.getPlace(this);
        self.getInfo(place);
      });

      // Add marker to markers list
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
    this.geoCoder.geocode({address: this.city()}, function(result, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        self.cityLocation = result[0].geometry.location;
        self.map.panTo(self.cityLocation);
      }
      else {
        window.alert('Geocoder request failed.');
      }
    });
  };

  // Return to a previous menu
  this.menuBack = function() {
    switch (this.mode()){
      case 'list':
        this.clearMarkers();
        this.mode('main');
        break;
      case 'info':
        this.infoWindow.close();
        this.mode('list');
        break;
      default:
        break;
    };
  };

  // Called when a list item is clicked
  this.listClick = function(place) {
    this.getInfo(place);
  };

  // Convert miles to meters
  this.milesToMeters = function(miles) {
    var meters = miles * 1609; // 1 mi = 1609 m
    return meters;
  };

  // Converts degrees to radians
  this.toRadians = function(degrees) {
    return degrees * Math.PI / 180;
  };

  // Find distance between two latLngs
  this.distanceBetween = function(point1, point2) {
    var R = 6371e3; // Hokay. So. Here's the earth's radius...
    var lat1 = point1.lat();
    var lat2 = point2.lat();
    var lon1 = point1.lng();
    var lon2 = point2.lng();
    var φ1 = this.toRadians(lat1)
    var φ2 = this.toRadians(lat2)
    var Δφ = this.toRadians(lat2-lat1)
    var Δλ = this.toRadians(lon2-lon1)

    // Haversine formula
    var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);

    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    var d = R * c;

    return d;
  };

  this.initInfoWindow = function() {
    this.infoWindow = new google.maps.InfoWindow();
  };

  // Initialize the
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
    this.initInfoWindow();
  }
};

// Instantiate a viewModel so viewModel.init can be used as the google api callback
var viewModel = new ViewModel();
ko.applyBindings(viewModel);
