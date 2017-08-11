$(document).ready(function() {

// Global variables
  var self = this;
  var map, infoWindow, marker;


// Creating our Knckout Model
// Model holds all locations info( name, position, address, phone )
  var Model = [];


// Creating our Knockout ViewModel
  var appViewModel = function() {

    var self = this;

    infoWindow = new google.maps.InfoWindow();

    self.allVenues = ko.observableArray();
    self.filteredVenues = ko.observableArray();
    self.markers = ko.observableArray([]);
    self.filter = ko.observable('');
    self.allVenues.subscribe(function(newValue) {
      filterFunction(self.filter(), self.allVenues, self.filteredVenues, self.markers);
    });
    self.filter.subscribe(function(newValue) {
      filterFunction(newValue, self.allVenues, self.filteredVenues, self.markers);
    });

    // Observables for food choices
    self.food = ['Pizza', 'Burgers', 'Seafood', 'Sushi', 'Mexican', 'Italian', 'Steak'];
    self.foodChoice = ko.observable('Pizza');
    self.foodChoice.subscribe(function(newValue) {
      updateMap(self.foodChoice, self.allVenues, true, self.markers, infoWindow);
    });
    updateMap(self.foodChoice, self.allVenues, false, self.markers, infoWindow);

  // Populate the marker of the Venue selected from the list
    self.populateInfoFromItem = function(item) {
      google.maps.event.trigger(item.marker, 'click');
    };

  };



// Filter the list of venues in the DOM into a new observableArray
  var filterFunction = function(term, allVenues, filteredVenues, markers) {
    term = term.toUpperCase();
    let tempArray = allVenues().filter((item) => {
      return term ? (item.name.toUpperCase()).indexOf(term) > -1 : true;
    });
    filteredVenues.removeAll();
    tempArray.forEach((item) => {
      filteredVenues.push(item);
    });
  };



// Updating our map with markers and locations from the model
// We are fetching data based on the user's food selection in the DOM
  var updateMap = function(foodChoice, allVenues, init, markers, infoWindow) {

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
        var rating = foursquareLoc[i].venue.rating;
      // Push our items returned to the model
        Model.push({
          name: name,
          position: position,
          address: address,
          phone: phone,
          rating: rating
        });
      }

      if (!init) {
        var map = initMap(true, markers, infoWindow);
      } else {
        initMap(false, markers, infoWindow);
      }

    // Push each item in Model to the allVenues array and remove after each food choice chosen
      allVenues.removeAll();
      Model = Model.sort(function(a, b) {
        return a.name > b.name ? 1 : -1;
      });
      Model.forEach((item) => {
        allVenues.push(item);
      });
  // Alert fail if data is unable to be retrieved from foursquare
    }).fail(function () {
      alert("Data failed to retrieve!");
    });
  };


// Build our map in the view
  var buildMap = function() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: new google.maps.LatLng(35.9371347,-86.8095115),
      });
  };

// Map error function
  function mapError() {
    alert("Map failed to load properly. Please reload and try again.");
  }


//  Set  up our map markers and extend bounds
  function initMap(init, markers, infoWindow) {
    if (init) {
      buildMap();
    }

  // Set our markers to null each time choice is made to clear markers
    for (var m = 0; m < markers().length; m++) {
        markers()[m].setMap(null);
    }

  // Variables to create styled markers and extend map bounds
    var bounds = new google.maps.LatLngBounds();
    var defaultIcon = makeDefaultIcon();

  // Loop through the model and set Marker properties and info window content
    for (var i = 0; i < Model.length; i++) {
      var latlng = Model[i].position;
      var name = Model[i].name;
      var address = Model[i].address;
      var phone = Model[i].phone;
      var rating = Model[i].rating;
      marker = new google.maps.Marker({
        title: name,
        position: latlng,
        map: map,
        animation: google.maps.Animation.DROP,
        icon: defaultIcon,
        content: '<h2 style="margin-bottom: 0;">' + name + '</h2><h4>' + address[0] + '</br>' + address[1] + '</br>' + address[2] + '</h4><p style="font-weight: bold;">' + rating + '/10 Rating</p><a href="tel:"' + phone + '">' + phone + '</a>'
      });
      bounds.extend(Model[i].position);
      markers.push(marker);
      Model[i].marker = marker;
      // Add event listeners for when markers are either clicked or focused on
      marker.addListener('click', populateInfoWindow);
      map.fitBounds(bounds);
    }
  }


  // Functions to create custom marker icons
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
  function populateInfoWindow() {
    var marker = this;
    var infowindow = infoWindow;
    var focusIcon = makeFocusIcon();
    var defaultIcon = makeDefaultIcon();

    infowindow.marker = null;
    if (infowindow.marker != marker) {
      infowindow.marker = marker;
      infowindow.setContent(marker.content);
      infowindow.open(map, marker);
      marker.setIcon(focusIcon);
      infowindow.addListener('closeclick', function() {
        infowindow.marker = null;
      });
    }
  }


  // Call ViewModel to update the View
  ko.applyBindings(new appViewModel());
});
