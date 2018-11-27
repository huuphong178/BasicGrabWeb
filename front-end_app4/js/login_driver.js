var keyAccessToken = "accessToken";
var keyRefreshToken = "refreshToken";
$(document).ready(function(){
    $('input').keypress(function(e){
      if(e.keyCode==13)
      $('#login').click();
    });
});
$("#login").click(function () {
    var formdata = {
        username: $("#username").val(),
        password: md5($("#password").val())
    };

    $.ajax({
        contentType: "application/json",
        url: "http://localhost:3000/account/driver/login",
        type: "POST",
        dataType: "json",
        data: JSON.stringify(formdata),
        timeout: 10000,
        error: function (xhr, desc, err) {
            alert("Có lỗi xảy");
        }
    }).done(function (data) {
        if (data.auth) {
            localStorage.setItem(keyAccessToken, data.access_token);
            localStorage.setItem(keyRefreshToken, data.refresh_token);
            localStorage.setItem("user", JSON.stringify(data.user));
            window.location.href = window.location.origin;
        } else {
            swal("Cảnh báo!", `Sai tài khoản hoặc mật khẩu.`, "error");
        }
    });
});

$("#register").click(function () {
    if ($("#password").val() === $("#re_password").val()) {
        var formdata = {
            username: $("#username").val(),
            name: $("#name").val(),
            phone: $("#phone").val(),
            address: $("#address").val(),
            bike_id: $("#bike_id").val(),
            bike_type: $("#bike_type").val(),
            password: md5($("#password").val())
        };
        $.ajax({
                contentType: "application/json",
                url: "http://localhost:3000/account/driver/register",
                type: "POST",
                dataType: "json",
                data: JSON.stringify(formdata),
 timeout: 10000

            })
            .done(function (data) {
                if (data.duplicate) {
                    swal(
                        "Cảnh báo!",
                        `${formdata.username} đã tồn tại.`,
                        "error"
                    );
                } else {
                    swal(
                        "Thành công!",
                        `${formdata.username} đã trở thành tài xế.`,
                        "success"
                    ).then((value) => {
                        if (value) {
                            window.location.href = window.location.origin + "/login";
                        }
                    });
                }
            })
            .fail(function (err) {
                alert("Something wrong");
            });
    } else {
        alert("Mật khẩu không khớp");
    }
});
$("#btnregister").click(function () {
    window.location.href = window.location.origin + "/register";
});