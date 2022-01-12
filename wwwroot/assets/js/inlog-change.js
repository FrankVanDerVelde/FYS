document.addEventListener("DOMContentLoaded", async function () {

    let session = FYSCloud.Session.get('loggedin');
    const logoutButtons = document.getElementsByClassName('logout-btn');
    const loginButtons = document.getElementsByClassName('login-btn');
    const registerButtons = document.getElementsByClassName('register-btn');
    const profileButtons = document.getElementsByClassName('profile-button');
    const matchesLink = document.getElementsByClassName('matches-link');

    function setVisbility (targets, visibility) {
        for (i = 0; i < targets.length; i++) {
            targets[i].style.display = visibility;
        }
    }

    if (typeof(session) !== "undefined") {

        const userData = await getUserData(session[0].id);

        // If profile photo exists use it. Otherwise generate a default
        let profilePhoto = (userData[0].profilePhoto ? userData[0].profilePhoto : `https://ui-avatars.com/api/?name=${session[0].name}?background=#e0dcdc`);

        // Setting display attribute to empty instead of re-setting it to prevent conflicts with classes
        setVisbility(matchesLink, '');
        setVisbility(logoutButtons, '');
        setVisbility(loginButtons, 'none');
        setVisbility(registerButtons, 'none');
        setVisbility(profileButtons, '');

        if (session[0].usertypeFk == 1) {
            let userPanel = document.createElement('a');
            let panel = document.createElement('a');

            let userPanelLink = document.createTextNode("User Panel"); 
            let panelLink = document.createTextNode("Panel");

            userPanel.className = 'admin-links';
            panel.className = 'admin-links';

            userPanel.appendChild(userPanelLink); 
            panel.appendChild(panelLink); 
                    
            // Set the href property
            userPanel.href ="/assets/views/admin/userPanel.html"; 
            panel.href = "/assets/views/admin/panel.html"; 

            document.querySelector('#dropdown-content').prepend(userPanel, panel); 
        } else {
            document.querySelectorAll('.admin-link').forEach(link => link.remove());
        }

        document.getElementById("header-profile-img").src = profilePhoto;
    } else {
        setVisbility(logoutButtons, 'none');
        setVisbility(loginButtons, '');
        setVisbility(registerButtons, '');
        setVisbility(profileButtons, 'none');
        setVisbility(matchesLink, '');
    }

    async function getUserData(userId){
        try {
            const query = FYSCloud.API.queryDatabase('SELECT * FROM account WHERE account.id = ?;', [userId]);
            const results = await query;
            return await results;
        } catch (error) {
            console.log(error);
        }
    }
});    