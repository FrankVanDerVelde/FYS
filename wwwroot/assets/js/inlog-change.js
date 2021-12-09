document.addEventListener("DOMContentLoaded", function () {

let session = FYSCloud.Session.get('loggedin');

    if (typeof(session) !== "undefined") {
        let profilePhoto = session[0].profilePhoto;
        document.querySelector('.matches-link').style.display = 'block';
        document.querySelector('.logout-btn').style.display = 'block';
        document.querySelector('.inlog-btn').style.display = 'none';
        document.querySelector('.registreer-btn').style.display = 'none';
        document.querySelector('.profile-button').style.display = 'block';
        document.querySelector('.footer-login').style.display = 'none';
        document.getElementById("header-profile-img").src = profilePhoto;

    } else {
        document.querySelector('.matches-link').style.display = 'none';
        document.querySelector('.logout-btn').style.display = 'none';
        document.querySelector('.inlog-btn').style.display = 'block';
        document.querySelector('.registreer-btn').style.display = 'block';
        document.querySelector('.profile-button').style.display = 'none';
        document.querySelector('.footer-login').style.display = 'block';

    }


});