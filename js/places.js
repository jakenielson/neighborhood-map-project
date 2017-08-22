// The viewmodel is initially populated with these places
var initialPlaces = [
  {title: "Soda Bun Thai Food", location: {lat: 33.365249, lng: -111.860711}},
  {title: "Dickey's Barbecue Pit", location: {lat: 33.364981, lng: -111.859545}},
  {title: "Nello's Pizza", location: {lat: 33.360710, lng: -111.859361}},
  {title: "Cornish Pasty", location: {lat: 33.362786, lng: -111.876132}},
  {title: "Dragon Express", location: {lat: 33.378380, lng: -111.858199}}
];

// Place class
var Place = function(data) {
  this.title = data.title;
  this.position = data.location;
  this.show = true;
}
