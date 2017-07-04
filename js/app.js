var map;
var markers = [];

function throwError() {
  alert('Could not load page properly.');
}

function initMap() {
  var styles = [
    {
       "featureType": "poi",
       "elementType": "all",
       "stylers": [
           {
               "visibility": "off"
           }
       ]
   },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "color": "#b2ebf2"
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#c8d7d4"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#070707"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    }
];

  var initialIcon = makeMarkerIcon('455a64');
  var focusIcon = makeMarkerIcon('b2ebf2');
  var home = {lat: 35.9372555, lng: -86.8104977};

  var mapOptions = {
    center: home,
    zoom: 13,
    styles: styles,
    mapTypeControl: false
  }
  map = new google.maps.Map(document.getElementById('map'), mapOptions);

  var locations = [
    {
      title: 'Tupelo Honey',
      LatLng: {
        lat: 35.9516098,
        lng: -86.807833,
      }
    },
    {
      title: 'The Draft Room at Kings',
      LatLng: {
        lat: 35.954339,
        lng: -86.814814,
      }
    },
    {
      title: 'Jonathan\'s Grille',
      LatLng: {
        lat: 35.9525534,
        lng: -86.8145775,
      }
    },
    {
      title: 'Kona Grill',
      LatLng: {
        lat: 35.954742,
        lng: -86.815394,
      }
    },
    {
      title: 'Connors Steak & Seafood',
      LatLng: {
        lat: 35.9550202,
        lng: -86.8152077,
      }
    },
    {
      title: 'Brewhouse South',
      LatLng: {
        lat: 35.953159,
        lng: -86.8132959,
      }
    },
    {
      title: 'John\'s Burgers',
      LatLng: {
        lat: 35.9560901,
        lng: -86.8145791,
      }
    },
    {
      title: 'Noodles and Company',
      LatLng: {
        lat: 35.9507763,
        lng: -86.8076294
      }
    },
    {
      title: 'Swanky\'s Taco Shop',
      LatLng: {
        lat: 35.950347,
        lng: -86.807799
      }
    },
    {
      title: 'L&L Hawaiian Grill',
      LatLng: {
        lat: 35.951725,
        lng: -86.807651
      }
    }
  ];

  var infoWindow = new google.maps.InfoWindow();
  var bounds = new google.maps.LatLngBounds();
  for (var i = 0; i < locations.length; i++) {
    var position = locations[i].LatLng;
    var title = locations[i].title;
    var marker = new google.maps.Marker({
      map: map,
      position: position,
      title: title,
      icon: initialIcon,
      animation: google.maps.Animation.DROP,
      id: i
    });
    markers.push(marker);
    bounds.extend(marker.position);
    marker.addListener('click', function() {
      populateInfoWindow(this, infoWindow);
    });
    marker.addListener('mouseover', function() {
      this.setIcon(focusIcon);
    });
    marker.addListener('mouseout', function() {
      this.setIcon(initialIcon);
    });
  }
  map.fitBounds(bounds);

  function populateInfoWindow(marker, infowindow) {
    if (infowindow.marker != marker) {
      infowindow.marker = marker;
      infowindow.setContent('<div>' + marker.title + '</div>');
      infowindow.open(map, marker);
      infowindow.addListener('closeclick', function() {
        infowindow.setMarker(null);
      });
    }
  }
  function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
      'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
      '|40|_|%E2%80%A2',
      new google.maps.Size(21, 34),
      new google.maps.Point(0, 0),
      new google.maps.Point(10, 34),
      new google.maps.Size(21,34));
    return markerImage;
  }
}
