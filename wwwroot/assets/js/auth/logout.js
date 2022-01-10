document.querySelectorAll('.logout-btn').forEach(function(button) {
    button.addEventListener('click', () => {
        FYSCloud.Session.clear()
    })
});