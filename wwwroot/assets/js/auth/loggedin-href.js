//voer het script uit als de site is geladen.
window.addEventListener("load", function() {
    let loggedin = FYSCloud.Session.get("loggedin");

    if (loggedin) {
        window.location.replace("../../views/profile-edit.html");
    }
});