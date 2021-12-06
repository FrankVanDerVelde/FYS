// het script wordt uitgevoerd wanner er op de registeer knop wordt gedrukt
document.querySelector("#password-reset-btn").addEventListener("click", function (event) {
    event.preventDefault();

    passwordReset();
})

async function passwordReset() {

    //krijgen van nieuwe wachtwoord en controlle
    const password = document.querySelector("#password").value;
    const passwordVerify = document.querySelector("#passwordVerify").value;
    let queryParams = new URLSearchParams(window.location.search);
    let email = queryParams.get('email');
    let code = queryParams.get('code');

    //controleren of beide wachtwoorden het zelfde zijn.
    if (password === passwordVerify) {
        try {

            //voeg het nieuwe wachtwoord toe aan de database als de code klopt
            await FYSCloud.API.queryDatabase("UPDATE account SET password = SHA2(?, 256) WHERE pwdReset = ?",
                [password, code]);

            //zet de password reset in de database weer naar null
            await FYSCloud.API.queryDatabase("UPDATE account SET pwdReset = NULL WHERE email = ?",
                [email]);

            //haal de naam op van het account.
            let name = await FYSCloud.API.queryDatabase("SELECT name FROM account WHERE email = ?",
                [email]);

            //verstuur de email dat het wachtwoord is gereset.
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
                subject: "Corendom - Je wachtwoord is veranderd.",
                html: "<h1>Wachtwoord veranderd</h1><p>je wachtwoord is veranderd. Als jij dit niet hebt gedaan," +
                    " neem dan onmiddelijk contact op met ons.<br></p>"
            })

            //doorlinken naar home page
            window.location.replace("../../../index.html");

            //alert dat het wachtwoord is gereset.
            window.alert("Je wachtwoord is aangepast!");
        }
        catch {
            //laat de gebruiker weten als er iets niet goed ging, of de email al is gebruikt
            document.querySelector("#error-message").innerHTML = "Er is iets mis gegaan." +
                " Je code is mogelijk niet geldig.";
        }
    }
    else {
        //laat de gebruiker weten dat het wachtwoord niet klopt.
        document.querySelector("#error-message").innerHTML = "Je wachtwoord is niet het zelfde!";
    }
}