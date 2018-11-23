if (localStorage.getItem("refreshToken") === null) {
    window.location.href = window.location.origin + "/login";
}
