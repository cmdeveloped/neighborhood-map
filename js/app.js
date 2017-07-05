// Provide client id, client secret, and set up foursquare api
// Foursqure Api necessities
var client_id = 'NLIDKGASYMRAYLQE0CTQ3G2HRTWOV1CR1RIBMQF4YJMINVSP';
var client_secret = 'UK1CHDNC5EE35T3YLHMJDI3IEXAGSMADSR35BAOK3HXULCAU';
var base_url = 'https://api.foursquare.com/v2/';
var endpoint = 'venues/explore?&near=200+Resource+Parkway+Franklin+TN&section=food&limit=30';

var key = '&client_id=' + client_id + '&client_secret=' + client_secret + '&v=' + '20170704';
var url = base_url+endpoint+key;

// Create Model to hold our data
function ViewModel() {
  var locations = ko.observableArray();
  $.getJSON(url, function( data ) {
    var foursquareLoc = data.response.groups[0].items;
    for (i = 0; i < foursquareLoc.length; i++) {
      var name = foursquareLoc[i].venue.name;
      var lat = foursquareLoc[i].venue.location.lat;
      var lng = foursquareLoc[i].venue.location.lng;
      var address = foursquareLoc[i].venue.location.formattedAddress;
      var phone = foursquareLoc[i].venue.contact.formattedPhone;
      locations.push([name, lat, lng, address, phone]);
    }
  })
  console.log(locations());
}


//set up map
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
      zoom: 15,
      center: new google.maps.LatLng(35.9371347,-86.8095115),
    });
}

initMap();
ko.applyBindings(new ViewModel());
