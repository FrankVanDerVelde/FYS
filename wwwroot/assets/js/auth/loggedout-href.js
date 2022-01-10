//voer het script uit als de site is geladen.

let loggedin = FYSCloud.Session.get("loggedin");

if (!loggedin) {
    window.location.replace("../views/auth/login.html");
}
