
var pubnub = new PubNub({
  subscribeKey: 'sub-c-0cd4f18e-11d5-11e8-b32f-5ea260837941', 
  publishKey: 'pub-c-146542ff-637d-43fa-a28a-cad0dbaf697e' 
});

function initMap() {
  var latValue, longValue;

  pubnub.addListener({
    message: function(message){
      latValue = message.message.latitude;
      longValue = message.message.longitude;
        console.log(message.message.latitude);
         console.log(message.message.longitude);
        var map = new google.maps.Map(document.getElementById('map'), {
           zoom: 15,
           center: {lat: latValue, lng: longValue}
        });
        var geocoder = new google.maps.Geocoder;
        var infowindow = new google.maps.InfoWindow;
        function geocodeLatLng(geocoder, map, infowindow, latValue, longValue) {
          var latlng = {lat: latValue, lng: longValue};
          console.log('latValue'+latValue);
          geocoder.geocode({'location': latlng}, function(results, status) {
            if (status === 'OK') {
              if (results[0]) {
                map.setZoom(15);
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

  console.log("latitude value", latValue);
  console.log("longitude value", longValue);
  geocodeLatLng(geocoder, map, infowindow, latValue, longValue);

      }
    });

    pubnub.subscribe({
        channels: ['walkmydog']
    });
}