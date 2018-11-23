var keyAccessToken = "accessToken";
var keyRefreshToken = "refreshToken";
var formdata = {};
$(document).ready(function() {
    $("form").submit(function() {
        alert("Submitted");
    });
    $("#RECEIVER").click(function() {
        saveRequest(formdata);
    });
});

var axiosInstance = axios.create({
    baseURL: "http://localhost:3000",
    timeout: 10000
});

function saveRequest(formdata) {
    formdata = {
        name: $("#name").val(),
        phone: $("#phone").val(),
        address: $("#address").val(),
        note: $("#note").val(),
        status: 0,
        location_x: "null",
        location_y: "null",
        driver_id: "null"
    };
    axiosInstance
        .post("/request", formdata, {
            headers: {
                "x-access-token": localStorage.getItem(keyAccessToken)
            }
        })
        .then(function(res) {
            swal("Good job!", "You clicked the button!", "success");
            $("#name").val("");
            $("#phone").val("");
            $("#address").val("");
            $("#note").val("");
        })
        .catch(function(err) {
            refreshToken(err, saveRequest);
        });
}

function refreshToken(err, callback) {
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
                return callback();
            })
            .catch(function(err) {
                console.log(err);
            });
    } else if (err.response.data.msg === "NO_TOKEN") {
        alert(err.response.data.msg);
    }
}