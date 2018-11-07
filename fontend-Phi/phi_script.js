var map;
var marker;
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 16,
        center: { lat: 10.7624176, lng: 106.68119679999995 },
        fullscreenControl: false
    });
    marker = new google.maps.Marker(null);
}

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
    $("#new").css("display", "none");
});

$("#real-locate").click(() => {
    $.ajax({
        url: "http://localhost:3000/map/geocoding?address=Công viên Võ Thị Sáu",
        type: "GET",
        dataType: "json",
        async: false,
        timeout: 10000,
        success: data => {
            marker.setMap(null);
            addMarker(data, map);
        },
        error: err => {}
    });
});

$("#view-detail").click(() => {
    $("#historyModal").modal("hide");
    marker.setMap(null);
    addMarker(
        {
            lat: 10.7558049,
            lng: 106.6675406
        },
        map
    );
});
