//voer het script uit als de site is geladen.
window.addEventListener("load", function() {
    let loggedin = FYSCloud.Session.get("loggedin");

    if (loggedin && loggedin[0].usertypeFk === 2) {
        window.location.replace("../../views/profile-edit.html");
    } else if (loggedin && loggedin[0].usertypeFk === 1) {
        window.location.replace("../../views/admin/panel.html");
    }
});