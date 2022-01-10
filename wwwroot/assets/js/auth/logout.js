document.querySelectorAll('.logout-btn').forEach(function(button) {
    button.addEventListener('click', () => {
        FYSCloud.Session.clear()

        window.location.replace("../../../index.html");
    })
});