var id_driver = 1540709441669;
$(document).on('click', 'a[href^="#map"]', function (event) {
    event.preventDefault();

    $('html, body').animate({
        scrollTop: $($.attr(this, 'href')).offset().top
    }, 600);
});

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () {
    scrollFunction()
};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("myBtnTop").style.display = "block";
    } else {
        document.getElementById("myBtnTop").style.display = "none";
    }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}
var switchStatus = function (checkbox) {
    if (checkbox.checked) {
        $.notify(
            "On", "success",

        );
        updateStatus(id_driver, 1);
    } else {
        $.notify(
            "Off", "error",
        );
        updateStatus(id_driver, 2);
    }
}

//call Api updateStatus
var updateStatus = function (id, status) {
    var data = {
        id: id,
        status: status,
    }
    var instance = axios.create({
        baseURL: 'http://localhost:3000/driver',
        timeout: 3000
    });

    instance.put('/status', data)
        .then(function (res) {
            if (res.status === 200) {}
        }).catch(function (err) {
            console.log(err);
        })
}