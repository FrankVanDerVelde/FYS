const showChatBtn = document.querySelector("#chat-btn");
const chatBox = document.querySelector("#main-chat-box");
const closeChatBtn = document.querySelector("#close-chat");

showChatBtn.addEventListener("click", () => {
    chatBox.classList.remove("hide-chat");
    chatBox.classList.add("show-chat");
});

closeChatBtn.addEventListener("click", () => {
    chatBox.classList.remove("show-chat");
    chatBox.classList.add("hide-chat");
});

const checkdevice =  () => {
    const isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;
    if (isMobile) {
        chatBox.style.width = "100%";
    } else {
        chatBox.style.width = "360px";
    }
}

checkdevice();
window.addEventListener("resize", checkdevice);
