
document.querySelector('.logout-btn').addEventListener('click', () => {
    //de session wordt verwijderd.
    FYSCloud.Session.clear()

    //ga naar de home pagina
    window.location.replace("../../../index.html");

})