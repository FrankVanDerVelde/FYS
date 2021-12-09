document.addEventListener("DOMContentLoaded", function () {

let session = FYSCloud.Session.get('loggedin');

    console.log(session);

    if (session) {
        document.querySelector('.matches-link').style.display = 'block';
        document.querySelector('.logout-btn').style.display = 'block';
        document.querySelector('.inlog-btn').style.display = 'none';
        document.querySelector('.registreer-btn').style.display = 'none';
        document.querySelector('.profile-button').style.display = 'block';


    } else {
        document.querySelector('.matches-link').style.display = 'none';
        document.querySelector('.logout-btn').style.display = 'none';
        document.querySelector('.inlog-btn').style.display = 'block';
        document.querySelector('.registreer-btn').style.display = 'block';
        document.querySelector('.profile-button').style.display = 'none';

    }
});