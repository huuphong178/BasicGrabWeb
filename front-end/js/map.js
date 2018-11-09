var labelIndex = 0;
var image = "./image/marker.png";
var markermain;
//set ID mat dinh
var id_driver = 1540709441669;
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
    var infowindow = new google.maps.InfoWindow({
        content: "Bạn đang ở đây !"
    });
    // This event listener calls addMarker() when the map is clicked.
    google.maps.event.addListener(map, 'click', function (event) {
        addMarker({
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
        }, map, infowindow);

    });
    // Add a marker at the center of the map.
    addMarker(khtn, map, infowindow);
}

// Adds a marker to the map.
function addMarker(location, map, infowindow) {
    console.log(location);
        updateLocation(id_driver, location);
     //delete marker old
     deleteMarkers();
    if (checkHaversine) {
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
        markermain.addListener('click', toggleBounce);
    }

}

function toggleBounce() {
    if (markermain.getAnimation() !== null) {
        markermain.setAnimation(null);
    } else {
        markermain.setAnimation(google.maps.Animation.BOUNCE);
    }
}
// Sets the map on all markers in the array.

// Deletes all markers in the array by removing references to them.
function deleteMarkers()
    if (markermain != null) {
        markermain.setMap(null);
    markermain = null;
}
//call api updateLocation
var updateLocation = function (id, location) {
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
                checkHaversine = true;
            }
            if (res.status === 204) {
                checkHaversine = false;
                alert('fail');
            }
        }).catch(function (err) {
            console.log(err);
        })
}