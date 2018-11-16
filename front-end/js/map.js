var labelIndex = 0;
var image = "./image/marker.png";
var markermain;
var infowindow;
//set ID mat dinh
var id_driver = 1540695005611;
var checkHaversine = true;

function initMap() {
    khtn = {
        lat: 10.7624176,
        lng: 106.68119679999995
    };
    var map = new google.maps.Map(document.getElementById("map"), {
        zoom: 16,
        center: khtn,
        fullscreenControl: false
    });
    markermain = new google.maps.Marker({
        position: khtn,
        draggable: true,
        animation: google.maps.Animation.DROP,
        map: map,
        icon: image
    });
    infowindow = new google.maps.InfoWindow({
        content: "Bạn đang ở đây !"
    });
    // This event listener calls addMarker() when the map is clicked.
    google.maps.event.addListener(map, 'click', function (event) {
        addMarker({
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
        }, map);

    });
    // google.maps.event.addListener(markermain, 'dragend', function () {
    //     // addMarker({
    //     //     lat: this.getPosition().lat(),
    //     //     lng: this.getPosition().lng()
    //     // }, map);
    //     console.log(this.getPosition());
    //     alert('dung');

    // });
    
    // Add a marker at the center of the map.
    addMarker(khtn, map);
}

// Adds a marker to the map.
function addMarker(location, map) {
    console.log(location);
    updateLocation(id_driver, location).then(value=>{
        if(value===true){
            deleteMarkers();
                // Add the marker at the clicked location, and add the next-available label
                // from the array of alphabetical characters.
                markermain = new google.maps.Marker({
                    position: location,
                    //label: labels[labelIndex++ % labels.length],
                    draggable: true,
                    animation: google.maps.Animation.DROP,
                    map: map,
                    icon: image
                });
                infowindow.open(map, markermain);
        }else {
            alert('Vị trí chọn lớn hơn 100m');
        }
    })
    markermain.addListener('click', toggleBounce);
    markermain.addListener('drag', toggleBounce);
    markermain.addListener('dragend', toggleBounce);
}

function toggleBounce() {
    infowindow.open(map, markermain);
    if (markermain.getAnimation() !== null) {
        markermain.setAnimation(null);
    } else {
        markermain.setAnimation(google.maps.Animation.BOUNCE);
    }
}
// Sets the map on all markers in the array.

// Deletes all markers in the array by removing references to them.
function deleteMarkers(){
    if (markermain != null) 
        markermain.setMap(null);
    markermain = null;
}
//call api updateLocation
var updateLocation = function (id, location) {
    return new Promise((resolve, reject)=>{
        var data = {
            id: id,
            location_X: location.lat,
            location_Y: location.lng
        }
        var instance = axios.create({
            baseURL: 'http://localhost:3000/driver',
            timeout: 3000
        });
    
        instance.put('/location', data)
            .then(function (res) {
                if (res.status === 200) {
                    // alert("success");
                    return true;
                }
                if (res.status === 204) {
                    return false;
                }
            })
            .then(value => resolve(value))
            .catch(err=> 
               reject(err))
    })
}


window.onload = function() {
    setupWS();
};

// WS
var ws;

var setupWS = function() {
    window.WebSocket = window.WebSocket || window.MozWebSocket;
    ws = new WebSocket("ws://localhost:40511");

    ws.onopen = function() {
        console.log("connected");
        var msg = {
            init: {
                id: id_driver
            }
        };
        ws.send(JSON.stringify(msg));
    };

    ws.onmessage = function(e) {
        
    };
};
// Done WS