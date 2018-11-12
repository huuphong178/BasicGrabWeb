var axiosInstance = axios.create({
    baseURL: "http://localhost:3000",
    timeout: 10000
});

window.onload = function() {
    initListenEvent();
    setupWS();
};

window.addEventListener("beforeunload", function(e) {
    var msg = {
        closing: {
            id: locateModal.infoCustomer.id
        },
        isEmpty: locateModal.infoCustomer.db !== undefined ? true : false
    };
    // Xử lý trường hợp request trực tiếp khi close client

    ws.send(JSON.stringify(msg));
});

var map;
var marker;
var newRequest = false;
var locator = "ntphi";
var status = 0; // 0: Đang rảnh  -  1: Đang bận

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 16,
        center: { lat: 10.7624176, lng: 106.68119679999995 },
        fullscreenControl: false
    });
    marker = new google.maps.Marker(null);
}

var initListenEvent = () => {
    if (typeof EventSource === "undefined") {
        console.log("not support");
        return;
    }

    var src = new EventSource("http://localhost:3000/requestEvent");

    src.onerror = function(e) {
        console.log("error: " + e);
    };

    // SSE
    // src.addEventListener(
    //     "REQUEST_ADDED",
    //     e => {
    //         $("#new").css("display", "inline");
    //         locateModal.loadModal(e.data);
    //         newRequest = true;
    //     },
    //     false
    // );
};

var locateModal = new Vue({
    el: "#locateModal",
    data: {
        infoCustomer: {}
    },
    methods: {
        loadModal: function(infoCustomer) {
            let self = this;
            self.infoCustomer = JSON.parse(infoCustomer);
        }
    }
});

var historyModal = new Vue({
    el: "#historyModal",
    data: {
        hisList: []
    },
    methods: {
        loadModal: function() {
            let self = this;
            axiosInstance
                .get("/request/history/" + locator)
                .then(function(res) {
                    console.log(res.status);
                    if (res.status == 200) {
                        console.log(res.data);
                        self.hisList = [];
                        res.data.forEach((item, index) => {
                            self.hisList.push(item);
                        });
                    }
                })
                .catch(function(err) {
                    console.log(err);
                })
                .then(function() {});
        },
        viewDetail: function(index) {
            var self = this;
            var item = self.hisList[index];
            $("#historyModal").modal("hide");
            marker.setMap(null);
            addMarker(
                {
                    lat: +item.location_x,
                    lng: +item.location_y
                },
                map
            );
        }
    }
});

function addMarker(location, resultsMap) {
    resultsMap.setCenter({
        lat: location.lat,
        lng: location.lng
    });
    marker = new google.maps.Marker({
        map: resultsMap,
        position: location
    });
}

$("#toggleSideBar").click(() => {
    if ($("#mySidenav").width() !== 250) {
        $("#mySidenav").css("width", "250px");
        $("#map").removeClass("map2");
        $("#map").addClass("map1");
        $(".sidebarTitle").css("display", "inline");
        $(".sidebarA").removeClass("a1");
    } else {
        $("#mySidenav").css("width", "100px");
        $("#mySidenav").addClass("small");
        $("#map").removeClass("map1");
        $("#map").addClass("map2");
        $(".sidebarTitle").css("display", "none");
        $(".sidebarA").addClass("a1");
    }
});

$("#locate").click(() => {
    if (newRequest) {
        $("#locateModal").modal({ backdrop: "static", keyboard: false });
    } else {
        swal("Cảnh báo!", "Chưa có yêu cầu mới", "error");
    }
});

$("#history").click(() => {
    historyModal.loadModal();
    $("#historyModal").modal({ backdrop: "static", keyboard: false });
});

$("#real-locate").click(() => {
    let address = locateModal.infoCustomer.address;
    let request = locateModal.infoCustomer;
    newRequest = false;
    $("#new").css("display", "none");

    //axiosInstance.get('/getRequestRealtime?timestamp=' + self.timestamp)
    axiosInstance
        .get("/map/geocoding?address=" + address)
        .then(function(res) {
            // Lấy trường bên server (sendToLocator) để kiểm tra gửi trực tiếp hay từ db
            console.log(res.status);
            if (res.status == 200) {
                marker.setMap(null);
                addMarker(res.data, map);
                locateModal.infoCustomer = {};

                // update request location
                request.location_x = res.data.lat;
                request.location_y = res.data.lng;
                request.status = 1;
                request.locator = "ntphi";
                var dbRequest = request.db
                    ? { id: request.id, check: true }
                    : {};
                axiosInstance
                    .put("/request", request)
                    .then(function(res) {
                        console.log(res);
                        var msg = {
                            doneProcess: {
                                id: locator,
                                status: 0,
                                // Nếu gửi trực tiếp thì thêm 1 trường qua server kiển tra coi xóa hay không xóa DB
                                db: dbRequest
                            }
                        };
                        var mess = JSON.stringify(msg);
                        ws.send(mess);
                    })
                    .catch(function(err) {
                        console.log(err);
                    });
            }
        })
        .catch(function(err) {
            console.log(err);
        })
        .then(function() {});
});

// WS
var ws;

var setupWS = function() {
    window.WebSocket = window.WebSocket || window.MozWebSocket;
    ws = new WebSocket("ws://localhost:40510");

    ws.onopen = function() {
        console.log("connected");
        var msg = {
            init: {
                id: locator,
                status: status
            }
        };
        ws.send(JSON.stringify(msg));
    };

    ws.onmessage = function(e) {
        $("#new").css("display", "inline");
        locateModal.loadModal(e.data);
        newRequest = true;
    };
};
