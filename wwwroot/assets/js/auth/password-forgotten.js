document.querySelector("#reset-password-btn").addEventListener("click", function (event) {
    event.preventDefault();

    sendMail();
})

async function sendMail() {

    //krijgen email en aanmaken code
    const email = document.querySelector("#email").value;
    const code = Math.floor(Math.random() * 100000) + 10000;

    //genereer url voor wachtwoord reset
    let url = "../../views/auth/password-reset.html?email=" + email + "&code=" + code; //tijdelijke link vanwege gebruk url

    //zet de reset code in de
    try {
        //zet de reset code in de
        await FYSCloud.API.queryDatabase("UPDATE account SET pwdReset = ? WHERE email = ?",
             [code, email]);

         //krijg de naam van de gebruiker
        let name = await FYSCloud.API.queryDatabase("SELECT name FROM account WHERE email = ?",
            [email]);

        //verstuur de email met de reset link
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
            subject: "Corendom - Aanvraag resetten wachtwoord ",
            html: "<h1>Reset E-mail</h1><p>Je kan je E-mail resetten via de onderstaande link:<br></p>" + url
        })

        //gebruiker krijgt een bericht dat de email is verzonden
        window.alert("De email om uw wachtwoord te resetten is verzonden");

        //doorlinken naar home page als alles geslaagd is
        window.location.replace("../../../index.html");
    }
    catch {
        //laat de gebruiker weten als er iets niet goed ging, of de email niet is gevonden
        window.alert("Er is iets mis gegaan. :(\n De email is mogelijk niet gevonden");
    }
}