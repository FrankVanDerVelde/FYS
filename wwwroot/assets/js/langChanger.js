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

async function translate(jsonLang) {
    const currentUrl = window.location;
    let changes = [];

    const currentPage = await getCurrentPageAsync();

    for (var i = 0; i < await jsonLang.length; i++) {
        // let url = "http://" + window.location.host + "/team-4-new/wwwroot/" + jsonLang[i].page + ".html";
        // console.log(url);
        // console.log(currentUrl);
        // // if (url == currentUrl) {
        //     changes[i] = jsonLang[i];
        // // }

        if(currentPage == jsonLang[i].page)
        {
            changes.push(jsonLang[i]);
            // changes[i] = jsonLang[i];
        }
    }
    await updatePage(changes);
}

async function updatePage(changes) {

    for (var i = 0; i < Object.keys(changes).length; i++) {
        console.log(`ID: ${changes[i].id}`);
        console.log(`TEXT: ${changes[i].text}`);

        document.getElementById(changes[i].id).innerHTML = changes[i].text;
    }
}

async function getJsonAsync() {
    let uri = "";

    switch (await getCurrentPageAsync()) {
        case "index.html":
            uri = "assets/lang.json";
            break;
        case "about.html":
        case "matches.html":
        case "contact.html":
            uri = "../lang.json";
            break;
    }
    let res = await fetch(uri);

    return await res.json();
}

async function getCurrentPageAsync() {
    const path = window.location.pathname;
    const page = path.split("/").pop();

    return page;
}