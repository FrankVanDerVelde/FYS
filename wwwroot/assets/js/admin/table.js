window.onload = async function() {
    await getMaxPages();
}

function decrementPage() {
    let currentPage = document.getElementById("page").value;
    let newPage = currentPage - 1;
    if(newPage <= 0)
        newPage = 1;

    // getMaxPages()
    document.getElementById("page").value = newPage;
}

async function incrementPage() {
    let currentPage = document.getElementById("page").value;
    let newPage = Number(currentPage) + 1;
    if(newPage > await getMaxPages())
        newPage = await getMaxPages()

    // getMaxPages()
    document.getElementById("page").value = newPage;
}

async function getMaxPages() {
    let totalUsers = await getAllUsersAsync();

    let totalPages = Math.round(totalUsers.length / 8);


    document.getElementById("pages").innerHTML = "\\" + totalPages;
    return totalPages;
}

function openDeleteDialog() {
    document.getElementById("deleteDialog").style.display='block';
}

function closeDelelteDialog() {
    document.getElementById("deleteDialog").style.display='none';
}

function openEditDialog() {
    document.getElementById("editDialog").style.display='flex';
}

function closeEditDialog() {
    document.getElementById("editDialog").style.display='none';
}