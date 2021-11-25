import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";

window.addEventListener('load', () => {

    //import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";

    function register() {

        //registeerdatum aanmaken
        let registerDate = Date.now();

        //aanmaken variabele voor het de inlog
        let password;
        let passwordVerify;
        let email;
        let name;
        let usertype = 2;

        //lees de naam, email en wachtwoord af uit de inputvelden
        document.querySelector("#password").addEventListener("change", event => {
            password =  event.target.value;
        });
        document.querySelector("#passwordVerify").addEventListener("change", event => {
            passwordVerify =  event.target.value;
        });
        document.querySelector("#email").addEventListener("change", event => {
            email =  event.target.value;
        });
        document.querySelector("#name").addEventListener("change", event => {
            name =  event.target.value;
        });

        //aanmaken profielfoto.
        let userPhotoId = name.replace(/\s+/g, '+').toLowerCase();
        let profilePhoto = "https://ui-avatars.com/api/?name="+ userPhotoId +"?background=random";

        //laat de gebruiker alleen aanmelden als het wachtwoord het zelfde is.
        if (password === passwordVerify) {
            FYSCloud.API.queryDatabase(
                "INSERT INTO `account`(`email`,`password`, 'createdAt', 'profilePhoto', 'usertypeFk') " +
                "VALUES " + "(" + email + ", " + password + ", " + registerDate + ", " +
                profilePhoto + ", " + usertype + ")"
            ).then(function(data) {
                console.log(data);
                event.preventDefault();
            }).catch(function(reason) {
                console.log(reason);
                });
            event.preventDefault();
        }
        else {
            document.querySelector(".error-message").innerHTML = "Je wachtwoord is niet het zelfde!";
        }


        // event.preventDefault();
        // let uid = document.forms["loginForm"]["uid"].value;
        //
        // if (uid === "admin@admin.com")
        //     window.location.href = "../admin/panel.html";
        // else
        //     window.location.href = "../profile-edit.html";

        //INSERT INTO `account`(`id`,`email`,`password`, 'createdAt', 'profilePhoto', 'usertypeFk') VALUES (username, email, password, registerDate, profilePhoto, usertype)

    }
});
