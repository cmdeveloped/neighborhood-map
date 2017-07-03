var map;
var initialIcon;
var focusIcon;
var infoWindow;

function throwError() {
  alert('Could not load page properly.');
}

function initMap() {
  var styles = [
    {
      featureType: 'water',
      stylers: [
        {
          color: '#b2ebf2'
        }
      ]
    }
  ];

  var home = {lat: 35.9372555, lng: -86.8104977};
  var mapOptions = {
    center: home,
    zoom: 15,
    styles: styles,
  }
  map = new google.maps.Map(document.getElementById('map'), mapOptions);

  var locations = [
    {
      name: 'Tupelo Honey',
      lat: 35.9516141,
      lng: -86.8100217,
    },
    {
      name: 'The Draft Room at Kings',
      lat: 35.9543433,
      lng: -86.8170027,
    },
    {
      name: 'Jonathan\'s Grille',
      lat: 35.9525577,
      lng: -86.8167662,
    },
    {
      name: 'Kona Grill',
      lat: 35.9547463,
      lng: -86.8175827,
    },
    {
      name: 'Connors Steak & Seafood',
      lat: 35.9550245,
      lng: -86.8173964,
    },
    {
      name: 'Brewhouse South',
      lat: 35.9531633,
      lng: -86.8154846,
    },
    {
      name: 'John\'s Burgers',
      lat: 35.9560944,
      lng: -86.8167678,
    },
    {
      name: 'Noodles and Company',
      lat: 35.9507806,
      lng: -86.8098181,
    },
    {
      name: 'Swanky\'s Taco Shop',
      lat: 35.9503513,
      lng: -86.8099877,
    },
    {
      name: 'L&L Hawaiian Grill',
      lat: 35.9517293,
      lng: -86.8098397,
    }

  ]
}
