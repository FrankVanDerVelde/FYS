const toggleBtn = document.querySelector("#toggle-btn");
const navList = document.querySelector("#nav-list");
const dropdownBtn = document.querySelector(".drop-btn");
const dropdown = document.querySelector("#dropdown-content");
const themeSwitch = document.querySelector("#checkbox");
let ball = document.querySelector(".ball");
let theme = localStorage.getItem("data-theme");

toggleBtn.addEventListener("click", () => {
    navList.classList.toggle("active-menu");
    navList.classList.toggle("animation");
});

themeSwitch.addEventListener("change", () => {
    resetTheme();
});

//Darkmode
if (theme === "dark-theme"){
    document.body.classList.add("dark-theme");
    document.body.classList.remove("light-theme");
    ball.style.transform = "translateX(20px)";
}else{
    document.body.classList.add("light-theme");
    document.body.classList.remove("dark-theme");
}

function resetTheme() {
    if (themeSwitch.checked) {
        document.body.classList.add("dark-theme")
        document.body.classList.remove("light-theme");
        localStorage.setItem("data-theme", "dark-theme");
        ball.style.transform = "translateX(20px)";
    } else {
        document.body.classList.add("light-theme");
        document.body.classList.remove("dark-theme")
        localStorage.setItem("data-theme", "light-theme");
        ball.style.transform = "translateX(0px)";
    }
}

//Dropdown arrows
dropdownBtn.addEventListener("click", () => {
    dropdown.classList.toggle("show");
    document.querySelector(".fa-caret-down").classList.toggle("hide");
    document.querySelector(".fa-caret-up").classList.toggle("show");
});