$("#username").text(JSON.parse(localStorage.getItem("user")).name);
window.onload = function() {
    console.log("NL");
    app.setupSSE();
    app.loadRequest();
};

var navheader = new Vue({
    el: "#nav",
    data: {
        isLogined: true
    }
});
var keyAccessToken = "accessToken";
var keyRefreshToken = "refreshToken";
var axiosInstance = axios.create({
    baseURL: "http://localhost:3000",
    timeout: 15000
});

var arrStatus = ["Chưa định vị", "Đã định vị", "Có xe nhận", "Đang di chuyển",
                 "Đã hoàn thành", "Không định vị", "Không có xe nhận"];

var app = new Vue({
    el: "#app",
    data: {
        list: [],
        timestamp: 0
    },
    methods: {
        viewDetail: function(index) {
            var self = this;
            var item = self.list[index];
            var str =
                item.id +
                " - " +
                item.name +
                " - " +
                item.phone +
                " - " +
                item.location +
                " - " +
                item.status +
                " - " +
                item.note +
                " - " +
                item.driver;
            // alert(str);
            if (item.status === 0 || item.status === 1 || item.status === 5 || item.status === 6) {
                swal("Cảnh báo!", "Yêu cầu chưa được xác nhận", "error");
            } else {
                $("#myModal").modal("show");
                myModal.loadModal(item.id);
            }
        },
        loadRequest: function() {
            var self = this;
            console.log("run func ");

            axiosInstance
                .get("/request", {
                    headers: {
                        "x-access-token": localStorage.getItem(keyAccessToken)
                    }
                })
                .then(function(res) {
                    console.log(res.status);
                    if (res.status == 200) {
                        //self.timestamp = res.data.timestamp;
                        res.data.forEach((item, index) => {
                            var tempt = {
                                id: item.id,
                                name: item.name,
                                phone: item.phone,
                                address: item.address,
                                status: item.status,
                                note: item.note,
                                driver_id: item.driver_id,
                                status_display: arrStatus[item.status]
                            };
                            self.list.push(tempt);
                        });
                    }
                })
                .catch(function(err) {
                    refreshToken(err, app.loadRequest);
                })
                .then(function() {
                    //console.log(self.timestamp);
                    //self.loadRequest();
                });
        },
        setupSSE: function() {
            var self = this;
            if (typeof EventSource === "undefined") {
                console.log("not support");
                return;
            }

            var src = new EventSource("http://localhost:3000/requestEvent");

            src.onerror = function(e) {
                console.log("error: " + e);
            };

            src.addEventListener(
                "REQUEST_ADDED",
                e => {
                    var data = JSON.parse(e.data);
                    data.status_display = arrStatus[data.status];
                    self.list.push(data);
                },
                false
            );

            src.addEventListener(
                "REQUEST_MODIFIED",
                e => {
                    var data = JSON.parse(e.data);
                    data.status_display = arrStatus[data.status];
                    var id = data.id;
                    self.list.forEach((c, i) => {
                        if (c.id == id) {
                            self.list.splice(i, 1, data);
                            return;
                        }
                    });
                },
                false
            );
        }
    },
    computed: {
        sortedArray: function() {
            function compare(a, b) {
                if (a.id < b.id) return 1;
                if (a.id > b.id) return -1;
                return 0;
            }
            return this.list.sort(compare);
        }
    }
});

var myModal = new Vue({
    el: "#myModal",
    data: {
        value: "Đây là tiêu đề",
        map: null,
        directionsDisplay: null
    },
    methods: {
        loadModal: function(id) {
            var self = this;

            axiosInstance
                .get("/request/minway/" + id, {
                    headers: {
                        "x-access-token": localStorage.getItem(keyAccessToken)
                    }
                })
                .then(res => {
                    console.log(res);
                    self.value = res.data;
                    //initMap();
                    var A = {
                        lat: +res.data.driver_loX,
                        lng: +res.data.driver_loY
                    };
                    var B = {
                        lat: +res.data.request_loX,
                        lng: +res.data.request_loY
                    };
                    self.direction(A, B);
                })
                .catch(err => {
                    refreshToken(err, myModal.loadModal, id);
                })
                .then(() => {});
        },
        direction: function(A, B) {
            var self = this;
            self.directionsDisplay = new google.maps.DirectionsRenderer({
                preserveViewport: true
            });
            var directionsSvc = new google.maps.DirectionsService();
            var center = { lat: (A.lat + B.lat) / 2, lng: (A.lng + B.lng) / 2 };
            self.map.setCenter(center);
            self.directionsDisplay.setMap(self.map);
            var directionsRequest = {
                origin: A,
                destination: B,
                travelMode: google.maps.DirectionsTravelMode.DRIVING
            };

            directionsSvc.route(directionsRequest, function(result, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    self.directionsDisplay.setDirections(result);
                    self.map.setZoom(13);
                } else alert(status);
            });
        }
    }
});

function initMap() {
    myModal.map = new google.maps.Map(document.getElementById("map"), {
        zoom: 13,
        //center: { lat: 10.7624176, lng: 106.68119679999995 },
        fullscreenControl: false
    });
}

$("#myModal").on("hidden.bs.modal", function() {
    myModal.directionsDisplay.setMap(null);
});

$("#logout").click(() => {
    localStorage.clear();
    window.location.href = window.location.origin + "/login";
});

function refreshToken(err, callback, arg1) {
    if (err.response.data.msg === "INVALID_TOKEN") {
        let user = JSON.parse(localStorage.getItem("user"));
        let rfTokenData = {
            user: user,
            rfToken: localStorage.getItem(keyRefreshToken)
        };
        axiosInstance
            .post("/account/token/refresh", rfTokenData)
            .then(function(res) {
                localStorage.setItem(keyAccessToken, res.data.accToken);
                return callback(arg1);
            })
            .catch(function(err) {
                //  console.log(err);
            });
    } else if (err.response.data.msg === "NO_TOKEN") {
        alert(err.response.data.msg);
    }
}
