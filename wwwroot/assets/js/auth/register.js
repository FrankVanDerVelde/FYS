document.querySelector("#submit-btn").addEventListener("click", function (event) {
    event.preventDefault();
    register();
})

async function register() {

    //registeerdatum aanmaken
    let registerDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

    //aanmaken variabele voor het de inlog
    const password = document.querySelector("#password").value;
    const passwordVerify = document.querySelector("#passwordVerify").value;
    const email = document.querySelector("#email").value;
    const name = document.querySelector("#name").value;
    const usertype = 1; //gaat weg

    // temp dummy data to try inserts
    const username = "testusername" + Math.random(2000);

    //aanmaken profielfoto.
    let userPhotoId = name.replace(/\s+/g, '+').toLowerCase();
    let profilePhoto = `https://ui-avatars.com/api/?name=${userPhotoId}?background=random`;
    // let profilePhoto = "https://ui-avatars.com/api/?name="+ userPhotoId +"?background=random";

    //laat de gebruiker alleen aanmelden als het wachtwoord het zelfde is.
    if (password === passwordVerify) {
        //try {
            //verstuur data naar database
            let log = await FYSCloud.API.queryDatabase("INSERT INTO account (email, password, username, profilePhoto," +
                " usertypeFk, createdAt) VALUES (?, SHA2(?, 256), ?, ?, ?, ?)",[email, password, username,
                profilePhoto, usertype, registerDate]);
            console.log(log);
            //hier komt sessie functie

            //doorlinken naar profile page (als er geen error is).
            //window.location.replace("../../views/profile-edit.html");
        //}
        //catch {
            //laat de gebruiker weten als er iets niet goed ging, of de email al is gebruikt
            //window.alert("Er is iets mis gegaan. :( \n Het kan zijn dat dit email address al in gebruik is.")
        //}
    }
    else {
        //laat de gebruiker weten dat het wachtwoord niet klopt.
        document.querySelector("#error-message").innerHTML = "Je wachtwoord is niet het zelfde!";
    }

}