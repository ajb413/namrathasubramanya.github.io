// PubNub utilizes a Publish/Subscribe model for real-time data streaming and device signaling which
// lets you establish and maintain persistent socket connections to any device and push data to global 
// audiences in less than ¼ of a second. You can publish messages to any given channel, and subscribing 
// clients receive only messages associated with that channel. The message payload can be any JSON data 
// including numbers, strings, arrays, and objects.

// You will need at the minimum a subscribeKey and publishKey. If a client will only subscribe, and not publish, 
// then the client only need to initialize with the subscribeKey. For clients who will be publishing only, or 
// publishing and subscribing (a client can both publish and subscribe), it will need to initialize with both 
// the subscribeKey and the publishKey.

var pubnub = new PubNub({
  subscribeKey: 'sub-c-0cd4f18e-11d5-11e8-b32f-5ea260837941', // Enter your subscribe key here
  publishKey: 'pub-c-146542ff-637d-43fa-a28a-cad0dbaf697e' // Enter your publish key here
});

function initMap() {
  var latValue, longValue;

  pubnub.addListener({
    message: function(message){
      latValue = message.message.latitude;
      longValue = message.message.longitude;
       
      // initialise map
        var map = new google.maps.Map(document.getElementById('map'), {
           zoom: 15,
           center: {lat: latValue, lng: longValue}
        });
        var geocoder = new google.maps.Geocoder;
        var infowindow = new google.maps.InfoWindow;
      
        function geocodeLatLng(geocoder, map, infowindow, latValue, longValue) {
          var latlng = {lat: latValue, lng: longValue};
          
          geocoder.geocode({'location': latlng}, function(results, status) {
            if (status === 'OK') {
              if (results[0]) {
                map.setZoom(15);
                
                // map marker
                var marker = new google.maps.Marker({
                  position: latlng,
                  map: map
                });
                infowindow.setContent(results[0].formatted_address);
                infowindow.open(map, marker);
              } else {
                window.alert('No results found');
              }
            } else {
              window.alert('Geocoder failed due to: ' + status);
            }
          });
        }

  geocodeLatLng(geocoder, map, infowindow, latValue, longValue);

      }
    });

    // subscribe to the channel that is published through PubNub publish()
  
    pubnub.subscribe({
        channels: ['walkmydog']
    });
}
