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

var keyAccessToken = "accessToken";
var keyRefreshToken = "refreshToken";

var axiosInstance = axios.create({
    baseURL: "http://localhost:3000",
    timeout: 10000,
    headers: { "x-access-token": localStorage.getItem(keyAccessToken) }
});

// window
window.onload = function() {
    // initListenEvent();
    setupWS();
    let width = window.innerWidth - $("#mySidenav").width();
    let height = window.innerHeight - $(".container-fluid").height();

    let margin_left = $("#mySidenav").width();
    $("#map").css("margin-left", margin_left + "px");
    $("#map").css("margin-top", "-20px");
    $("#map").css("transition", "0.5s");
    $("#map").css("width", width + "px");
    $("#map").css("height", height + "px");
};

window.addEventListener("beforeunload", function(e) {
    var msg = {
        closing: locateModal.infoCustomer.id !== undefined ? true : false,
        type: locateModal.infoCustomer.db !== undefined ? "db" : "live",
        data: locateModal.infoCustomer
    };

    ws.send(JSON.stringify(msg));
});

$(window).resize(function() {
    let width = window.innerWidth - $("#mySidenav").width();
    let height = window.innerHeight - $(".container-fluid").height();
    let margin_left = $("#mySidenav").width();
    $("#map").css("margin-left", margin_left + "px");
    $("#map").css("width", width + "px");
    $("#map").css("height", height + "px");
});
// Done window

// map
var map;
var marker;
var newRequest = "free";
var locator = localStorage.getItem("username");
var clickOnMap = false;
var toggle = true; // true: large, false: small

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
                    if (res.status === 200) {
                        self.hisList = [];
                        res.data.forEach((item, index) => {
                            self.hisList.push(item);
                        });
                        $("#historyModal").modal({
                            backdrop: "static",
                            keyboard: false
                        });
                    } else if (res.status === 204) {
                        swal(
                            "Thông báo!",
                            "Bạn chưa định vị yêu cầu nào",
                            "error"
                        );
                    }
                })
                .catch(function(err) {
                    if (err.response.data.msg === "INVALID_TOKEN") {
                        alert(err.response.data.msg);
                    } else if (err.response.data.msg === "NO_TOKEN") {
                        alert(err.response.data.msg);
                    }
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
        if (toggle) {
            $("#free").css("display", "none");
            $("#new").css("display", "inline");
        } else {
            $("#free-status").css("display", "none");
            $("#new-status").css("display", "inline-block");
        }
        locateModal.loadModal(e.data);
        relocateModal.loadModal(e.data);
        newRequest = "new";
    };
};
// Done WS

// button click
$("#toggleSideBar").click(() => {
    if ($("#mySidenav").width() !== 250) {
        toggle = true;
        $("#mySidenav").css("width", "250px");
        $(".sidebarTitle").css("display", "inline");
        $(".sidebarA-script").removeClass("a1");
        $(".icon-script").removeClass("icon-small");
        $(".status").css("display", "none");
        if (newRequest === "free") $("#free").css("display", "inline");
        else if (newRequest === "new") $("#new").css("display", "inline");
        else $("#waiting").css("display", "inline");
        let width = window.innerWidth - 250;
        $("#map").css("width", width + "px");
        $("#map").css("margin-left", "250px");
    } else {
        toggle = false;
        $("#mySidenav").css("width", "100px");
        $("#mySidenav").addClass("small");
        $(".sidebarTitle").css("display", "none");
        $(".sidebarA-script").addClass("a1");
        $(".icon-script").addClass("icon-small");
        $(".label-script").css("display", "none");
        if (newRequest === "free")
            $("#free-status").css("display", "inline-block");
        else if (newRequest === "new")
            $("#new-status").css("display", "inline-block");
        else $("#waiting-status").css("display", "inline-block");
        let width = window.innerWidth - 100;
        $("#map").css("width", width + "px");
        $("#map").css("margin-left", "100px");
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
});

$("#real-locate").click(() => {
    $("#loaderModal").modal({ backdrop: "static", keyboard: false });
    if (toggle) {
        $("#new").css("display", "none");
        $("#waiting").css("display", "inline");
    } else {
        $("#new-status").css("display", "none");
        $("#waiting-status").css("display", "inline-block");
    }
    newRequest = "waiting";
    marker.setMap(null);
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: locateModal.infoCustomer.address }, function(
        results,
        status
    ) {
        if (status === "OK") {
            $("#loaderModal").modal("hide");
            let location = {
                lat: +results[0].geometry.location.lat(),
                lng: +results[0].geometry.location.lng()
            };
            // Lấy trường bên server (sendToLocator) để kiểm tra gửi trực tiếp hay từ db
            marker.setMap(null);
            addMarker(location, map, locateModal.infoCustomer, "new");
            locateModal.infoCustomer.location_x = location.lat;
            locateModal.infoCustomer.location_y = location.lng;
        } else {
            $("#loaderModal").modal("hide");
            $("#re-locateModal").modal({ backdrop: "static", keyboard: false });
        }
    });
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
            if (toggle) {
                $("#waiting").css("display", "none");
                $("#free").css("display", "inline");
            } else {
                $("#waiting-status").css("display", "none");
                $("#free-status").css("display", "inline-block");
            }
            newRequest = "free";
            locateModal.infoCustomer = {};
            var msg = {
                doneProcess: {
                    id: locator,
                    status: LocatorStatus.RANH,
                    // Nếu gửi trực tiếp thì thêm 1 trường qua server kiển tra coi xóa hay không xóa DB
                    db: dbRequest,
                    data: request
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
