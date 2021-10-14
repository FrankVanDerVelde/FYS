const showChatBtn = document.querySelector("#chat-btn");
const detailChatBox = document.querySelector("#detail-chat-box");
const chatBox = document.querySelector("#main-chat-box");
const closeChatBtn = document.querySelector(".close-chat");
const closeDetailChatBtn = document.querySelector(".close-detail-chat");
const chatPersonListItem = document.querySelectorAll(".message-list-item");
const goBackBtn = document.querySelector(".back-btn-chat");

// show chat modal on click button
showChatBtn.addEventListener("click", () => {
    chatBox.classList.remove("hide-chat");
    chatBox.classList.add("show-chat");
});

//on click person contact messages open detail message modal
for (let i = 0; i < chatPersonListItem.length; i++) {
    chatPersonListItem[i].addEventListener("click", function() {
        detailChatBox.classList.add("show-chat");
        detailChatBox.classList.remove("hide-chat");
        chatBox.classList.add("hide-chat");
        chatBox.classList.remove("show-chat");
    });
}

// go from detail chat modal to overview contacts messages
goBackBtn.addEventListener("click", () => {
    detailChatBox.classList.remove("show-chat");
    chatBox.classList.remove("hide-chat");
    chatBox.classList.add("show-chat");
});

closeChatBtn.addEventListener("click", () => {
    chatBox.classList.remove("show-chat");
    chatBox.classList.add("hide-chat");
});

closeDetailChatBtn.addEventListener("click", () => {
    detailChatBox.classList.remove("show-chat");
    detailChatBox.classList.add("hide-chat");
});


// check device, if phone make modal width 100%
const checkdevice =  () => {
    const isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;
    if (isMobile) {
        chatBox.style.width = "100%";
        detailChatBox.style.width = "100%";
    } else {
        chatBox.style.width = "360px";
        detailChatBox.style.width = "360px";
    }
}

checkdevice();
// on resize add checkdevice fucntion
window.addEventListener("resize", checkdevice);
