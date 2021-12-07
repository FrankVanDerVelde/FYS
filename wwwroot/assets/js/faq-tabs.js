const acc = document.getElementsByClassName("tab-header");

for (let i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {

        //voegt en verwijderd de active class aan een tab
        this.classList.toggle("active");

        //constante voor het object onder de header van een FAQ tab
        const tab = this.nextElementSibling;

        //als er op gedrukt wordt verbergt die/opent die.
        if (tab.style.display === "block") {
            tab.style.display = "none";
        } else {
            tab.style.display = "block";
        }
    });
}