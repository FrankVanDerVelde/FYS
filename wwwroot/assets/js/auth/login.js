let loginCounter = 0;

//het script word uitgevoerd waneer er op de login knop wordt gedrukt
document.querySelector("#login-btn").addEventListener("click", function (event) {
    event.preventDefault();
    loginCounter++;

    if (loginCounter < 3) {
        login();
    }
    else {
        //laad de google recaptcha zien
        document.getElementById("g-recaptcha").classList.add("visble");

        loginRecaptcha();
    }
})
async function login() {

    //clear de session voor het inloggen
    FYSCloud.Session.clear()

    //aanmaak de logindatum
    let loginDate = new Date().toISOString().split("T")[0];

    //ophalen van de logindata
    const email = document.querySelector("#email-login").value;
    const password = document.querySelector("#password-login").value;

    try {

        //verstuur data naar database
        let accountInfo = await FYSCloud.API.queryDatabase("SELECT * FROM account WHERE email = ? AND" +
            " password = SHA2(?, 256)",
            [email, password]);

        //als het account gevonden wordt in de database.
        if (accountInfo.length > 0) {

            //geef de laatste login datum mee aan de functie
            await FYSCloud.API.queryDatabase("UPDATE account SET lastLoggedIn = ? WHERE email = ?",
                [loginDate, email]);

            //hier komt sessie functie
            FYSCloud.Session.set("loggedin", accountInfo);

            //doorlinken naar profile page (als er geen error is).
            window.location.replace("../../views/profile-edit.html");

        } else {
            document.querySelector("#error-message").innerHTML = "Er is iets mis gegaan. :(" +
                " Het wachtwoord en/of email-address zijn fout.";

        }
    }
    catch(error) {
        //laat de gebruiker weten als er iets niet goed ging.
        document.querySelector("#error-message").innerHTML = "er ging iets mis :( Probeer het opnieuw.";
    }
}

async function loginRecaptcha() {

    //clear de session voor het inloggen
    FYSCloud.Session.clear()

    //aanmaak de logindatum
    let loginDate = new Date().toISOString().split("T")[0];

    //ophalen van de logindata
    const email = document.querySelector("#email-login").value;
    const password = document.querySelector("#password-login").value;
    let response = grecaptcha.getResponse();

    if(response.length === 0) {
        //laat de gebruiker weten dat de recaptcha is mislukt
        document.querySelector("#error-message").innerHTML = "recaptcha is niet gevalideert";
    }
    else {

        try {

            //verstuur data naar database
            let accountInfo = await FYSCloud.API.queryDatabase("SELECT * FROM account WHERE email = ? AND" +
                " password = SHA2(?, 256)",
                [email, password]);

                //als het account gevonden wordt in de database.
                if (accountInfo.length > 0) {

                    //geef de laatste login datum mee aan de functie
                    await FYSCloud.API.queryDatabase("UPDATE account SET lastLoggedIn = ? WHERE email = ?",
                        [loginDate, email]);

                    //hier komt sessie functie
                    FYSCloud.Session.set("loggedin", accountInfo);

                    //doorlinken naar profile page (als er geen error is).
                    window.location.replace("../../views/profile-edit.html");

                } else {
                    document.querySelector("#error-message").innerHTML = "Er is iets mis gegaan. :(" +
                        " Het wachtwoord en/of email-address zijn fout.";
                }
        }
        catch(error) {
            //laat de gebruiker weten als er iets niet goed ging.
            document.querySelector("#error-message").innerHTML = "er ging iets mis :( Probeer het opnieuw.";
        }
    }
}
