$(document).ready(function() {

// Global variables
  var self = this;
  var map, infoWindow;


// Creating our Knckout Model
// Model holds all locations info( name, position, address, phone )
  var Model = [];


// Creating our Knockout ViewModel
  var appViewModel = function() {

    var self = this;
    self.food = ['Pizza', 'American', 'Sushi', 'Mexican', 'Italian', 'Steak'];
    self.allVenues = ko.observableArray([]);
    self.markers = ko.observableArray([]);
    self.filter = ko.observable('');
    self.foodChoice = ko.observable('Pizza');
    self.foodChoice.subscribe(function(newValue) {
      updateMap(self.foodChoice, self.allVenues, true, self.markers);
    });
    updateMap(self.foodChoice, self.allVenues, false, self.markers);

  }


// Updating our map with markers and locations from the model
// We are fetching data based on the user's food selection in the DOM
  var updateMap = function(foodChoice, allVenues, init, markers) {

  // Provide client id, client secret, and set up foursquare api
  // Foursqure Api necessities
    var client_id = 'NLIDKGASYMRAYLQE0CTQ3G2HRTWOV1CR1RIBMQF4YJMINVSP';
    var client_secret = 'UK1CHDNC5EE35T3YLHMJDI3IEXAGSMADSR35BAOK3HXULCAU';
    var base_url = 'https://api.foursquare.com/v2/';
    var endpoint = 'venues/explore?&near=200+Resource+Parkway+Franklin+TN&query=' + foodChoice() + '&limit=20';
    var key = '&client_id=' + client_id + '&client_secret=' + client_secret + '&v=' + '20170704';
    var url = base_url+endpoint+key;

  // AJAX request from foursquare to populate our Model
    $.getJSON(url, function( data ) {

      Model = [];
      var foursquareLoc = data.response.groups[0].items;

    // Loop through the foursquare data and push each item into the Model
      for (i = 0; i < foursquareLoc.length; i++) {
      // Store our data variables for later use
        var name = foursquareLoc[i].venue.name;
        var lat = foursquareLoc[i].venue.location.lat;
        var lng = foursquareLoc[i].venue.location.lng;
        var position = {lng, lat};
        var address = foursquareLoc[i].venue.location.formattedAddress;
        var phone = foursquareLoc[i].venue.contact.formattedPhone;
      // Push our items returned to the model
        Model.push({
          name: name,
          position: position,
          address: address,
          phone: phone
        });
      }

      if (!init) {
        var map = initMap(true, markers);
        self.map = ko.observable(map);
      } else {
        initMap(false, markers);
      }

    // Push each item in Model to the allVenues array
      allVenues.removeAll();
      Model.forEach((item) => {
        allVenues.push(item);
      });
    })
  }


// Build our map in the view
  var buildMap = function() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: new google.maps.LatLng(35.9371347,-86.8095115),
      });
  }


//  Set  up our map markers and extend bounds
  function initMap(init, markers, allVenues) {
    if (init) {
      buildMap();
    }

  // Set our markers to null each time
    for (var i = 0; i < markers().length; i++) {
        markers()[i].setMap(null);
    }

    var infoWindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();
    var defaultIcon = makeDefaultIcon();
    var focusIcon = makeFocusIcon();

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
        icon: defaultIcon,
        content: '<h2 style="margin-bottom: 0;">' + name + '</h2><h4>' + address[0] + '</br>' + address[1] + '</br>' + address[2] + '</h4><a href="tel:"' + phone + '">' + phone + '</a>'
      });
      bounds.extend(Model[i].position);
      markers.push(marker);
      marker.addListener('click', function() {
        populateInfoWindow(this, infoWindow);
      });
      marker.addListener('mouseover', function() {
        this.setIcon(focusIcon);
      });
      marker.addListener('mouseout', function() {
        this.setIcon(defaultIcon);
      });
    }
    map.fitBounds(bounds);
  }


  // Function to create custom marker icons
  function makeDefaultIcon() {
    var markerImage = new google.maps.MarkerImage(
      'images/gmmd.svg',
      new google.maps.Size(40, 40),
      new google.maps.Point(0, 0),
      new google.maps.Point(10, 34),
      new google.maps.Size(40, 40));
    return markerImage;
  }
  function makeFocusIcon() {
    var markerImage = new google.maps.MarkerImage(
      'images/gmmf.svg',
      new google.maps.Size(40, 40),
      new google.maps.Point(0, 0),
      new google.maps.Point(10, 34),
      new google.maps.Size(40, 40));
    return markerImage;
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
