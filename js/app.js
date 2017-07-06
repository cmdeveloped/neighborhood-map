$(document).ready(function() {

  var self = this;
  var map, infoWindow;

  // Provide client id, client secret, and set up foursquare api
  // Foursqure Api necessities
  var client_id = 'NLIDKGASYMRAYLQE0CTQ3G2HRTWOV1CR1RIBMQF4YJMINVSP';
  var client_secret = 'UK1CHDNC5EE35T3YLHMJDI3IEXAGSMADSR35BAOK3HXULCAU';
  var base_url = 'https://api.foursquare.com/v2/';
  var endpoint = 'venues/explore?&near=200+Resource+Parkway+Franklin+TN&section=food&limit=30';

  var key = '&client_id=' + client_id + '&client_secret=' + client_secret + '&v=' + '20170704';
  var url = base_url+endpoint+key;

// Foursqure Query to get locations and information back.
  $.getJSON(url, function getFoursquareData( data ) {
    var foursquareLoc = data.response.groups[0].items;
    for (i = 0; i < foursquareLoc.length; i++) {
      var name = foursquareLoc[i].venue.name;
      var lat = foursquareLoc[i].venue.location.lat;
      var lng = foursquareLoc[i].venue.location.lng;
      var position = {lng, lat};
      var address = foursquareLoc[i].venue.location.formattedAddress;
      var phone = foursquareLoc[i].venue.contact.formattedPhone;
      Model.push({
        name: name,
        position: position,
        address: address,
        phone: phone
      });
    }
  })

// Creating our Knckout Model
// Model holds all locations info( name, position, address, phone )
  var Model = [];

// Creating our Knockout ViewModel
  var appViewModel = function() {
    var self = this;
    self.markers = ko.observableArray([]);
    self.allVenues = ko.observableArray([]);

    self.filter = ko.observable('');
    self.search = ko.observable('');

    // Call the map in our ViewModel and alert the user if not working properly
    var map = initMap();
    self.map = ko.observable(map);
  }
  console.log(Model)
  console.log(Model[0]);
  //set up map
  function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: new google.maps.LatLng(35.9371347,-86.8095115),
      });

    for (var i = 0; i < Model.length; i++) {
      var latlng = Model[i].position;
      var name = Model[i].name;
      var marker = new google.maps.Marker({
        title: name,
        position: latlng,
        map: map,
        animation: google.maps.Animation.DROP,
        content: Model.name + Model.address + Model.phone
      });
      markers.push(marker);
    }
  }
  // var marker = new google.maps.Marker({
  //   position: position,
  //   title: name,
  //   animation: google.maps.Animation.DROP,
  //   id: i
  // });
  // markers.push(marker);
  ko.applyBindings(new appViewModel());
});
