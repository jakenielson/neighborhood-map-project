var viewModel = {
  map: null,
  markers: [],
  allPlaces: ko.observableArray(),
  currentPlaces: ko.observableArray(),

  initPlaces: function() {
    var self = this;
    initialPlaces.forEach(function(place){
      self.allPlaces.push(new Place(place));
    });
    this.allPlaces().forEach(function(place){
      self.currentPlaces.push(place);
    });
  },

  // Initializes the map
  initMap: function() {
    this.createMap();
    this.createMarkers(this.allPlaces());
  },

  // Create map
  createMap: function() {
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 33.364070, lng: -111.858903},
      zoom: 13,
      mapTypeControl: false
    });
  },

  // Create markers
  createMarkers: function(places) {
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
    // Show markers
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(this.map);
      bounds.extend(this.markers[i].position);
    }
    this.map.fitBounds(bounds);
  },

  // Shows all places
  showPlaces: function(){
    var self = this;
    this.currentPlaces.removeAll();
    this.allPlaces().forEach(function(place) {
      self.currentPlaces.push(place);
    });
  },

  // Hides all places
  hidePlaces: function(){
    this.currentPlaces.removeAll();
  },

  // Initialize the app
  init: function(){
    this.initPlaces();
    this.initMap();
  }
}

ko.applyBindings(viewModel);
