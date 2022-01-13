window.onload = async () => {
    await auth();
}

/**
 * Checks if the user is allowed to visit the current page based on user Type.
 *
 * @returns {Promise<void>}
 */
async function auth() {
    let loggedin = await FYSCloud.Session.get("loggedin");
    if(loggedin[0].usertypeFk !== 1) {
        window.location.replace("../../../assets/views/profile-edit.html");
    }
}

/**
 *  Searches an user in the database. If non exists the card will get aan error message.
 * @returns {Promise<void>}
 */
async function searchUser() {
    const searchParam = document.getElementById("searchInput").value;
    const errPicUri = `https://ui-avatars.com/api/?name=ER?background=random`;

    // Build arr with data
    const data = [
        await getUserByEmailAsync(searchParam),
        await getUserByName(searchParam)
    ];

    // Display error if no user is found by current query
    if (data[0] == undefined && data[1] == undefined) {
        document.getElementById("name").innerText = "ERROR: Can't Find user!";
        document.getElementById("email").innerText = "Did you type in the exact";
        document.getElementById("userImage").src = errPicUri;

    } else {
        // Update the card with the user object.
        for (let i = 0; i < data.length; i++) {
            if(data[i] != undefined) {
                await updatePanel(data[i]);
            }
        }
    }
}

/**
 * Update's the panel based on the found user.
 *
 * @param userObj - Object of user (From session)
 */
async function updatePanel(userObj) {
    document.getElementById("name").innerText = userObj.name;
    document.getElementById("email").innerText = userObj.email;
    document.getElementById("userImage").src = userObj.profilePhoto;

    if (userObj.lastLoggedIn != null) {
        document.getElementById("lastActive").innerText = await stripTimeFromDate(userObj.lastLoggedIn);
    }

    document.getElementById("matchAmount").innerText = await getMatchAmount(userObj.id);
}

/**
 * Deletes the current searched user.
 *
 * @returns {Promise<void>}
 */
async function deleteCurrentUser() {
    const user = await getUserByEmailAsync(document.getElementById("email").innerText);

    await deleteUserById(user.id);

    document.getElementById("searchInput").value = "";

    window.location.reload();
}

/**
 * Gets all machetes of an user that are made in the application.
 *
 * @param userId
 * @returns {Promise<number>}
 */
async function getMatchAmount(userId) {
    const matchArray = await sqlSelectAsync("matches", ["currUserFk "], [userId]);
    let amount = 0;

    // Only increase amount if the match is 'accepted'.
    for (let i = 0; i < matchArray.length; i++) {
        if (matchArray[i].status === "accepted") {
            amount += 1;
        }
    }
    return amount;
}
