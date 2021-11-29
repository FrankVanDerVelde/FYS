document.querySelector("#login-btn").addEventListener("click", function (event) {
    event.preventDefault();
    login();
})
async function login() {
    //clear de session voor het inloggen
    FYSCloud.Session.clear()

    //ophalen van de logindata
    const email = document.querySelector("#email-login").value;
    const password = document.querySelector("#password-login").value;

    try {
        //verstuur data naar database
        let accountInfo = await FYSCloud.API.queryDatabase("SELECT * FROM account WHERE email = ? AND" +
            " password = SHA2(?, 256)",
            [email, password]);
        console.log(accountInfo);
        if (accountInfo.length > 0) {
            //hier komt sessie functie
            FYSCloud.Session.set("account", accountInfo);

            //doorlinken naar profile page (als er geen error is).
            // window.location.replace("../../views/profile-edit.html");

        } else {
            window.alert("Er is iets mis gegaan. :( \n Het wachtwoord en/of email-address zijn fout. ");
        }
    }
    catch {
        //laat de gebruiker weten als er iets niet goed ging.
        window.alert("Er is een server fout opgetreden");
    }
}

