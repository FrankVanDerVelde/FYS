document.querySelector("#login-btn").addEventListener("click", function (event) {
    event.preventDefault();
    login();
})
    async function login() {

        //ophalen van de logindata
        const email = document.querySelector("#email-login").value;
        const password = document.querySelector("#password-login").value;

        try {
            //verstuur data naar database
            await FYSCloud.API.queryDatabase("SELECT * FROM account WHERE email = ? AND password = SHA2(?, 256)",
                [email, password]);

            //hier komt sessie functie

            //doorlinken naar profile page (als er geen error is).
            window.location.replace("../../views/profile-edit.html");
        }
        catch {
            //laat de gebruiker weten als er iets niet goed ging, of de email al is gebruikt
            window.alert("Er is iets mis gegaan. :( \n Het wachtwoord en/of email-address zijn fout. ")
        }
    }

