if (FYSCloud.Session.get("loggedin")) {
    loadChat();

}else{
    document.querySelector("#chat-btn").style.visibility = "hidden";
}

async function loadChat(){
    //Add the chat modals to the page
    const chat = await FYSCloud.Utils.fetchAndParseHtml("../views/components/_chat.html");
    addChat(chat);

    function addChat(data) {
        const firstElement = data[0];
        document.querySelector("main").appendChild(firstElement);
    }

    document.querySelector("#chat-btn").style.visibility = "visible";
}



