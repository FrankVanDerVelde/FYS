async function checklang() {
    let lang = document.getElementById("langSelecter").value;

    await getTranslationLang(lang);
}


async function getTranslationLang(lang) {
    let json = await getJsonAsync();
    switch (lang) {
        case "nl":
            await translate(await json.langs.nl);
            break;
        case "en":
            await translate(await json.langs.en);
            break;
        case "de":
            await translate(await json.langs.de);
            break;
    }
}


/**
 * Fetches the corospondig array wit data of the current page.
 * 
 * @param {*} jsonLang - array with json data.
 */
async function translate(jsonLang) {
    const currentUrl = window.location;
    let changes = [];

    const currentPage = await getCurrentPageAsync();

    for (let i = 0; i < await jsonLang.length; i++) {

        if (currentPage == jsonLang[i].page) {
            changes.push(jsonLang[i]);
        }
    }
    updatePage(changes);
}

/**
 * Updates the page with the corosponding data.
 * 
 * @param {*} changes - changes to be made to current page
 */
function updatePage(changes) {
    for (let i = 0; i < Object.keys(changes).length; i++) {
        let toChangeItemArr = document.querySelectorAll(`#${changes[i].id}`);

        if (toChangeItemArr) {
            // Loop through NodeList and aply update based on above loopø

            for (let y = 0; y < toChangeItemArr.length; y++) {

                if (toChangeItemArr[y].tagName == "button") {
                    toChangeItemArr[y].textContent = changes[i].text;
                } else {
                    toChangeItemArr[y].innerHTML = changes[i].text;
                }
            }
        }
    }
}

/**
 * Add the page here that needs to be able to be chagned.
 * This functions fetches the json from the app.
 * 
 * @returns 
 */
async function getJsonAsync() {
    let uri = "";

    switch (await getCurrentPageAsync()) {
        case "index.html":
            uri = "assets/lang.json";
            break;
        case "about.html":
        case "matches.html":
        case "profile-edit.html":
        case "profile.html":
        case "contact.html":
            uri = "../lang.json";
            break;
    }

    let res = await fetch(uri);

    return await res.json();
}

/**
 * Helper for geting current page.
 * @returns 
 */
async function getCurrentPageAsync() {
    const path = window.location.pathname;
    const page = path.split("/").pop();

    return page;
}