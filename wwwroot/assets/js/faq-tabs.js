const acc = document.getElementsByClassName("tab-header");

for (let i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
        /* Toggle between adding and removing the "active" class,
        to highlight the button that controls the panel */
        this.classList.toggle("active");

        /* Toggle between hiding and showing the active panel */
        const tab = this.nextElementSibling;
        if (tab.style.display === "block") {
            tab.style.display = "none";
        } else {
            tab.style.display = "block";
        }
    });
}