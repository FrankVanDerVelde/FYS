function openFilter(button) {

    const currentDropdown = button.nextElementSibling;
    var allDropdowns = document.getElementsByClassName("dropdown-content-filter");
    var closeFilter = false;

    for (let i = 0; i < allDropdowns.length; i++) {
        if (allDropdowns[i].classList.contains("active")) {
            if (currentDropdown === allDropdowns[i]) {
                closeFilter = true;
            }
            allDropdowns[i].classList.toggle("active");
        }
    }
    if (closeFilter === false) {
        currentDropdown.classList.toggle("active");

    }
}


function openInterestFilter(button)
{
    const currentDropdown = button.nextElementSibling;
    var allDropdowns = document.getElementsByClassName("dropdown-content-filter-interests");
    var closeFilter = false;

    for (let i = 0; i < allDropdowns.length; i++) {
        if (allDropdowns[i].classList.contains("active")) {
            if (currentDropdown === allDropdowns[i]) {
                closeFilter = true;
            }
            allDropdowns[i].classList.toggle("active");
        }
    }
    if (closeFilter === false) {
        currentDropdown.classList.toggle("active");

    }
}