var labelIndex = 0;
var image = "./image/marker.png";
var markermain;
var infowindow;
var checkHaversine = true;
var map = null;
var directionsDisplay = null;
const TIME_REQUEST = 10;
var second = TIME_REQUEST;
var timer;
var fn = function () {
    time.second.value = second--;
    if (second == -1) {
        time.second.value = 0;
        modalRequest.denyModal();
        $('#mymodalRequest').modal("hide");
        clearInterval(timer);

    }
}
var start = function () {
    time.second.value = TIME_REQUEST;
    second = TIME_REQUEST
    timer = setInterval(fn, 1000);
}
var stop = function () {
    clearInterval(timer);
}
var keyAccessToken = "accessToken";
var keyRefreshToken = "refreshToken";

var axiosInstance = axios.create({
    baseURL: "http://localhost:3000",
    timeout: 10000,
});

function initMap() {
    khtn = {
        lat: 10.7624176,
        lng: 106.68119679999995
    };
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 16,
        center: khtn,
    });
    markermain = new google.maps.Marker({
        // position: khtn,
        // draggable: true,
        // animation: google.maps.Animation.DROP,
        // map: map,
        // icon: image
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
    getMarkerFirst(map,map);
    // Add a marker at the center of the map.
    // addMarker(khtn, map);
    //dragen event of marker
}

let getMarkerFirst=function(arg1,arg2){
    axiosInstance.get('/driver/' + id_driver, {
            headers: {
                "x-access-token": localStorage.getItem(keyAccessToken)
            }
        })
        .then((res) => {
            console.log(res);
            var currentDriverInfo = res.data;
            var location = {
                lat: +currentDriverInfo.location_X,
                lng: +currentDriverInfo.location_Y
            };
            markermain = new google.maps.Marker({
                position: location,
                draggable: false,
                animation: google.maps.Animation.DROP,
                map: arg1,
                icon: image
            });
            infowindow.open(map, markermain);
        }).catch((err) => {
            //console.log(err.response);
            console.log('het han');
            refreshToken(err,arg1,arg2,getMarkerFirst);
        })
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
                draggable: false,
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
let updateLocation = function (id, location) {
    return new Promise((resolve, reject) => {
        var data = {
            id: id,
            location_X: location.lat,
            location_Y: location.lng,
        }

        axiosInstance.put('/driver/location', data, {
                headers: {
                    "x-access-token": localStorage.getItem(keyAccessToken)
                }
            })
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
            .catch(err => {
                console.log('het han');
                refreshToken(err,id, location, updateLocation);
            })
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
        start();
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
            self.visable = false;
            self.disabled = false;
            directionsDisplay.setMap(null);
            //Cap nhat trang thai request da co xe nhan
            modalRequest.infoCustomer.status = 4;
            updateStatusRequest(modalRequest.infoCustomer,true);
            //Cap nhat trang thai ready
            updateStatus(id_driver, 1)

        },
        startTrip: function () {
            let self = this;
            self.disabled = true;
            //Cap nhat trang thai request da co xe nhan
            modalRequest.infoCustomer.status = 3;
            updateStatusRequest(modalRequest.infoCustomer,true);
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
            stop();
            let self = this;
            var blacklistEntity = {
                id_driver: id_driver,
                id_request: self.infoCustomer.id
            }
            axiosInstance.post('/driver/blacklist', blacklistEntity, {
                    headers: {
                        "x-access-token": localStorage.getItem(keyAccessToken)
                    }
                })
                .then(function (res) {
                    if (res.status === 200) {
                        var msg = {
                            msgResend: self.infoCustomer
                        };
                        ws.send(JSON.stringify(msg));
                    }
                })
                .catch(err =>{
                    console.log('het han');
            refreshToken(err,true,true,denyModal);
                })

        },
        accessModal: function () {
            stop();
            let self = this;
            axiosInstance.get('/driver' + id_driver, {
                    headers: {
                        "x-access-token": localStorage.getItem(keyAccessToken)
                    }
                })
                .then((res) => {
                    console.log(res);
                    var currentDriverInfo = res.data;
                    var A = {
                        lat: +currentDriverInfo.location_X,
                        lng: +currentDriverInfo.location_Y
                    };
                    var B = {
                        lat: +self.infoCustomer.location_x,
                        lng: +self.infoCustomer.location_y
                    };

                    self.direction(A, B);
                }).catch((err) => {
                    console.log('het han');
            refreshToken(err,true,true,accessModal);
                }).then(() => {});
            //Cap nhat status cua request va driver
            self.infoCustomer.status = 2;
            updateStatusRequest(self.infoCustomer,true);
            updateStatus(id_driver, 3)
        },
        direction: function (A, B) {
            let self = this;
            //var markerOption = new google.maps.Marker({icon: image});
            directionsDisplay = new google.maps.DirectionsRenderer({
                preserveViewport: true
            });
            var directionsSvc = new google.maps.DirectionsService();
            var center = {
                lat: (A.lat + B.lat) / 2,
                lng: (A.lng + B.lng) / 2
            };
            map.setCenter(center);
            directionsDisplay.setMap(map);

            var directionsRequest = {
                origin: A,
                destination: B,
                travelMode: google.maps.DirectionsTravelMode.DRIVING
            };

            console.log(directionsRequest);
            directionsSvc.route(directionsRequest, function (result, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(result);
                    map.setZoom(14);

                    google.maps.event.addListener(directionsDisplay, 'click', function (event) {
                        addMarker({
                            lat: event.latLng.lat(),
                            lng: event.latLng.lng()
                        }, directionsDisplay);

                    });
                    //Show <Bat dau> <Ket thuc>
                    var msg = {
                        accessMsg: self.infoCustomer
                    }
                    console.log(msg);
                    var message = JSON.stringify(msg);
                    ws.send(message);
                    $('#mymodalRequest').modal("hide");
                    actionTrip.visable = true;
                } else
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
        if (directionsDisplay) {
            directionsDisplay.setMap(null);
        }
        updateStatus(id_driver, 2);
        ws.close();
        //  map.setClickableIcons(false);
        // map.clickableIcons=false;
    }
}

//call Api updateStatusDriver
var updateStatus = function (id, status) {
    var data = {
        id: id,
        status: status,
    }

    axiosInstance.put('/driver/status', data, {
            headers: {
                "x-access-token": localStorage.getItem(keyAccessToken)
            }
        })
        .then(function (res) {
            if (res.status === 200) {}
        }).catch(function (err) {
            console.log('het han');
            refreshToken(err,id,status,updateStatus);
        })
}
//call Api updateStatusRequest
var updateStatusRequest = function (requestEntity,requestEntity) {
    axiosInstance.put('/request', requestEntity)
        .then(function (res) {
            if (res.status === 200) {}
        }).catch(function (err) {
            console.log('het han');
            refreshToken(err,requestEntity,requestEntity,updateStatusRequest);
        })
}
var deleteBlackList = function () {
    const data = {
        id: id_driver
    }
    console.log(data);
    axiosInstance.delete('driver/blacklist', {
            data: data
        }, {
            headers: {
                "x-access-token": localStorage.getItem(keyAccessToken)
            }
        })
        .then(function (res) {
            if (res.status === 200) {
                alert("success");
                return true;
            }

        })
        .catch(err => {
            console.log('het han');
            refreshToken(err,true,true,deleteBlackList);
        }
            )

}

window.addEventListener("beforeunload", function (event) {
    event.returnValue = "Write something clever here..";
});
window.addEventListener("unload", function (event) {
    deleteBlackList()
});

//call refreshtoken
function refreshToken(err,arg1, arg2,callback) {
    if (err.response.data.msg === "INVALID_TOKEN") {
        let user = JSON.parse(localStorage.getItem("user"));
        let rfTokenData = {
            user: user,
            rfToken: localStorage.getItem(keyRefreshToken)
        };
        axiosInstance
            .post("/account/token/refresh", rfTokenData)
            .then(function (res) {
                localStorage.setItem(keyAccessToken, res.data.accToken);
                return callback(arg1,arg2);
            })
            .catch(function (err) {
                console.log(err);
            });
    } else if (err.response.data.msg === "NO_TOKEN") {
        alert(err.response.data.msg);
    }
}