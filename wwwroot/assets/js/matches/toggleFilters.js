function openFilter(button) {
    closeFilter(button.nextElementSibling, "dropdown-content-filter");

}


function openInterestFilter(button)
{
    closeFilter(button.nextElementSibling, "dropdown-content-filter-interests");
}


function openFilterList(button)
{

    let div = document.getElementsByClassName("allFilters")[0];
    if (div.style.display !== 'none') {
        div.style.display = 'none';
    }
    else {
        div.style.display = 'flex';
    }
}

function closeFilter(button, dropdown)
{
    const currentDropdown = button;
    let allDropdowns = document.getElementsByClassName(dropdown);
    let wantToClose = false;

    for (let i = 0; i < allDropdowns.length; i++) {
        if (allDropdowns[i].classList.contains("active")) {
            if (currentDropdown === allDropdowns[i]) {
                wantToClose = true;
            }
            allDropdowns[i].classList.toggle("active");
        }
    }
    if (wantToClose === false) {
        currentDropdown.classList.toggle("active");

    }
}