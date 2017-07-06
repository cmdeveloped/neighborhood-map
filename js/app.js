$(document).ready(function() {

  // Global variables
  var self = this;
  var map, infoWindow;

  // Creating our Knckout Model
  // Model holds all locations info( name, position, address, phone )
  var Model = [];

  // Provide client id, client secret, and set up foursquare api
  // Foursqure Api necessities
  var client_id = 'NLIDKGASYMRAYLQE0CTQ3G2HRTWOV1CR1RIBMQF4YJMINVSP';
  var client_secret = 'UK1CHDNC5EE35T3YLHMJDI3IEXAGSMADSR35BAOK3HXULCAU';
  var base_url = 'https://api.foursquare.com/v2/';
  var endpoint = 'venues/explore?&near=200+Resource+Parkway+Franklin+TN&query=sushi&limit=30';
  var key = '&client_id=' + client_id + '&client_secret=' + client_secret + '&v=' + '20170704';
  var url = base_url+endpoint+key;


// Creating our Knockout ViewModel
  var appViewModel = function() {

    var self = this;

    self.allVenues = ko.observableArray([]);

    self.filter = ko.observable('');
    self.search = ko.observable('');

    // AJAX request from foursquare to populate our Model
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
      var map = initMap();
      self.map = ko.observable(map);
      Model.forEach((item) => {
        self.allVenues.push(item);
      });
    })
  }


  //  Set  up our map
  function initMap() {

    var self = this;
    self.markers = ko.observableArray([]);

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: new google.maps.LatLng(35.9371347,-86.8095115),
      });

    var infoWindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();

    for (var i = 0; i < Model.length; i++) {
      var latlng = Model[i].position;
      var name = Model[i].name;
      var address = Model[i].address;
      var phone = Model[i].phone;
      var marker = new google.maps.Marker({
        title: name,
        position: latlng,
        map: map,
        animation: google.maps.Animation.DROP,
        content: '<h2 style="margin-bottom: 0;">' + name + '</h2><h4>' + address[0] + '</br>' + address[1] + '</br>' + address[2] + '</h4><a href="tel:"' + phone + '">' + phone + '</a>'
      });
      bounds.extend(Model[i].position);
      markers.push(marker);
      marker.addListener('click', function() {
        populateInfoWindow(this, infoWindow);
      });
    }
    map.fitBounds(bounds);
  }


  // Function populates the infowindow for when a marker on the map is interacted
  function populateInfoWindow(marker, infowindow) {
    if (infowindow.marker != marker) {
      infowindow.marker = marker;
      infowindow.setContent(marker.content);
      infowindow.open(map, marker);
      infowindow.addListener('closeclick', function() {
        infowindow.marker = null;
      });
    }
  }


  // Call ViewModel to update the View
  ko.applyBindings(new appViewModel());
});
