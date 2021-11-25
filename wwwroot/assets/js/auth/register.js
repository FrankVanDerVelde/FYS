
async function register() {

    //registeerdatum aanmaken
    let registerDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    console.log(registerDate)

    //aanmaken variabele voor het de inlog
    let password = document.querySelector("#password").value;
    let passwordVerify = document.querySelector("#passwordVerify").value;
    let email = document.querySelector("#email").value;
    let name = document.querySelector("#name").value;
    let usertype = 2;

    //lees de naam, email en wachtwoord af uit de inputvelden
    // document.querySelector("#password").addEventListener("change", event => {
    //     password =  event.target.value;
    // });
    // document.querySelector("#passwordVerify").addEventListener("change", event => {
    //     passwordVerify =  event.target.value;
    // });
    // document.querySelector("#email").addEventListener("change", event => {
    //     email =  event.target.value;
    // });


    // document.querySelector("#name").addEventListener("change", event => {
    //     console.log(event)
    //     name =  event.target.value;
    // });

    //aanmaken profielfoto.
    let userPhotoId = name.replace(/\s+/g, '+').toLowerCase();
    let profilePhoto = `https://ui-avatars.com/api/?name=${userPhotoId}?background=random`;
    // let profilePhoto = "https://ui-avatars.com/api/?name="+ userPhotoId +"?background=random";

    //laat de gebruiker alleen aanmelden als het wachtwoord het zelfde is.
    if (password === passwordVerify) {
        // const response = await FYSCloud.API.queryDatabase(
        //     "INSERT INTO account (`email`, `password`, 'createdAt', 'profilePhoto', 'usertypeFk')" +
        //     ` VALUES (${email}, ${password}, ${registerDate}, ${profilePhoto}, ${usertype})`
        //  )

        const response = await FYSCloud.API.queryDatabase("INSERT INTO account (email, password, createdAt, profilePhoto, usertypeFk) VALUES (email, password, registerDate, profilePhoto, userType)");

        await console.log(response)
    }
    else {
        document.querySelector("#error-message").innerHTML = "Je wachtwoord is niet het zelfde!";
    }


}