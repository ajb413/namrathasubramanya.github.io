var pubnub = new PubNub({
    subscribeKey: 'sub-c-0cd4f18e-11d5-11e8-b32f-5ea260837941', 
    publishKey: 'pub-c-146542ff-637d-43fa-a28a-cad0dbaf697e' 
  });
function success(position) {
  var s = document.querySelector('#status');

  if (s.className == 'success') {
    
    return;
  }

  s.innerHTML = " ";
  s.className = 'success';

  var mapcanvas = document.createElement('div');
  mapcanvas.id = 'mapcanvas';
  mapcanvas.style.height = '400px';
  mapcanvas.style.width = '560px';

  document.querySelector('article').appendChild(mapcanvas);

  var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  console.log(position.coords.latitude);
  var myOptions = {
    zoom: 15,
    center: latlng,
    mapTypeControl: false,
    navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var map = new google.maps.Map(document.getElementById("mapcanvas"), myOptions);

  var marker = new google.maps.Marker({
      position: latlng,
      map: map,
      title:""
  });

  
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

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(success, error, options);
} else {
  error('not supported');
}