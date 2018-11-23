var keyAccessToken = "accessToken";
var keyRefreshToken = "refreshToken";

$("#login").click(function() {
    var formdata = {
        username: $("#username").val(),
        password: md5($("#password").val())
    };

    $.ajax({
        contentType: "application/json",
        url: "http://localhost:3000/account/admin/login",
        type: "POST",
        dataType: "json",
        data: JSON.stringify(formdata),
        timeout: 10000,
        error: function(xhr, desc, err) {
            alert("Có lỗi xảy");
        }
    }).done(function(data) {
        if (data.auth) {
            localStorage.setItem(keyAccessToken, data.access_token);
            localStorage.setItem(keyRefreshToken, data.refresh_token);
            localStorage.setItem("user", JSON.stringify(data.user));
            window.location.href = window.location.origin + "/request";
        } else {
            swal("Thất bại!", "Sai tài khoản hoặc mật khẩu", "error");
        }
    });
});

$("#register").click(function() {
    if ($("#password").val() === $("#re-password").val()) {
        var formdata = {
            username: $("#username").val(),
            name: $("#name").val(),
            password: md5($("#password").val())
        };

        $.ajax({
            contentType: "application/json",
            url: "http://localhost:3000/account/admin/register",
            type: "POST",
            dataType: "json",
            data: JSON.stringify(formdata),
            timeout: 10000,
            error: function(xhr, desc, err) {
                console.log(err);
            }
        })
            .done(function(data) {
                if (data.duplicate) {
                    swal(
                        "Cảnh báo!",
                        `${formdata.username} đã tồn tại.`,
                        "error"
                    );
                } else {
                    // window.location.href = window.location.origin + "/login";
                    swal(
                        "Thành công!",
                        `${formdata.username} đã trở thành quản trị viên.`,
                        "success"
                    );
                }
            })
            .fail(function(err) {
                alert("Something wrong");
            });
    } else {
        alert("Mật khẩu không khớp");
    }
});
