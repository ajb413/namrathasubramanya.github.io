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
    subscribeKey: 'Enter your subscribe key here', 
    publishKey: 'Enter your publish key here' 
  });

function success(position) {
  var s = document.querySelector('#status');
  if (s.className == 'success') {
    return;
  }

  s.innerHTML = " ";
  s.className = 'success';
    
  // create map using javascript
  var mapcanvas = document.createElement('div');
  mapcanvas.id = 'mapcanvas';
  mapcanvas.style.height = '400px';
  mapcanvas.style.width = '560px';

  document.querySelector('article').appendChild(mapcanvas);
  
  var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  
  // map 
  var myOptions = {
    zoom: 15,
    center: latlng,
    mapTypeControl: false,
    navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var map = new google.maps.Map(document.getElementById("mapcanvas"), myOptions);
  
  // map marker
  var marker = new google.maps.Marker({
      position: latlng,
      map: map,
      title:""
  });

  // You need to supply the publishKey to clients that will publish (send) data to the application over 
  // the PubNub network.
    
  pubnub.publish(
    {
        message: {
            "latitude": position.coords.latitude,
            "longitude": position.coords.longitude
        },
        channel: 'walkmydog'
    },
    function (status, response) {
        if (status.error) {
            console.log(status)
        } else {
            console.log("message Published w/ timetoken", response.timetoken)
        }
    })
}

var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};  

function error(msg) {
  var s = document.querySelector('#status');
  s.innerHTML = typeof msg == 'string' ? msg : "Loading";
  s.className = 'fail';

}

// Geolocation API

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(success, error, options);
} else {
  error('not supported');
}
