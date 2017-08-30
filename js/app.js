var ViewModel = function () {
  // Data
  // API info
  this.map = null;
  this.geoCoder = null;
  this.placesService = null;
  this.markers = [];
  this.infoWindow = null;
  this.foursquareID = 'U2P4SUDVP1MG43MSGVCCQZ3SPHI51ZWY3UYILUMSTBSIF3I5';
  this.foursquareSecret = 'SWUUH0JJIYLVOKSYKHTEEDFTMXVCCLKVEWE5MFQYFYW21MKD';

  // The collection of places
  this.places = ko.observableArray();
  this.placesBuffer = [];

  // The currently selected city
  this.city = ko.observable('Mesa, AZ');
  this.cityLocation = null;

  // Search query input
  this.queryText = ko.observable();
  this.queryRadius = ko.observable();

  // The currently selected place
  this.placeName = ko.observable();
  this.placePhoto = ko.observable();

  // Foursquare Info
  this.fsAddress = ko.observable();
  this.fsPhone = ko.observable();
  this.fsTwitter = ko.observable();
  this.fsWebsite = ko.observable();
  this.fsCheckins = ko.observable();

  // The mode of the interface (start, list, or info)
  this.mode = ko.observable('start');

  // Functions
  // Reset search query fields
  this.filterReset = function() {
    this.queryText('');
    this.queryRadius('');
  };

  // Reset foursquare info
  this.fsReset = function() {
    this.fsAddress('');
    this.fsPhone('');
    this.fsTwitter('');
    this.fsWebsite('');
    this.fsCheckins('');
  };

  // Get foursquare info
  this.getFoursquare = function(place) {
    var self = this;
    var name = place.name;
    var lat = place.geometry.location.lat();
    var lng = place.geometry.location.lng();
    var url = 'https://api.foursquare.com/v2/venues/search?ll=' + lat + ',' + lng + '&client_id=' + this.foursquareID + '&client_secret=' + this.foursquareSecret + '&v=20160118' + '&query=' + name;
    $.ajax({
      url: url,
      dataType: 'jsonp',
      success: function(result) {
        if (result.response.venues[0]) {
          // If one of these observables is set to N/A, the associated dom element is set to not display
          // Otherwise, the dom element displays the fetched information
          self.fsAddress(result.response.venues[0].location.address || 'N/A');
          self.fsPhone(result.response.venues[0].contact.formattedPhone || 'N/A');
          self.fsTwitter(result.response.venues[0].contact.twitter || 'N/A');
          self.fsWebsite(result.response.venues[0].url || 'N/A');
          self.fsCheckins(result.response.venues[0].stats.checkinsCount || 'N/A');
        }
        else {
          self.fsReset();
          window.alert('Foursquare service return no results.');
        }

        // After this request we are ready to display the info to the user
        self.showInfo(place);
      },
      error: function() {
        window.alert('Foursquare service request failed.');
        self.fsReset();
        self.showInfo(place);
      }
    });
  };

  // Bounce a marker
  this.bounce = function(marker) {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function(){
      marker.setAnimation(null);
    }, 750);
  };

  // Get info about a place
  this.getInfo = function(place) {
    this.placeName(place.name);

    if (place.photos) {
      this.placePhoto(place.photos[0].getUrl({maxWidth: 340}));
    }
    else {
      this.placePhoto(null);
    }

    // Ajax request for Foursquare info
    this.getFoursquare(place);
  };

  // Show info about a place
  this.showInfo = function(place) {
    var marker = this.getMarker(place);
    // Animate marker
    this.bounce(marker);
    // Create an info window
    this.makeInfoWindow(place, marker);
    // Change mode to info
    this.mode('info');
  };

  // Get default places from a basic city search
  this.defaultPlaces = function() {
    var self = this;
    var location = this.cityLocation;
    var radius = this.milesToMeters(10);

    this.placesBuffer = this.places();
    this.places([]);

    var request = {
      location: location,
      radius: radius
    };
    this.placesService.nearbySearch(request, function(result, status, pagination) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        self.places(self.places().concat(result));
        if (pagination.hasNextPage) {
          pagination.nextPage();
        }
        else {
          self.placesBuffer = self.places();
          self.map.panTo(self.cityLocation);
          self.showPlaces();
        }
      }
      else {
        self.places(self.placesBuffer);
        window.alert('Places service request failed.');
      }
    });
  };

  // Filter current results based on query
  this.filterPlaces = function() {
    var tempPlaces = [];
    var distance;
    // Get unfiltered places
    this.places(this.placesBuffer);
    for (var i = 0; i < this.places().length; i++) {
      distance = this.distanceBetween(this.cityLocation, this.places()[i].geometry.location);
      for (var j = 0; j < this.places()[i].types.length; j++) {
        if (this.places()[i].types[j] == this.queryText().toLowerCase() && distance < this.milesToMeters(this.queryRadius())) {
          console.log(this.places()[i].types[j]);
          console.log("match!");
          tempPlaces.push(this.places()[i]);
        }
      }
    }
    console.log(tempPlaces);
    if (tempPlaces.length > 0) {
      this.placesBuffer = this.places();
      this.places(tempPlaces);
      this.showPlaces();
    }
    else {
      window.alert("No results were returned by the filter.");
    }
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
    }
  };

  // Get the marker that matches a place
  this.getMarker = function(place) {
    for (var i = 0; i < this.markers.length; i++) {
      if (this.markers[i].position.equals(place.geometry.location)) {
        return this.markers[i];
      }
    }
  };

  // Marker listener
  this.markerClick = function() {
    var place = self.getPlace(this);
    self.getInfo(place);
  };

  // Make new markers
  this.makeMarkers = function() {
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < this.places().length; i++) {
      var title = this.places()[i].name;
      var position = this.places()[i].geometry.location;
      var marker = new google.maps.Marker({
        position: position,
        title: title,
        optimize: false,
        animation: null,
        id: i,
      });

      // Add marker to map
      marker.setMap(this.map);
      bounds.extend(marker.position);

      // Get info when marker is clicked
      marker.addListener('click', this.markerClick);

      // Add marker to markers list
      this.markers.push(marker);
    }
    this.map.fitBounds(bounds);
  };

  // Clear all markers
  this.clearMarkers = function() {
    if (this.markers) {
      for (var i = 0; i < this.markers.length; i++) {
        this.markers[i].setMap(null);
      }
    }
    this.markers = [];
  };

  // Move the map to a new latLng
  this.moveMap = function () {
    self = this;
    // Convert this.city to a latLng
    this.geoCoder.geocode({address: this.city()}, function(result, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        self.cityLocation = result[0].geometry.location;
        self.filterReset();
        self.defaultPlaces();
      }
      else {
        window.alert('Geocoder request failed.');
      }
    });
  };

  // Return to list mode from info mode
  this.menuBack = function() {
    this.infoWindow.close();
    this.mode('list');
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
    var φ1 = this.toRadians(lat1);
    var φ2 = this.toRadians(lat2);
    var Δφ = this.toRadians(lat2-lat1);
    var Δλ = this.toRadians(lon2-lon1);

    // Haversine formula
    var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);

    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    var d = R * c;

    return d;
  };

  this.initInfoWindow = function() {
    this.infoWindow = new google.maps.InfoWindow();
  };

  // Initialize the place service
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
      zoom: 10,
      mapTypeControl: false
    });
  };

  // Google maps error handler
  this.mapError = function() {
    window.alert("Google Maps failed to load.");
  };

  // Initialize the app
  this.init = function() {
    this.initMap();
    this.initGeoCoder();
    this.initPlacesService();
    this.initInfoWindow();
    this.moveMap();
  };
};

// Instantiate a viewModel so viewModel.init can be used as the google api callback
var viewModel = new ViewModel();

ko.applyBindings(viewModel);
