const RequestQueueStatus = {
    CHUA_XU_LY: 0,
    DANG_XU_LY: 1
};

const RequestStatus = {
    CHUA_DINH_VI: 0,
    DA_DINH_VI: 1,
    CO_XE_NHAN: 2,
    DANG_DI_CHUYEN: 3,
    DA_HOAN_THANH: 4,
    KHONG_THE_DINH_VI: 5
};

const LocatorStatus = {
    RANH: 0,
    BAN: 1
};

const INVALID_ADDRESS_BY_SYSTEM =
    "Địa chỉ không hợp lệ - Hệ thống không thể định vị";
const INVALID_ADDRESS_BY_USER = "Địa chỉ không hợp lệ - Nhân viên hủy yêu cầu";

var axiosInstance = axios.create({
    baseURL: "http://localhost:3000",
    timeout: 10000
});

// window
window.onload = function() {
    // initListenEvent();
    setupWS();
};

window.addEventListener("beforeunload", function(e) {
    var msg = {
        closing: locateModal.infoCustomer.id !== undefined ? true : false,
        type: locateModal.infoCustomer.db !== undefined ? "db" : "live",
        data: locateModal.infoCustomer
    };

    ws.send(JSON.stringify(msg));
});
// Done window

// map
var map;
var marker;
var newRequest = "free";
var locator = "ntphi" + new Date().getTime();
var clickOnMap = false;

var infowindow;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: { lat: 10.7624176, lng: 106.68119679999995 },
        fullscreenControl: false
    });
    marker = new google.maps.Marker(null);
}

function addMarker(location, resultsMap, request, type) {
    resultsMap.setCenter({
        lat: location.lat,
        lng: location.lng
    });

    marker.setMap(null);
    marker = new google.maps.Marker({
        map: resultsMap,
        position: location,
        draggable: true,
        animation: google.maps.Animation.DROP
    });

    infoWindowContent = `<h3>Thông tin </h3>
		<b>Họ tên: </b>${request.name}<br>
		<b>Số điện thoại: </b>${request.phone}<br>
		<b>Địa chỉ: </b>${request.address}<br>`;
    if (type === "history") {
        marker.setDraggable(false);
    } else if (type === "new" || type === "waiting") {
        google.maps.event.addListener(marker, "dragend", function() {
            locateModal.infoCustomer.location_x = this.getPosition().lat();
            locateModal.infoCustomer.location_y = this.getPosition().lng();
        });

        infoWindowContent += `<div id="doneProcess"><br><b>Kéo thả marker để thay đổi vị trí</b> <br>
			<button class="btn btn-basic" onClick="destroyRequest()">Hủy yêu cầu</button>
			<button class="btn btn-success" onClick="doneProcess()">Xác nhận</button></div>`;
    }
    infowindow = new google.maps.InfoWindow({
        content: infoWindowContent
    });

    infowindow.open(resultsMap, marker);
    marker.addListener("click", () => {
        map.setZoom(15);
        map.setCenter(marker.getPosition());
        infowindow.open(resultsMap, marker);
    });
}
// Done map

// Vue
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

var relocateModal = new Vue({
    el: "#re-locateModal",
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
                    if (res.status == 200) {
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
            // marker.setMap(null);
            addMarker(
                {
                    lat: +item.location_x,
                    lng: +item.location_y
                },
                map,
                item,
                "history"
            );
        }
    }
});
// Done Vue

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
                status: LocatorStatus.RANH
            }
        };
        ws.send(JSON.stringify(msg));
    };

    ws.onmessage = function(e) {
        $("#free").css("display", "none");
        $("#new").css("display", "inline");
        locateModal.loadModal(e.data);
        relocateModal.loadModal(e.data);
        newRequest = "new";
    };
};
// Done WS

// button click
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
    if (newRequest === "new") {
        $("#locateModal").modal({ backdrop: "static", keyboard: false });
    } else if (newRequest === "free") {
        swal("Cảnh báo!", "Chưa có yêu cầu mới", "error");
    } else {
        addMarker(
            {
                lat: +locateModal.infoCustomer.location_x,
                lng: +locateModal.infoCustomer.location_y
            },
            map,
            locateModal.infoCustomer,
            "waiting"
        );
    }
});

$("#history").click(() => {
    historyModal.loadModal();
    $("#historyModal").modal({ backdrop: "static", keyboard: false });
});

$("#real-locate").click(() => {
    $("#new").css("display", "none");
    $("#waiting").css("display", "inline");
    newRequest = "waiting";
    axiosInstance
        .get("/map/geocoding?address=" + locateModal.infoCustomer.address)
        .then(function(res) {
            // Lấy trường bên server (sendToLocator) để kiểm tra gửi trực tiếp hay từ db
            if (res.status == 200) {
                marker.setMap(null);
                addMarker(res.data, map, locateModal.infoCustomer, "new");
                locateModal.infoCustomer.location_x = res.data.lat;
                locateModal.infoCustomer.location_y = res.data.lng;
            }
        })
        .catch(function(err) {
            $("#re-locateModal").modal({ backdrop: "static", keyboard: false });
        })
        .then(function() {});
});

$("#re-locate").click(() => {
    clickOnMap = true;
    google.maps.event.addListener(map, "click", function(event) {
        if (clickOnMap) {
            locateModal.infoCustomer.location_x = event.latLng.lat();
            locateModal.infoCustomer.location_y = event.latLng.lng();
            addMarker(event.latLng, map, locateModal.infoCustomer, "waiting");
        }
    });
});

$("#destroy-request").click(() => {
    destroyRequest("system");
});
// Done button click

// function
function doneProcess() {
    // update request location
    let request = locateModal.infoCustomer;
    request.status = RequestStatus.DA_DINH_VI;
    request.locator = locator;
    doneProcess_SendToServer(request);
}

function doneProcess_SendToServer(request) {
    clickOnMap = false;
    var dbRequest = request.db ? { id: request.id, check: true } : {};
    axiosInstance
        .put("/request", request)
        .then(function(res) {
            marker.setDraggable(false);
            $("#doneProcess").css("display", "none");
            $("#waiting").css("display", "none");
            $("#free").css("display", "inline");
            newRequest = "free";
            locateModal.infoCustomer = {};
            var msg = {
                doneProcess: {
                    id: locator,
                    status: LocatorStatus.RANH,
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

function destroyRequest(type) {
    let request = locateModal.infoCustomer;
    request.status = RequestStatus.KHONG_THE_DINH_VI;
    request.locator = locator;
    request.location_x = null;
    request.location_y = null;
    request.note =
        type === "system" ? INVALID_ADDRESS_BY_SYSTEM : INVALID_ADDRESS_BY_USER;
    doneProcess_SendToServer(request);
}
// Done function

// var initListenEvent = () => {
//     if (typeof EventSource === "undefined") {
//         console.log("not support");
//         return;
//     }

//     var src = new EventSource("http://localhost:3000/requestEvent");

//     src.onerror = function(e) {
//         console.log("error: " + e);
//     };

//     // SSE
//     // src.addEventListener(
//     //     "REQUEST_ADDED",
//     //     e => {
//     //         $("#new").css("display", "inline");
//     //         locateModal.loadModal(e.data);
//     //         newRequest = true;
//     //     },
//     //     false
//     // );
// };
