window.onload = async () => {
    auth();

    await getMaxPages();
    await loadTable();
}

/**
 * Checks if the user is allowed to visit the current page based on user Type.
 */
function auth() {
    let loggedin = FYSCloud.Session.get("loggedin");
    if(loggedin[0].usertypeFk !== 1) {
        window.location.replace("../../../assets/views/profile-edit.html");
    }
}

/**
 * Makes it possible to navigate an tab back trough the user table.
 */
async function decrementPage() {
    let currentPage = document.getElementById("page").value;
    let newPage = currentPage - 1;
    if (newPage <= 0)
        newPage = 1;

    document.getElementById("page").value = newPage;
    await loadTable();
}

/**
 * Makes it possible to navigate an tab forward trough the user table.
 */
async function incrementPage() {
    let currentPage = document.getElementById("page").value;
    let newPage = Number(currentPage) + 1;
    if (newPage > await getMaxPages())
        newPage = await getMaxPages()

    document.getElementById("page").value = newPage;
    await loadTable();
}

/**
 * Every tab has at is most 8 users per tab.
 * All users are fetched and then divided in sets of 8.
 *
 * @returns {Promise<number>}
 */
async function getMaxPages() {
    let totalUsers = await getAllUsersAsync();
    let totalPages = Math.ceil(totalUsers.length / 8);

    document.getElementById("pages").innerHTML = "\\" + totalPages;
    return totalPages;
}

// Gets the current tab of the table
function getCurrentPage() {
    return parseInt(document.getElementById("page").value);
}

/**
 * Opens the delete dialog for deleting an user.
 *
 * @param userId - id of the 'to delete' user
 * @returns {Promise<void>}
 */
async function openDeleteDialog(userId) {
    const user = await getUserByIdAsync(userId);
    document.getElementById("deleteDialog").style.display = 'block';

    document.getElementById("deleteUser").addEventListener("click", async function () {
        const controlInput = document.getElementById("controlUsername").value;

        if (controlInput === user.name) {
            await deleteUserById(userId);
            location.reload();
        }
    });

}

// Closes the dialog
function closeDeleteDialog() {
    document.getElementById("deleteDialog").style.display = 'none';
}

/**
 * Updates the user with the updated data from the edit modal.
 *
 * @param userId - id of the to edit user.
 * @returns {Promise<void>}
 */
async function updateUser(userId) {
    const name = document.getElementById("name").value;
    const birthDate = document.getElementById("birthDate").value;
    const bio = document.getElementById("bio").value;
    const email = document.getElementById("email").value;

    const columns = ['name', 'bio', 'birthDate', 'email'];
    await sqlUpdateAsync("account", columns, [name, bio, birthDate, email], userId);
}

/**
 * Opens the edit dialog on the specified user.
 *
 * @param userId - id of the to edit user.
 * @returns {Promise<void>}
 */
async function openEditDialog(userId) {
    document.getElementById("editDialog").style.display = 'flex';
    const user = await getUserByIdAsync(userId);

    document.getElementById("userImage").src = user.profilePhoto;
    document.getElementById("name").value = user.name;
    document.getElementById("birthDate").value = await stripTimeFromDate(user.birthdate);
    document.getElementById("bio").value = user.bio;
    document.getElementById("email").value = user.email;

    const selectBox = document.getElementById("userType");
    if(user.usertypeFk === 1) {
        selectBox.options[1].selected = true;
    } else if (user.usertypeFk === 2){
        selectBox.options[0].selected = true;
    }

    document.getElementById("save-button").addEventListener("click", async function() {
        await updateUser(userId);
        location.reload();
    });

    document.getElementById("defaultBtn").addEventListener("click", async function () {
        const userPhotoId = user.name.replace(/\s+/g, '+').toLowerCase();
        const profilePhoto = `https://ui-avatars.com/api/?name=${userPhotoId}?background=random`;
        await sqlUpdateAsync("account", ['profilePhoto'], [profilePhoto], userId);
    });
}

function closeEditDialog() {
    document.getElementById("editDialog").style.display = 'none';
}

/**
 * This function builds the table based on arrays filled with user objects.
 *
 * @returns {Promise<void>}
 */
async function loadTable() {
    // Clear the table first for changes!
    document.getElementById("tableArray").innerHTML = "";

    // Create array (8) with users.
    let splittedUsers = await splitArray(await getAllUsersAsync());
    let cellArray = [];

    // minus one bc arrays start at 0!
    let currentTab = getCurrentPage() - 1;

    const header = `
            <thead>
                <tr>
                    <th>Naam</th>
                    <th>Email</th>
                    <th>Woonplaats</th>
                    <th>Opties</th>
                </tr>
            </thead>`.replace(/\n/g, '');

    cellArray.push(header);

    // Insert rows into table with relavant data of the user.
    for (let i = 0; i < splittedUsers[currentTab].length; i++) {
        const user = splittedUsers[currentTab][i];

        let html = `<tr> 
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                        <td>${user.location}</td>
                        <td>
                            <button class="edit-button" onclick="openEditDialog(${user.id})">Edit</button>
                            <button class="delete-button" onclick="openDeleteDialog(${user.id})">Delete</button>
                        </td>
                    </tr>`.replace(/\n/g, '');

        cellArray.push(html);
    }

    // Inserts the created html
    for(let i=0; i<cellArray.length; i++) {
        document.getElementById("tableArray").innerHTML += cellArray[i];
    }

}

/**
 * Splits one big array in array of array's with the specified size ( default 8);
 *
 * @param array - array to split
 * @param amountPerArray - Size of the arrays (default 8)
 */
async function splitArray(array, amountPerArray = 8) {
    let splittedArray = [];

    while(array.length > 0) {
        splittedArray.push(array.splice(0, amountPerArray));
    }

    return splittedArray;
}
