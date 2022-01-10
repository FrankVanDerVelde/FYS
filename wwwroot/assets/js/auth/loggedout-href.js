//voer het script uit als de site is geladen.

let loggedin = FYSCloud.Session.get("loggedin");

if (!loggedin) {
    const urlSplitted = window.location.href.split(/[/,?]/);

    if (urlSplitted.includes('panel.html') || urlSplitted.includes('userPanel.html')) {
        window.location.replace("../../../assets/views/auth/login.html");
    } else {
        window.location.replace("../views/auth/login.html");
    }

}




