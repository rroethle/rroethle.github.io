
//foursquare api request on check foursquare button
$.ajax({
  url: "https://api.foursquare.com/v2/venues/search?ll=40.7,-74&client_id=YNIEXZ5YNVOJCQBX4N3DZV12FZHDXEDJOZ0JSHBFWNG12IRE&client_secret=4PSDC0XNN0XX2CTJWIFXXPCL4VHLP50JABM4QTKWIGELRDNA&v=20151008",
  context: document.body
}).done(function(data) {
  console.log(data);
});



// yelp api request on check yelp button

 var auth = {
  //
  // Update with your auth tokens.
  //
  consumerKey: "ZAgjJS-SkpB0NEHUkWAfmw",
  consumerSecret: "r_gl01KzA9EnBaglR0P7-SzPYkk",
  accessToken: "EZnWqHtrUEdEw-FNqz28HZ-KrXg6EfAe",
  // This example is a proof of concept, for how to use the Yelp v2 API with javascript.
  // You wouldn't actually want to expose your access token secret like this in a real application.
  accessTokenSecret: "-Y4PX34FcGM67mWdIq_FA3N1r1s",
  serviceProvider: {
    signatureMethod: "HMAC-SHA1"
  }
};




function locationNeighbor(name) {
    var self = this;
    self.name = name;    
}


//view model
var NeighborhoodViewModel ={
  searchLocation : ko.observable(""),
  neighborhood : ko.observable(""),
  review: ko.observable(true),
  reviewSiteResults: ko.observable("Foursquare"),
  foundLocations : ko.observableArray([]),


   getNeighborhood : function(){
        if (this.neighborhood() != "") {
            this.foundLocations.push(new locationNeighbor(this.searchLocation())); // Adds the item. Writing to the "items" observableArray causes any associated UI to update.
            //this.searchLocation(""); // Clears the text box, because it's bound to the "itemToAdd" observable
        }
    }.bind(this),
  
    createMap : function(){
        var map = new google.maps.Map(document.querySelector('#map'), mapOptions);
        var mapOptions = {
          disableDefaultUI: true
        }
    
        function createMapMarker(placeData){
            // The next lines save location data from the search result object to local variables
            var lat = placeData.geometry.location.lat();
            // latitude from the place service
            var lon = placeData.geometry.location.lng();  // longitude from the place service
            var name = placeData.formatted_address;   // name of the place from the place service
            var bounds = window.mapBounds;            // current boundaries of the map window
            // marker is an object with additional data about the pin for a single location
            var marker = new google.maps.Marker({
                map: map,
                position: placeData.geometry.location,
                title: name
            })
            // infoWindows are the little helper windows that open when you click
            // or hover over a pin on a map. They usually contain more information
            // about a location.
            var infoWindow = new google.maps.InfoWindow({
                content: name
            })
            // this is where the pin actually gets added to the map.
            // bounds.extend() takes in a map location object
            
            bounds.extend(new google.maps.LatLng(lat, lon));
            // fit the map to the new marker
            map.fitBounds(bounds);
            // center the map
            map.setCenter(bounds.getCenter());
        }; //end createMapMarker

        function callback(results, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
              createMapMarker(results[0]);
            }
        };

        function pinPoster(locations){
        // creates a Google place search service object. PlacesService does the work of
        // actually searching for location data.
            var service = new google.maps.places.PlacesService(map);
          // the search request object
            var request = {
                query: locations
            };
          // Actually searches the Google Maps API for location data and runs the callback
          // function with the search results after each search.
          //service.nearbySearch(request, callback);
            service.textSearch(request, callback);
        }; //pinPoster

        // locations is an array of location strings returned from locationFinder()
        var locations = this.neighborhood();
        pinPoster(locations) 
    }// end of create map
  };// end of NeighborhoodViewModel

//activates knockout.js
ko.applyBindings(NeighborhoodViewModel)

function getResults(){
  //if (this.searchLocation() != "") {
          var terms = 'food';
          var near = 'San+Francisco';

var near = NeighborhoodViewModel.neighborhood();
var terms = NeighborhoodViewModel.searchLocation();
console.log(terms);

var accessor = {
  consumerSecret: auth.consumerSecret,
  tokenSecret: auth.accessTokenSecret
};

parameters = [];
parameters.push(['term', terms]);
parameters.push(['location', near]);
parameters.push(['callback', 'cb']);
parameters.push(['oauth_consumer_key', auth.consumerKey]);
parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
parameters.push(['oauth_token', auth.accessToken]);
parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

var message = {
  'action': 'http://api.yelp.com/v2/search',
  'method': 'GET',
  'parameters': parameters
};

OAuth.setTimestampAndNonce(message);
OAuth.SignatureMethod.sign(message, accessor);

var parameterMap = OAuth.getParameterMap(message.parameters);
parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature)

    $.ajax({
  'url': message.action,
  'data': parameterMap,
  'cache': true,
  'dataType': 'jsonp',
  'jsonpCallback': 'cb',
  'success': function(data, textStats, XMLHttpRequest) {
    console.log(NeighborhoodViewModel.foundLocations([]))
    NeighborhoodViewModel.foundLocations([])
    console.log(NeighborhoodViewModel.foundLocations([]))
    for (i=0; i<5; i += 1){
      NeighborhoodViewModel.foundLocations.push(new locationNeighbor(data.businesses[i].name));
      }
      NeighborhoodViewModel.searchLocation(NeighborhoodViewModel.searchLocation());
    } // Adds the item. Writing to the "items" observableArray causes any associated UI to update.
    //alert(data.businesses[i].name);
    
});
//}
};

NeighborhoodViewModel.createMap()



var map;    // declares a global map variable
/*
Start here! initMap() is called when page is loaded.
*/
function initMap() {
  var locations;

  var mapOptions = {
    disableDefaultUI: true
  };
  // This next line makes `map` a new Google Map JavaScript Object and attaches it to
  // <div id="map">, which is appended as part of an exercise late in the course.
  map = new google.maps.Map(document.querySelector('#map'), mapOptions);
  
  function locationFinder() {
    // initializes an empty array
    var locations = ["Wisconsin Dells,Wisconsin"];
    return locations;
  }

  /*
  createMapMarker(placeData) reads Google Places search results to create map pins.
  placeData is the object returned from search results containing information
  about a single location.
  */
  function createMapMarker(placeData) {



    // The next lines save location data from the search result object to local variables
    var lat = placeData.geometry.location.lat();
      // latitude from the place service
    var lon = placeData.geometry.location.lng();  // longitude from the place service
    var name = placeData.formatted_address;   // name of the place from the place service
    var bounds = window.mapBounds;            // current boundaries of the map window

    // marker is an object with additional data about the pin for a single location
    var marker = new google.maps.Marker({
      map: map,
      position: placeData.geometry.location,
      title: name
    });
	
    // infoWindows are the little helper windows that open when you click
    // or hover over a pin on a map. They usually contain more information
    // about a location.
    var infoWindow = new google.maps.InfoWindow({
      content: name
    });

    // this is where the pin actually gets added to the map.
    // bounds.extend() takes in a map location object
    bounds.extend(new google.maps.LatLng(lat, lon));
    // fit the map to the new marker
    map.fitBounds(bounds);
    // center the map
    map.setCenter(bounds.getCenter());
  } //createMapMarker
  
    google.maps.event.addListener(map, 'click', function(event) {
      /*
	    After user clicks on map, the latitude and longitude of the place is recorded
	    and a new info window is generated. Using geocoder, the name of the place is looked up
		and a marker is placed on the map. The title for the info window is generated by user input
		from a JavaScript prompt.
		Also, the user is given the ability to right click on a location to delete it after placing
		the marker.
	  */
      var location = new google.maps.LatLng(event.latLng.lat(),event.latLng.lng())
	  var infowindow = new google.maps.InfoWindow();
      geocoder = new google.maps.Geocoder();
	  geocoder.geocode({'latLng': location}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      if (results[1]) {
        marker = new google.maps.Marker({
            position: location,
            map: map,
			title: prompt("Enter location title")
        });
        //event listener which waits for the user to click on the map.
		google.maps.event.addListener(marker, 'click', function(event) {
			infowindow.setContent(results[1].formatted_address);
			infowindow.open(map, marker);
		})
		/*event listener which waits for the user to rightclick on the map, which will delete a marker created
		  by the user. It will not delete markers placed from the resume builder*/ 
		google.maps.event.addListener(marker, 'rightclick', function(event) {
			marker.setMap(null)
		})
      } else {
        alert('No results found');
      }
    } else {
      alert('Geocoder failed due to: ' + status);
    }
	});
    });

  /*
  callback(results, status) makes sure the search returned results for a location.
  If so, it creates a new map marker for that location.
  */
  function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      createMapMarker(results[0]);
    }
  };


  /*
  pinPoster(locations) takes in the array of locations created by locationFinder()
  and fires off Google place searches for each location
  */

function pinPoster(locations) {

    // creates a Google place search service object. PlacesService does the work of
    // actually searching for location data.
    var service = new google.maps.places.PlacesService(map);

    
    

    // Iterates through the array of locations, creates a search object for each location
    for (var place in locations) {
      
      // the search request object
      var request = {
        query: locations[place]
      };

      // Actually searches the Google Maps API for location data and runs the callback
      // function with the search results after each search.
      //service.nearbySearch(request, callback);
      service.textSearch(request, callback);
    };
  };




  

  // Sets the boundaries of the map based on pin locations
  window.mapBounds = new google.maps.LatLngBounds();

  // locations is an array of location strings returned from locationFinder()
  locations = locationFinder();

  // pinPoster(locations) creates pins on the map for each location in
  // the locations array

  pinPoster(locations);
}


// Vanilla JS way to listen for resizing of the window
// and adjust map bounds
  window.addEventListener('resize', function(e) 
  {
  // Make sure the map bounds get updated on page resize
	map.fitBounds(mapBounds);
  });