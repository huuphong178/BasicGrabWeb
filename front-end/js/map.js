var labelIndex = 0;
var image = "./image/marker.png";
var markermain;
var infowindow;
//set ID mat dinh
var id_driver = 1540695005611;
var checkHaversine = true;
var map = null;
var directionsDisplay = null;


function initMap() {
    khtn = {
        lat: 10.7624176,
        lng: 106.68119679999995
    };
    map = new google.maps.Map(document.getElementById("map"), {
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
    updateLocation(id_driver, location).then(value => {
        if (value === true) {
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
        } else {
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
function deleteMarkers() {
    if (markermain != null)
        markermain.setMap(null);
    markermain = null;
}
//call api updateLocation
var updateLocation = function (id, location) {
    return new Promise((resolve, reject) => {
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
            .catch(err =>
                reject(err))
    })
}



var status = 1;
// WS
var ws;

var setupWS = function () {
    window.WebSocket = window.WebSocket || window.MozWebSocket;
    ws = new WebSocket("ws://localhost:40511");

    ws.onopen = function () {
        console.log("connected");
        var msg = {
            init: {
                id: id_driver,
                status: status,
                deny: []
            }
        };
        ws.send(JSON.stringify(msg));
    };

    ws.onmessage = function (e) {
        console.log(e);
        modalRequest.loadModal(e.data);

    };

    ws.onclose = function (e) {
        console.log('WS closed');
    }
};
// Done WS

var actionTrip = new Vue({
    el: "#actionTrip",
    data: {
        visable: false,
        disabled: false
    },
    methods: {
        finishTrip: function () {
            let self = this;
            var msg = {
                finishMsg: modalRequest.infoCustomer 
            }
            console.log(msg);
            var message = JSON.stringify(msg);
            ws.send(message);
            self.visable = false;
 		self.disabled = false;
 		directionsDisplay.setMap(null);

        },
        startTrip: function () {
            let self = this;
            self.disabled = true;
        }
    }

})
var modalRequest = new Vue({
    el: "#mymodalRequest",
    data: {
        infoCustomer: {}
    },
    methods: {
        loadModal: function (infoCustomer) {
            let self = this;
            self.infoCustomer = JSON.parse(infoCustomer);
            $('#mymodalRequest').modal("show");
        },
        denyModal: function () {
            let self = this;
            var msg = {
                denyMsg: self.infoCustomer
            }
            console.log(msg);
            var message = JSON.stringify(msg);
            ws.send(message);
        },
        accessModal: function () {
            let self = this;

            var axiosInstance = axios.create({
				baseURL: 'http://localhost:3000/driver',
				timeout: 15000
			});
			
			axiosInstance.get('/' + id_driver)
				.then((res) => {
					console.log(res);
					var currentDriverInfo = res.data;
                    var A = {lat: +currentDriverInfo.location_X, lng: +currentDriverInfo.location_Y};
                    var B = {lat: +self.infoCustomer.location_x, lng: +self.infoCustomer.location_y};
                    
                    self.direction(A, B);
				}).catch((err) => {
					console.log(err);
				}).then(() => {

				});



            // console.log(msg);
            // var message=JSON.stringify(msg);
            // ws.send(message);
            // $('#mymodalRequest').modal("hide");
            // actionTrip.visable=true;
        },
        direction: function(A, B){
            let self = this;
            //var markerOption = new google.maps.Marker({icon: image});
			directionsDisplay = new google.maps.DirectionsRenderer({preserveViewport: true});
            var directionsSvc = new google.maps.DirectionsService();
            var center = {lat: (A.lat + B.lat)/2, lng: (A.lng + B.lng)/2};
            map.setCenter(center);
            directionsDisplay.setMap(map);

            var directionsRequest = {
				origin: A,
				destination: B,
				travelMode: google.maps.DirectionsTravelMode.DRIVING
            };

            console.log(directionsRequest);

            directionsSvc.route(directionsRequest, function(result, status){
				if (status == google.maps.DirectionsStatus.OK){
					directionsDisplay.setDirections(result);
                    map.setZoom(14);
                    
                    google.maps.event.addListener(directionsDisplay, 'click', function (event) {
                        addMarker({
                            lat: event.latLng.lat(),
                            lng: event.latLng.lng()
                        }, directionsDisplay);
                
                    });

                    //Show <Bat dau> <Ket thuc>
 var msg={

                        accessMsg: self.infoCustomer
                    }

                    console.log(msg);
 var message=JSON.stringify(msg);
                    ws.send(message);
                    $('#mymodalRequest').modal("hide");
 actionTrip.visable=true;
                }
				else
					alert(status);
			});
        }

    }
});
var switchStatus = function (checkbox) {
    if (checkbox.checked) {
        $.notify(
            "On", "success",
        );
        updateStatus(id_driver, 1);
        setupWS();
    } else {
        $.notify(
            "Off", "error",
        );
        directionsDisplay.setMap(null);
        updateStatus(id_driver, 2);
        ws.close();
    }
}

//call Api updateStatus
var updateStatus = function (id, status) {
    var data = {
        id: id,
        status: status,
    }
    var instance = axios.create({
        baseURL: 'http://localhost:3000/driver',
        timeout: 3000
    });

    instance.put('/status', data)
        .then(function (res) {
            if (res.status === 200) {}
        }).catch(function (err) {
            console.log(err);
        })
}
var deleteBlackList = function () {
    var instance = axios.create({
        baseURL: 'http://localhost:3000/driver',
        timeout: 3000
    });
    const data = {
        id: id_driver
    }
    console.log(data);
    instance.delete('/blacklist', {
            data: data
        })
        .then(function (res) {
            if (res.status === 200) {
                alert("success");
                return true;
            }

        })
        .catch(err =>
            reject(err))

}
window.addEventListener("beforeunload", function (event) {
    event.returnValue = "Write something clever here..";
});
window.addEventListener("unload", function (event) {
    deleteBlackList()
});