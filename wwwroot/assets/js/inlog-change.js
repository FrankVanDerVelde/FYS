document.addEventListener("DOMContentLoaded", function () {

let session = FYSCloud.Session.get('loggedin');
    const logoutButtons = document.getElementsByClassName('logout-btn');
    const loginButtons = document.getElementsByClassName('login-btn');
    const registerButtons = document.getElementsByClassName('register-btn');
    const profileButtons = document.getElementsByClassName('profile-button');
    const matchesLink = document.getElementsByClassName('matches-link');

    function setVisbility (targets, visibility) {
        console.log(targets);
        for (i = 0; i < targets.length; i++) {
            targets[i].style.display = visibility;
        }
    }

    if (typeof(session) !== "undefined") {
        // If profile photo exists use it. Otherwise generate a default
        let profilePhoto = (session[0].profilePhoto ? session[0].profilePhoto : `https://ui-avatars.com/api/?name=${session[0].name}?background=#e0dcdc`);

        // Setting display attribute to empty instead of re-setting it to prevent conflicts with classes
        setVisbility(matchesLink, '');
        setVisbility(logoutButtons, '');
        setVisbility(loginButtons, 'none');
        setVisbility(registerButtons, 'none');
        setVisbility(profileButtons, '');
        document.getElementById("header-profile-img").src = profilePhoto;
    } else {
        setVisbility(logoutButtons, 'none');
        setVisbility(loginButtons, '');
        setVisbility(registerButtons, '');
        setVisbility(profileButtons, 'none');
        setVisbility(matchesLink, '');
    }
});