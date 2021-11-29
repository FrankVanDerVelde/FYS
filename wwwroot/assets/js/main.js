document.addEventListener("DOMContentLoaded", async function () {
    if (FYSCloud.Session.get("loggedin")) {
        // const button = await FYSCloud.Utils.fetchAndParseHtml("../views/components/_chat-button.html");
        // addChatButton(button);

        //Add the chat modals to the page
        const chat = await FYSCloud.Utils.fetchAndParseHtml("../views/components/_chat.html");
        addChat(chat);

        // function addChatButton(data) {
        //     const firstElement = data[0];
        //     document.querySelector("main").insertBefore(firstElement, document.querySelector("main").firstChild);
        // }

        function addChat(data) {
            const firstElement = data[0];
            document.querySelector("main").appendChild(firstElement);
        }

        document.querySelector("#chat-btn").style.visibility = "visible";

     
    }
});

