function openFilter(button) {
    closeFilter(button.nextElementSibling, "dropdown-content-filter");

}


function openInterestFilter(button)
{
    closeFilter(button.nextElementSibling, "dropdown-content-filter-interests");
}


function openFilterList(button)
{

    var div = button.nextElementSibling;
   // closeFilter(button.nextElementSibling, "dropdown-content-filter-interests");
    for (let i = 0; i <div.children.length ; i++) {
        div.children[i].classList.toggle("active");

    }
}

function closeFilter(button, dropdown)
{
    const currentDropdown = button;
    var allDropdowns = document.getElementsByClassName(dropdown);
    var wantToClose = false;

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