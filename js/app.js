var self = this;

// Added defaultIcon, bounds and markers as globals ****************************
var map, infoWindow, marker, defaultIcon, bounds;
var markers = [];


// Creating our Knckout Model
// Model holds all locations info( name, position, address, phone )
var Model = [];

// Creating our Knockout ViewModel
var appViewModel = function() {

    var self = this;

    infoWindow = new google.maps.InfoWindow();

    self.allVenues = ko.observableArray();
    self.filter = ko.observable('');
    // Observables for food choices
    self.food = ['Pizza', 'Burgers', 'Seafood', 'Sushi', 'Mexican', 'Italian', 'Steak'];
    self.foodChoice = ko.observable('Pizza');

    // **** Removed markers argument from updateMap ****************************
    self.foodChoice.subscribe(function(newValue) {
        updateMap(self.foodChoice, self.allVenues, true, infoWindow);
    });
    updateMap(self.foodChoice, self.allVenues, false, infoWindow);

    // Populate the marker of the Venue selected from the list
    self.populateInfoFromItem = function(item) {
        google.maps.event.trigger(item.marker, 'click');
    };

    self.filteredVenues = ko.computed(function() {
        var term = self.filter().toUpperCase();
        return ko.utils.arrayFilter(self.allVenues(), function(item) {
            let match = item.name.toUpperCase().indexOf(term) > -1;
            item.marker.setVisible(match);
            return match;
        });
    });
};

// Updating our map with markers and locations from the model
// We are fetching data based on the user's food selection in the DOM

// **** Removed markers parameter from updateMap ****************************
var updateMap = function(foodChoice, allVenues, init, infoWindow) {

    // *** Set empty bounds, remove all markers from map and empty markers array
    bounds = new google.maps.LatLngBounds();
    markers.forEach(function(marker) {
        marker.setMap(null);
    });
    markers = [];

    // Provide client id, client secret, and set up foursquare api
    // Foursqure Api necessities
    var client_id = 'NLIDKGASYMRAYLQE0CTQ3G2HRTWOV1CR1RIBMQF4YJMINVSP';
    var client_secret = 'UK1CHDNC5EE35T3YLHMJDI3IEXAGSMADSR35BAOK3HXULCAU';
    var base_url = 'https://api.foursquare.com/v2/';
    var endpoint = 'venues/explore?&origin=*&near=200+Resource+Parkway+Franklin+TN&query=' + foodChoice() + '&limit=20';
    var key = '&client_id=' + client_id + '&client_secret=' + client_secret + '&v=' + '20170704';
    var url = base_url + endpoint + key;

    // AJAX request from foursquare to populate our Model
    $.getJSON(url, function(data) {

        Model = [];
        var foursquareLoc = data.response.groups[0].items;

        // Loop through the foursquare data and push each item into the Model
        for (i = 0; i < foursquareLoc.length; i++) {
            // Store our data variables for later use
            var name = foursquareLoc[i].venue.name;
            var lat = foursquareLoc[i].venue.location.lat;
            var lng = foursquareLoc[i].venue.location.lng;
            var position = { lng, lat  };
            var address = foursquareLoc[i].venue.location.formattedAddress;
            var phone = foursquareLoc[i].venue.contact.formattedPhone;
            var rating = foursquareLoc[i].venue.rating;
            //  *** create marker for each location
            var marker = new google.maps.Marker({
                title: name,
                position: position,
                map: map,
                animation: google.maps.Animation.DROP,
                icon: defaultIcon,
                content: '<h2 style="margin-bottom: 0;">' + name + '</h2><h4>' + address[0] + '</br>' + address[1] + '</br>' + address[2] + '</h4><p style="font-weight: bold;">' + rating + '/10 Rating</p><a href="tel:"' + phone + '">' + phone + '</a>'
            });
            bounds.extend(marker.position);
            markers.push(marker);
            //  Model[i].marker = marker;
            // Add event listeners for when markers are either clicked or focused on
            marker.addListener('click', populateInfoWindow);
            map.fitBounds(bounds);

            // Push our items returned to the model
            Model.push({
                name: name,
                position: position,
                address: address,
                phone: phone,
                rating: rating,
                marker: marker
            });
        }

        Model = Model.sort(function(a, b) {
            return a.name > b.name ? 1 : -1;
        });

        allVenues(Model);

        // Alert fail if data is unable to be retrieved from foursquare
    }).fail(function() {
        alert("Data failed to retrieve!");
    });
};

// Map error function
function mapError() {
    alert("Map failed to load properly. Please reload and try again.");
}


//  Set  up our map markers and extend bounds
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: new google.maps.LatLng(35.9371347, -86.8095115),
    });
    // Variables to create styled markers and extend map bounds
    defaultIcon = makeDefaultIcon();

    ko.applyBindings(new appViewModel());
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
            marker.setIcon(defaultIcon);
            infowindow.marker = null;
        });
    }
    // Set marker back to default after 3 seconds
    setTimeout(function() {
        marker.setIcon(defaultIcon);
    }, 3000);
}
