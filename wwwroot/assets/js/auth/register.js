
// het script wordt uitgevoerd wanner er op de registeer knop wordt gedrukt
document.querySelector("#submit-btn").addEventListener("click", function (event) {
    event.preventDefault();
    register();
})

async function register() {
    //clear de session voor het inloggen
    FYSCloud.Session.clear()

    //registeerdatum aanmaken
    let registerDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

    //aanmaken variabele voor het de inlog
    const password = document.querySelector("#password").value;
    const passwordVerify = document.querySelector("#passwordVerify").value;
    const email = document.querySelector("#email").value;
    const name = document.querySelector("#name").value;
    const usertype = 2; //gaat weg

    // tijdelijke dummy data voor het aanmaken van een username
    const username = "testusername" + Math.random(2000); //Hier komt een goede manier voor het aanmaken van username

    //aanmaken profielfoto.
    let userPhotoId = name.replace(/\s+/g, '+').toLowerCase();
    let profilePhoto = `https://ui-avatars.com/api/?name=${userPhotoId}?background=random`;

    //laat de gebruiker alleen aanmelden als het wachtwoord het zelfde is.
    if (password === passwordVerify) {
        try {
            //verstuur data naar database
            await FYSCloud.API.queryDatabase("INSERT INTO account (email, password, username, profilePhoto," +
                " usertypeFk, createdAt) VALUES (?, SHA2(?, 256), ?, ?, ?, ?)",
                [email, password, username, profilePhoto, usertype, registerDate]);

            //hier komt sessie functie
            let accountInfo = await FYSCloud.API.queryDatabase("SELECT * FROM account WHERE email = ? AND" +
                " password = SHA2(?, 256)",
                [email, password]);
            FYSCloud.Session.set("loggedin", accountInfo);

            //doorlinken naar profile page (als er geen error is).
            window.location.replace("../../views/profile-edit.html");
        }
        catch {
            //laat de gebruiker weten als er iets niet goed ging, of de email al is gebruikt
            window.alert("Er is iets mis gegaan. :( \n Het kan zijn dat dit email address al in gebruik is.");
        }
    }
    else {
        //laat de gebruiker weten dat het wachtwoord niet klopt.
        document.querySelector("#error-message").innerHTML = "Je wachtwoord is niet het zelfde!";
    }

}