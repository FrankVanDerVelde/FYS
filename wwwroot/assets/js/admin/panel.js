window.onload = async () => {
    await auth();
}

async function auth() {
    let loggedin = await FYSCloud.Session.get("loggedin");
    if(loggedin[0].usertypeFk !== 1) {
        // window.location.replace("../../../assets/views/profile-edit.html");
    }
}

async function searchUser() {
    const searchParam = document.getElementById("searchInput").value;
    const errPicUri = `https://ui-avatars.com/api/?name=ER?background=random`;

    const data = [
        await getUserByEmailAsync(searchParam),
        await getUserByName(searchParam)
    ];



    if (data[0] == undefined && data[1] == undefined) {
        document.getElementById("name").innerText = "ERROR: Can't Find user!";
        document.getElementById("email").innerText = "Did you type in the exact";
        document.getElementById("userImage").src = errPicUri;

    } else {
        for (let i = 0; i < data.length; i++) {
            if(data[i] != undefined) {
                await updatePanel(data[i]);
            }
        }
    }
}



async function updatePanel(userObj) {
    document.getElementById("name").innerText = userObj.name;
    document.getElementById("email").innerText = userObj.email;
    document.getElementById("userImage").src = userObj.profilePhoto;

    if (userObj.lastLoggedIn != null) {
        document.getElementById("lastActive").innerText = await stripTimeFromDate(userObj.lastLoggedIn);
    }

    document.getElementById("matchAmount").innerText = await getMatchAmount(userObj.id);
}


async function deleteCurrentUser() {
    const user = await getUserByEmailAsync(document.getElementById("email").innerText);

    await deleteUserById(user.id);

    document.getElementById("searchInput").value = "";

    window.location.reload();
}

async function getMatchAmount(userId) {
    const matchArray = await sqlSelectAsync("matches", ["currUserFk "], [userId]);
    let amount = 0;

    for (let i = 0; i < matchArray.length; i++) {
        if (matchArray[i].status === "accepted") {
            amount += 1;
        }
    }

    return amount;
}
