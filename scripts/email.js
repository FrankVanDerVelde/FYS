
function sendContact() {
    let name = document.forms["emailForm"]["name"].value;
    let email = document.forms["emailForm"]["email"].value;
    let sub = document.forms["emailForm"]["subject"].value;
    let msg = document.forms["emailForm"]["message"].value;

    let body = msg + "\n" + name;

    await sendEmailAsync(email, sub, body);
}

function resetEmail() {
    let email = document.forms["resetForm"]["email"].value;

    if(await emailExists(email))
    {
        await sendEmailAsync(email, "Password Reset", await getResetInfo());
    }
}

async function sendEmailAsync(email, sub, body) {
    Email.send({
        SecureToken: "",
        To: email,
        From: "Our@isp.nl",
        Subject: sub,
        Body: body
    }).then(
        message => alert("Message send Succefully!" + message)
    )
}
