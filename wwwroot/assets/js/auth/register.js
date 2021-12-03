
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

    //aanmaken profielfoto.
    let userPhotoId = name.replace(/\s+/g, '+').toLowerCase();
    let profilePhoto = `https://ui-avatars.com/api/?name=${userPhotoId}?background=random`;

    //laat de gebruiker alleen aanmelden als het wachtwoord het zelfde is.
    if (password === passwordVerify) {
        try {
            //verstuur data naar database
            let log = await FYSCloud.API.queryDatabase("INSERT INTO account (name, email, password, profilePhoto, createdAt) " +
                "VALUES (?, ?, SHA2(?, 256), ?, ?)",
                [name, email, password, profilePhoto, registerDate]);

            //hier komt sessie functie
            let accountInfo = await FYSCloud.API.queryDatabase("SELECT * FROM account WHERE email = ? AND" +
                " password = SHA2(?, 256)",
                [email, password]);
            FYSCloud.Session.set("loggedin", accountInfo);

            //verstuur de email dat het account is aangemaakt.
            await FYSCloud.API.sendEmail({
                from: {
                    name: "Corendom Reispartner",
                    address: "group@fys.cloud"
                },
                to: [
                    {
                        name: "gebruiker",
                        address: email
                    }
                ],
                subject: "Corendom - Je account is aangemaakt!",
                html: "<h1>Gefeliciteerd! Je account is aangemaakt!</h1><p>Gefeliciteerd! Je account bij corendom " +
                    "reispartner is aangemaakt!" +
                    " <br>Herken je deze actie niet? Neem dan contact met ons op.</p>"
            })

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