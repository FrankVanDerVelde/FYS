async function searchUser() {
    const searchParam = document.getElementById("searchInput").value;

    console.log(searchParam)

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
}

async function getMatchAmount(userId) {
    const matchArray = await sqlSelectAsync("matches", ["currUserFk "], [userId]);

    return matchArray.length;
}
