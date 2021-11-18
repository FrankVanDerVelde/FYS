function decrementPage() {
    let currentPage = document.getElementById("page").value;
    let newPage = currentPage - 1;
    if(newPage <= 0)
        newPage = 1;

    // getMaxPages()
    document.getElementById("page").value = newPage;
}

function incrementPage() {
    let currentPage = document.getElementById("page").value;
    let newPage = Number(currentPage) + 1;
    if(newPage > getMaxPages())
        newPage = getMaxPages()

    // getMaxPages()
    document.getElementById("page").value = newPage;
}

function getMaxPages() {
    // let totalUsers = getTotalUsersAsync();  Needs to be implemented
    let totalUsers = 40;
    let totalPages = totalUsers / 8;

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