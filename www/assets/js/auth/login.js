
function login() {
    event.preventDefault();
    let uid = document.forms["loginForm"]["uid"].value;

    if(uid === "admin@admin.com")
        window.location.href = "../admin/panel.html";
    else
        window.location.href = "../../../profile-edit.html";

}