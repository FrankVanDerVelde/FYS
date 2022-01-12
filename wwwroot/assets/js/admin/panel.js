async function searchUser() {
    const searchParam = document.getElementById("searchInput").value;

    const data = [
        await getUserByEmailAsync(searchParam),
        await getUserByName(searchParam)
    ];

    for(let i=0; i<data.length; i++) {
        if(data[i] != null) {
            await updatePanel(data[i]);
        }
    }
}

async function updatePanel(userObj) {
    document.getElementById("name").innerText = userObj.name;
    document.getElementById("email").innerText = userObj.email;
    document.getElementById("userImage").src = userObj.profilePhoto;

    if(userObj.lastLoggedIn != null) {
        document.getElementById("lastActive").innerText = await stripTimeFromDate(userObj.lastLoggedIn);
    }

    // To be implemented
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
    let amount= 0;

    for(let i=0; i<matchArray.length; i++) {
        if(matchArray[i].status === "accepted") {
            amount += 1;
        }
    }

    return amount;
}
