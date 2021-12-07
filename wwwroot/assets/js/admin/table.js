window.onload = async function () {
    await getMaxPages();
    await loadTable();
}

async function decrementPage() {
    let currentPage = document.getElementById("page").value;
    let newPage = currentPage - 1;
    if (newPage <= 0)
        newPage = 1;

    // getMaxPages()
    document.getElementById("page").value = newPage;
    await loadTable();
}

async function incrementPage() {
    let currentPage = document.getElementById("page").value;
    let newPage = Number(currentPage) + 1;
    if (newPage > await getMaxPages())
        newPage = await getMaxPages()

    // getMaxPages()
    document.getElementById("page").value = newPage;
    await loadTable();
}

async function getMaxPages() {
    let totalUsers = await getAllUsersAsync();

    let totalPages = Math.ceil(totalUsers.length / 8);


    document.getElementById("pages").innerHTML = "\\" + totalPages;
    return totalPages;
}

function getCurrentPage() {
    return parseInt(document.getElementById("page").value);
}

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

function closeDeleteDialog() {
    document.getElementById("deleteDialog").style.display = 'none';
}

async function updateUser(userId) {
    const image = document.getElementById("userImage").src;
    const name = document.getElementById("name").value;
    const birthDate = document.getElementById("birthDate").value;
    const bio = document.getElementById("bio").value;
    const email = document.getElementById("email").value;

    const columns = ['name', 'bio', 'birthDate', 'email'];
    await sqlUpdateAsync("account", columns, [name, bio, birthDate, email], userId);
}

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
}

function closeEditDialog() {
    document.getElementById("editDialog").style.display = 'none';
}

async function loadTable() {
    // Clear the table first for changes!
    document.getElementById("tableArray").innerHTML = "";

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

    for(let i=0; i<cellArray.length; i++) {
        document.getElementById("tableArray").innerHTML += cellArray[i];
    }

}

async function splitArray(array, amountPerArray = 8) {
    let splittedArray = [];

    while(array.length > 0) {
        splittedArray.push(array.splice(0, amountPerArray));
    }

    return splittedArray;
}