//Set id_driver mac dinh
var id_driver =0;
var user= JSON.parse(localStorage.getItem("user"));
id_driver=user.id;
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
        document.getElementById("actionTrip").style.display = "block";
    } else {
        document.getElementById("myBtnTop").style.display = "none";
        document.getElementById("actionTrip").style.display = "none";
    }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}
$(document).ready(function() {
    $('#nameuser').text('Name: '+user.name);
});
$("#logout").click(() => {
    localStorage.clear();
    window.location.href = window.location.origin + "/login";
});