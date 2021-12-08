if (FYSCloud.Session.get("loggedin")) {
    loadChat();

}else{
    document.querySelector("#chat-btn").style.visibility = "hidden";
}

async function loadChat(){
    const urlSplitted = window.location.href.split("/"); 
    const checkFilename = urlSplitted.includes('index.html');
    let chat;

    if (checkFilename) {
         chat = await FYSCloud.Utils.fetchAndParseHtml("assets/views/components/_chat.html");
    }else{
        chat = await FYSCloud.Utils.fetchAndParseHtml("../views/components/_chat.html");
    }

    //Add the chat modals to the page
    addChat(chat);

    function addChat(data) {
        const firstElement = data[0];
        document.querySelector("main").appendChild(firstElement);
    }

    document.querySelector("#chat-btn").style.visibility = "visible";
}



