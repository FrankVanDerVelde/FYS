async function checklang() {
    let lang = document.getElementById("langSelecter").value;

    await getTranslationLang(lang);
}


async function getTranslationLang(lang) {
    let json = await getJsonAsync();

    switch(lang) {
        case "nl":
            await translate(await json.langs.nl);
            break;
        case "en":
            await translate(await json.langs.en);
            break;
        case "du":
            await translate(await json.langs.du);
            break;
    }
}

async function translate(jsonLang) {
    const currentUrl = window.location;
    let changes = {};


    for (var i=0; i < await jsonLang.length; i++) {
        let url = "http://" + window.location.host + "/team-4/" + jsonLang[i].page + ".html";

        if(url == currentUrl)
        {
            changes[i] = jsonLang[i];
        }
    }
    updatePage(changes);
}

function updatePage(changes) {

    for(var i=0; i < Object.keys(changes).length; i++) {
        console.log("ID:" + changes[i].id );
        console.log("TEXT:" + changes[i].text );

        document.getElementById(changes[i].id).innerHTML = changes[i].text;
    }
}

async function getJsonAsync() {
    let res = await fetch('lang.json');

    return await res.json();
}