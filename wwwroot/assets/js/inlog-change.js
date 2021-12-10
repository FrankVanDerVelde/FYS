document.addEventListener("DOMContentLoaded", function () {

let session = FYSCloud.Session.get('loggedin');

    if (typeof(session) !== "undefined") {
        let profilePhoto = session[0].profilePhoto;
      //  document.querySelector('.matches-link').style.display = 'block';
        document.querySelector('.logout-btn').style.display = 'block';
        if(document.querySelector('.inlog-btn') !== null){
            document.querySelector('.inlog-btn').style.display = 'none';
        }
        if(document.querySelector('.registreer-btn') !== null){
            document.querySelector('.registreer-btn').style.display = 'none';
        }
        document.querySelector('.profile-button').style.display = 'block';

        if(document.querySelector('.footer-login') !== null){
            document.querySelector('.footer-login').style.display = 'none';
        }

        if (session[0].usertypeFk == 1) {
            console.log('admin');
            let userPanel = document.createElement('a');
            let panel = document.createElement('a');

            let userPanelLink = document.createTextNode("User Panel"); 
            let panelLink = document.createTextNode("Panel"); 

            userPanel.className = 'admin-links';
            panel.className = 'admin-links';

            userPanel.appendChild(userPanelLink); 
            panel.appendChild(panelLink); 
                  
            // Set the href property
            userPanel.href ="/wwwroot/assets/views/admin/userPanel.html"; 
            panel.href = "/wwwroot/assets/views/admin/panel.html"; 

            document.querySelector('#dropdown-content').prepend(userPanel, panel); 
        }else{
            document.querySelectorAll('.admin-link').forEach(link => link.remove());
        }
        
        document.getElementById("header-profile-img").src = profilePhoto;
    } else {
      //  document.querySelector('.matches-link').style.display = 'none';
        document.querySelector('.logout-btn').style.display = 'none';
        document.querySelector('.inlog-btn').style.display = 'block';
        document.querySelector('.registreer-btn').style.display = 'block';
        document.querySelector('.profile-button').style.display = 'none';
        document.querySelector('.footer-login').style.display = 'block';
    }
});