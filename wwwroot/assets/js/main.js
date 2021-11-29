document.addEventListener("DOMContentLoaded", async function () {
    if (FYSCloud.Session.get("loggedin")) {
        //Add the chat modals to the page if session is set
        const chat = await FYSCloud.Utils.fetchAndParseHtml("../views/components/_chat.html");
        addChat(chat);

        function addChat(data) {
            const firstElement = data[0];

            document.querySelector("main").appendChild(firstElement);
        }

        //Adds the chat visibilty toggle button to the page if session is set
        const button = await FYSCloud.Utils.fetchAndParseHtml("../views/components/_chat-button.html");
        addChatButton(button);

        function addChatButton(data) {
            const firstElement = data[0];

            document.querySelector("main").appendChild(firstElement);
        }
    }
});
