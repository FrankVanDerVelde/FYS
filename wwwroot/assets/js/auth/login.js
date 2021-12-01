
//het script word uitgevoerd waneer er op de login knop wordt gedrukt
document.querySelector("#login-btn").addEventListener("click", function (event) {
    event.preventDefault();
    login();
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
            window.alert("Er is iets mis gegaan. :( \n Het wachtwoord en/of email-address zijn fout. ");
        }
    }
    catch(error) {
        //laat de gebruiker weten als er iets niet goed ging.
        window.alert("er ging iets mis :( Probeer het opnieuw.");
    }
}
