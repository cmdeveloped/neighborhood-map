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

  var initialIcon = makeMarkerIcon('04275A');
  var focusIcon = makeMarkerIcon('C0E3F3');
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

  // This function populates the infowindow when the marker is clicked. We'll only allow
  // one infowindow which will open at the marker that is clicked, and populate based
  // on that markers position.
  function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
      // Clear the infowindow content to give the streetview time to load.
      infowindow.marker = marker;
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick', function() {
        infowindow.marker = null;
      });
      var streetViewService = new google.maps.StreetViewService();
      var radius = 60;
      // In case the status is OK, which means the pano was found, compute the
      // position of the streetview image, then calculate the heading, then get a
      // panorama from that and set the options
      function getStreetView(data, status) {
        if (status == google.maps.StreetViewStatus.OK) {
          var nearStreetViewLocation = data.location.latLng;
          var heading = google.maps.geometry.spherical.computeHeading(
            nearStreetViewLocation, marker.position);
            infowindow.setContent('<div style="font-weight: 500; text-align: center; padding: 10px;">' + marker.title + '</div>' + '<div id="pano"></div>');
            var panoramaOptions = {
              position: nearStreetViewLocation,
              pov: {
                heading: heading,
                pitch: 0
              }
            };
          var panorama = new google.maps.StreetViewPanorama(
            document.getElementById('pano'), panoramaOptions);
        } else {
          infowindow.setContent('<div>' + marker.title + '</div>' +
            '<div>No Street View Found</div>');
        }
      }
      // Use streetview service to get the closest streetview image within
      // 50 meters of the markers position
      streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
      // Open the infowindow on the correct marker.
      infowindow.open(map, marker);
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
