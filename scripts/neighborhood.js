// Line 253 zoom map initially

 var auth = {
  // Update with your auth tokens.
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

function locationNeighbor(name,description,rating,latitude,longitude,url,people,checkins,infoWindowAddress,identification) {
    var self = this;
    self.name = name;
    self.description = description;
    self.rating = rating;
    self.latitude = latitude;
    self.longitude = longitude;
    self.combined = name + " - " + "Rating: " + rating;
    self.url = url;  
    self.people=people;
    self.checkins = checkins;
    self.infoWindowAddress = infoWindowAddress;
    self.identification = identification;
}

//view model
var NeighborhoodViewModel = {
    searchLocation : ko.observable(""),
    neighborhood : ko.observable(""),
    review: ko.observable(true),
    reviewSiteResults: ko.observable("Foursquare"),
    foundLocations : ko.observableArray([]),
    url: ko.observable(""),
    people: ko.observable(""),
    checkins: ko.observable(""),
    formattedAddress: ko.observable(""),
    searchResults: ko.observable("0"),
    searchRadius: ko.observable("5"),
    identification: ko.observable(""),
    markerArray: ko.observableArray([]),

    clickMarker : function(place,data){
      
    for(var e in NeighborhoodViewModel.markerArray()){
    if(place.name == NeighborhoodViewModel.markerArray()[e].title) {
      NeighborhoodViewModel.toggleBounce(NeighborhoodViewModel.markerArray()[e],data)

  }
  }},


    getResults : function(){
        var terms = 'food';
        var near = this.neighborhood();
        var searchQuery = this.reviewSiteResults();
        var searchMeters = parseInt(this.searchRadius() * 1609);
        terms = this.searchLocation();


        if (searchQuery == 'Yelp'){
        var accessor = {
            consumerSecret: auth.consumerSecret,
            tokenSecret: auth.accessTokenSecret
            };

        parameters = [];
        parameters.push(['term', terms]);
        parameters.push(['location', near]);
        parameters.push(['callback', 'jsonpResults']);
        parameters.push(['oauth_consumer_key', auth.consumerKey]);
        parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
        parameters.push(['oauth_token', auth.accessToken]);
        parameters.push(['oauth_signature_method', 'HMAC-SHA1']);
        parameters.push(['radius_filter', searchMeters]);

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
            'success': function(data, textStats, XMLHttpRequest) {
                NeighborhoodViewModel.foundLocations([]);
                NeighborhoodViewModel.formattedAddress(near);
                data.businesses.sort(function(a,b){return b.rating - a.rating});
                NeighborhoodViewModel.searchResults(data.businesses.length);
                
              
                for (i=0; i<data.businesses.length; i += 1){
                  if(data.businesses[i] != 'undefined'){
                    var singleInfoWindowAddress = data.businesses[i].location.address[0] + "  " + data.businesses[i].location.city + "," + data.businesses[i].location['state_code'] + " " + data.businesses[i].location['country_code']; 
                    NeighborhoodViewModel.foundLocations.push(new locationNeighbor(data.businesses[i].name,data.businesses[i].snippet_text,data.businesses[i].rating,data.businesses[i].location,data.businesses[i].longitude,data.businesses[i].url,null,null,singleInfoWindowAddress,i));
                  }
                  else{
                    console.log("not good");
             }
           }
                  
                  var mapOptions = {
                    disableDefaultUI: true
                  }
                  var bounds = new google.maps.LatLngBounds();
                  var map = new google.maps.Map(document.querySelector('#map'), mapOptions);
                  var temp = NeighborhoodViewModel.foundLocations();
                  
                  for( i = 0; i < 5; i++ ) {
                    if (i < NeighborhoodViewModel.foundLocations().length){
                    var position = new google.maps.LatLng(NeighborhoodViewModel.foundLocations()[i].latitude.coordinate.latitude, NeighborhoodViewModel.foundLocations()[i].latitude.coordinate.longitude,i);
                    bounds.extend(position);

                    var marker = new google.maps.Marker({
                      position: position,
                      map: map,
                      title: NeighborhoodViewModel.foundLocations()[i].name,
                      info: new google.maps.InfoWindow({
                      content: NeighborhoodViewModel.foundLocations()[i].infoWindowAddress
                    })
                  });

                    
                  
                  // Automatically center the map fitting all markers on the screen
                  google.maps.event.addListener(marker,'click', function() {
                    //map.setZoom(19);
                    //map.setCenter(marker.getPosition());
                    marker.info.open(map, marker);
                    });
                }
              }
                 map.fitBounds(bounds);
                $("ul.pagination3").quickPagination({pagerLocation:"top",pageSize:"12"}); 
                
            },
            error: function (xOptions, textStatus, textError) {
            console.log(textError);
        }

        });
}
else{
  var near = this.neighborhood();
  foursquareLocation = this.neighborhood();
  terms = this.searchLocation();
  
  $.ajax({
  url: "https://api.foursquare.com/v2/venues/search?client_id=YNIEXZ5YNVOJCQBX4N3DZV12FZHDXEDJOZ0JSHBFWNG12IRE&client_secret=4PSDC0XNN0XX2CTJWIFXXPCL4VHLP50JABM4QTKWIGELRDNA&v=20151008&near="+ foursquareLocation +"&query="+terms + "&radius="+searchMeters,
  context: document.body
}).done(function(data) {
  NeighborhoodViewModel.foundLocations([]);
  data.response.venues.sort(function(a,b){return b.stats.checkinsCount - a.stats.checkinsCount});
  NeighborhoodViewModel.searchResults(data.response.venues.length);
  NeighborhoodViewModel.formattedAddress(near);
  for (i=0; i<data.response.venues.length; i += 1){
                  if(data.response.venues != 'undefined'){
                    var singleInfoWindowAddress = data.response.venues[i].location.formattedAddress[0] + data.response.venues[i].location.formattedAddress[1] + data.response.venues[i].location.formattedAddress[2];
                    NeighborhoodViewModel.foundLocations.push(new locationNeighbor(data.response.venues[i].name,null,null,data.response.venues[i].location.lat,data.response.venues[i].location.lng,data.response.venues[i].url,data.response.venues[i].hereNow.summary,data.response.venues[i].stats.checkinsCount,singleInfoWindowAddress,"test" + i));
                    
                  }
                  else{
                    console.log("Venue came back undefined");
             }
           }

   var mapOptions = {
                    disableDefaultUI: true
                  }
                  var bounds = new google.maps.LatLngBounds();
                  var map = new google.maps.Map(document.querySelector('#map'), mapOptions);
                  var temp = NeighborhoodViewModel.foundLocations();
                  NeighborhoodViewModel.markerArray([]);


                  var infowindow = new google.maps.InfoWindow();
                  
                  for( i = 0; i < 5; i++ ) {
                    if (i < NeighborhoodViewModel.foundLocations().length){
                    var position = new google.maps.LatLng(NeighborhoodViewModel.foundLocations()[i].latitude, NeighborhoodViewModel.foundLocations()[i].longitude);
                    bounds.extend(position);
                    var marker = new google.maps.Marker({
                      position: position,
                      map: map,
                      title: NeighborhoodViewModel.foundLocations()[i].name
                  });
                  
                google.maps.event.addListener(marker, 'click', (function (marker, i) {
                return function () {
                    infowindow.setContent(NeighborhoodViewModel.foundLocations()[i].infoWindowAddress);
                    infowindow.open(map, marker);
                    map.setZoom(19);
                    map.setCenter(marker.getPosition());
                    

                }
            })(marker, i)); 
                NeighborhoodViewModel.markerArray.push(marker) 
                
                   
                      
  }
                  
                  
                }
                
                
                 map.fitBounds(bounds);
                
                $("ul.pagination3").quickPagination({pagerLocation:"top",pageSize:"15"}); 

});
}

  },


    getNeighborhood : function(){
        if (this.neighborhood() != "") {
          // Adds the item. Writing to the "items" observableArray causes any associated UI to update.
            this.foundLocations.push(new locationNeighbor(this.searchLocation())); 
        }
    },

    callback: function(results, status) {

      var mapOptions = {
          disableDefaultUI: true
      }

      var map = new google.maps.Map(document.querySelector('#map'), mapOptions);
            if (status == google.maps.places.PlacesServiceStatus.OK) {
              NeighborhoodViewModel.createMapMarker(results[0], map);
              
            }
        },


    pinPoster: function(locations){
            var service = new google.maps.places.PlacesService(map);
            var request = {
                query: locations
            };
            service.textSearch(request, this.callback);
        },

    SetAddress: function (formattedAddressLocation){
      NeighborhoodViewModel.formattedAddress(formattedAddressLocation);
    },

    toggleBounce: function(marker,data) {
  if (marker.getAnimation() !== null && marker.getAnimation() !== undefined) {
    marker.setAnimation(null);
    data.currentTarget.style.backgroundColor = 'white';

   
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    data.currentTarget.style.backgroundColor = '#C0C0C0';
  }
},
        

    createMapMarker: function(placeData,map){
            var lat = placeData.geometry.location.lat();
            // latitude from the place service
            var lon = placeData.geometry.location.lng();  // longitude from the place service
            var name = placeData.formatted_address;   // name of the place from the place service
            var bounds = window.mapBounds;
            var marker = new google.maps.Marker({
                map: map,
                position: placeData.geometry.location,
                title: name
            })

            var infoWindow = new google.maps.InfoWindow({
                content: name
            })
            
            bounds.extend(new google.maps.LatLng(lat, lon));
            // fit the map to the new marker
            map.fitBounds(bounds);
            map.setZoom(18);
            // centers the map
            map.setCenter(bounds.getCenter());
        }.bind(this), //end createMapMarker


  
    createMap : function(){

      var near = this.neighborhood();
      var term = this.searchLocation();
      var cool = "";
      if (term ==""){
        var mapOptions = {
          disableDefaultUI: true
        }
        var bounds = new google.maps.LatLngBounds();
        var map = new google.maps.Map(document.querySelector('#map'), mapOptions);

        function callback(results, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
              NeighborhoodViewModel.createMapMarker(results[0], map);
              cool = results[0]['formatted_address'];
              NeighborhoodViewModel.SetAddress(cool);
            }
            else{
              NeighborhoodViewModel.SetAddress("Location Not Found")
            }
            
        };


        function pinPoster(locations){
        // creates a Google place search service object. PlacesService does the work of
        // actually searching for location data.
            var service = new google.maps.places.PlacesService(map);
            if (locations != ""){
          // the search request object
            var request = {
                query: locations
            };
          // Actually searches the Google Maps API for location data and runs the callback
          // function with the search results after each search.
          //service.nearbySearch(request, callback);
            service.textSearch(request, callback);
          }
          else{
            NeighborhoodViewModel.SetAddress("Location Not Found");
          }
        }; //pinPoster

        // locations is an array of location strings returned from locationFinder()
        var locations = this.neighborhood();
        window.mapBounds = new google.maps.LatLngBounds();
        pinPoster(locations) 
    }
    else{
      NeighborhoodViewModel.getResults();
    }
  }// end of create map
  };// end of NeighborhoodViewModel

//activates knockout.js
ko.applyBindings(NeighborhoodViewModel)

// sets initial map load of Milwaukee, WI
NeighborhoodViewModel.neighborhood("Milwaukee,WI")
