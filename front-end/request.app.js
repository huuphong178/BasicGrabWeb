$(document).ready(function () {
    $("form").submit(function () {
        alert("Submitted");
    });
    $("#RECEIVER").click(function () {
        // ("form").submit();
        // alert("Phong Nguyen");
        var formdata = {
            "name": $("#name").val(),
            "phone": $("#phone").val(),
            "address": $("#address").val(),
            "note": $("#note").val(),
            "status": 0,
            "location_x": "null",
            "location_y": "null",
            "driver_id": "null"
        }

        $.ajax({
            contentType: 'application/json',
            url: 'http://localhost:3000/request',
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify(formdata),
            timeout: 10000,
            error: function (xhr, desc, err) {
                console.log(err);
            }
        }).done(function (data) {
            swal("Good job!", "You clicked the button!", "success");
            $("#name").val('');
            $("#phone").val('');
            $("#address").val('');
            $("#note").val('');
        });

    })
});