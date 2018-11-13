var locations = [
  {
    title: "jaipur",
    location: {
      lat: 26.922070,
      lng: 75.778885
    }
  },
  {
	title: "Jaisalmer",
    location: {
      lat: 26.9157,
      lng: 70.9083
    }  
  },
  {
    title: "jodhpur",
    location: {
      lat: 26.263863,
      lng: 73.008957
    }
  },
  {
    title: "Pushkar",
    location: {
      lat: 26.49022,
      lng: 74.55211
    }
  },
  {
    title: "Udaipur",
    location: {
      lat: 24.571270,
      lng: 73.691544
    }
  },
  {
    title: "Ajmer",
    location: {
      lat: 26.449896,
      lng: 74.639915
    }
  },
  {
    title: "Bikaner",
    location: {
      lat: 28.0229,
      lng: 73.3119
    }
  },
  {
    title: "Chittorgarh",
    location: {
      lat: 24.8887435,
      lng: 74.62692160000006
    }
  },
  {
    title: "Alwar",
    location: {
      lat: 27.560932,
      lng: 76.625015
    }
  }

];

var map;
// Create a new blank array for all the listing markers.
var markers = [];
var largeInfowindow;
//-------------------view-model---------------------------------------------------------
var viewModel = {
  locationslist: ko.observableArray(locations.slice(0)),
  query: ko.observable(''),
  search: function(value) {
    // remove all the current location, which removes them from the view
    viewModel.locationslist.removeAll();
    //set all markers visible
    for (var x = 0; x < locations.length; x++) {
      markers[x].setVisible(true);
    }
    for (var x = 0; x < locations.length; x++) {
      //console.log(x);
      if (locations[x].title.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
        //console.log(locations[x]);
        viewModel.locationslist.push(locations[x]);
      } else {
        markers[x].setVisible(false);
      }
    }
  },
  clickLI: function(data) { //when listItem is clicked
    var clickedItem;
    //identify the corresponing marker
    for (var i = 0; i < markers.length; i++) {
      if (markers[i].title == data.title) {
        //opens the corresponding infowindow
        viewModel.populateInfoWindow(markers[i], largeInfowindow);
        clickedItem = markers[i];
      }
    }
    //animate the corresponing marker for 1sec
    clickedItem.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
      //console.log(clickedItem);
      clickedItem.setAnimation(google.maps.Animation.null);
    }, 1400);
  },
  populateInfoWindow: function(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
      // Clear the infowindow content to give the streetview time to load.
      infowindow.setContent('');
      infowindow.marker = marker;
      //wikipedia api
      var wikiurl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + marker.title + '&format=json&callback=wikiCallback';
      var url;
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick', function() {
        infowindow.marker = null;
      });

      var streetViewService = new google.maps.StreetViewService();
      var radius = 100;
      // In case the status is OK, which means the pano was found, compute the
      // position of the streetview image, then calculate the heading, then get a
      // panorama from that and set the options
      function getStreetView(data, status) {
        if (status == google.maps.StreetViewStatus.OK) {
          var nearStreetViewLocation = data.location.latLng;
          var heading = google.maps.geometry.spherical.computeHeading(
            nearStreetViewLocation, marker.position);
          var panoramaOptions = {
            position: nearStreetViewLocation,
            pov: {
              heading: heading,
              pitch: 30
            }
          };
          var panorama = new google.maps.StreetViewPanorama(
            document.getElementById('pano'), panoramaOptions);
        } else {
          if (reqstatus == true) {
            infowindow.setContent('<div>' + marker.title + '</div>' +
              '<div>No Street View Found</div><div><a href="' + url + '">' + url + '</a></div>');
          } else {
            console.log(reqstatus);
            infowindow.setContent('<div>' + marker.title + '</div>' +
              '<div>No Street View Found</div><div>Relevant Wikipedia Links cannot be loaded</div>');
            reqstatus = true; //resetting
          }
        }
      }
      var reqstatus = true;//to indicate the status of wikipedia request
      $.ajax({
          url: wikiurl,
          dataType: "jsonp",
          jsonp: "callback"
        })
        .done(function(response) {
          //console.log(response);
          var articleList = response[3][0];
          url = articleList;
          console.log(url);
          // Use streetview service to get the closest streetview image within
          // 100 meters of the markers position
          streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
          //if( typeof url == 'undefined'){
          //  infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div><div><p>Data is not available</p></div>');
          //}
          infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div><div><a href="' + url + '">' + url + '</a></div>');
        })
        .fail(function(jqXHR, textStatus) {
          reqstatus = false;//to indicate wikipedia request failed
          alert(" wikipedia request failed");
          streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
          infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div><div><p>Relevant Wikipedia Links cannot be loaded</p></div>');
        });

      // Open the infowindow on the correct marker.
      infowindow.open(map, marker);
    }
  },
  makeMarkerIcon: function(markerColor) {
    var markerImage = new google.maps.MarkerImage(
      'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
      '|40|_|%E2%80%A2',
      new google.maps.Size(21, 34),
      new google.maps.Point(0, 0),
      new google.maps.Point(10, 34),
      new google.maps.Size(21, 34));
    return markerImage;
  }
};
function initMap() {
  // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 26.922070,
      lng: 75.778885
    },
    zoom: 12
  });
  viewModel.query.subscribe(viewModel.search);
  ko.applyBindings(viewModel);
  largeInfowindow = new google.maps.InfoWindow();
  var bounds = new google.maps.LatLngBounds();
  // Style the markers a bit. This will be our listing marker icon.
  var defaultIcon = viewModel.makeMarkerIcon('FE7569');

  // Create a "highlighted location" marker color for when the user
  // mouses over the marker.
  var highlightedIcon = viewModel.makeMarkerIcon('FFFF24');

  // The following group uses the location array to create an array of markers on initialize.
  for (var i = 0; i < locations.length; i++) {
    // Get the position from the location array.
    var position = locations[i].location;
    var title = locations[i].title;
    // Create a marker per location, and put into markers array.
    var marker = new google.maps.Marker({
      map: map,
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      icon: defaultIcon,
      id: i
    });
    // Push the marker to our array of markers.
    markers.push(marker);
    // Create an onclick event to open an infowindow at each marker.
    marker.addListener('click', function() {
      var self = this;
      self.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
      self.setAnimation(google.maps.Animation.null);
    }, 700);
      viewModel.populateInfoWindow(this, largeInfowindow);
    });
    // Two event listeners - one for mouseover, one for mouseout,
    // to change the colors back and forth.
    marker.addListener('mouseover', function() {
      this.setIcon(highlightedIcon);
    });
    marker.addListener('mouseout', function() {
      this.setIcon(defaultIcon);
    });
    bounds.extend(markers[i].position);
    google.maps.event.addDomListener(window, 'resize', function() {
      map.fitBounds(bounds); // `bounds` is a `LatLngBounds` object
    });
  }
  // Extend the boundaries of the map for each marker
  map.fitBounds(bounds);
};


function mapError() {
  alert("failed to load map! try again..");
}
