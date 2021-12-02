document.addEventListener("DOMContentLoaded", async function () {
    // if (FYSCloud.Session.get("loggedin")) {

    //Getting the whole [#chat-template] html piece
    const template = document.querySelector("#chat-template").innerHTML;
    const userChatContact = await getHistoryList(1);

    // TODO: Group the chats instead of seperates tabs
    for (let i = 0; i < userChatContact.length; i++) {
        const chatTemplate = FYSCloud.Utils.parseHtml(template)[0];
        const chatContacts = userChatContact[i];

        //Assigning the data from DB to the html innerHTML
        chatTemplate.querySelector(".message-profile-pic").src = chatContacts.profilePhoto;
        chatTemplate.querySelector(".chat-title").innerHTML = `${chatContacts.firstname} ${chatContacts.lastname}`;

        //Appending child [chatTemplate] to [.chat-list]
        document.querySelector(".chat-list").appendChild(chatTemplate);

        //When user clicks on a chat from the list it will show the detailed message box
        chatTemplate.addEventListener("click", async function () {
            const recieverId = chatContacts.id;
            const currentUser = await getUserMessages(1, recieverId);
            const recipientUser =  await getUserMessages(recieverId, 1);
            const recieverData = await getReciever(recieverId);
            let reciever = [];
            const array = [currentUser, recipientUser];
            const arrayDate = [];

            array.forEach(element => {
                for (let i = 0; i < element.length; i++) {
                    arrayDate.push(element[i]);
                }
            });

            const arrayChats = arrayDate.sort(function(a,b){
                if (a.createdAt > b.createdAt) return 1;
                if (a.createdAt < b.createdAt) return -1;
                return 0;
            });

            //When clicking on a chat from the list it will hide the chatlist and show the detailed chat
            detailChatBox.classList.add("show-chat");
            detailChatBox.classList.remove("hide-chat");
            chatBox.classList.add("hide-chat");
            chatBox.classList.remove("show-chat");

            for (let i = 0; i < recieverData.length; i++) {
                reciever = recieverData[i];
            }

            //Hide messages while switching contacts when users dont have messages between each other
            document.querySelectorAll(".messages-list li").forEach(function(element) {
                if (element.getAttribute('data-sender') != null || element.getAttribute('data-reciever') != null) {
                    if (element.getAttribute('data-sender') != recieverId || element.getAttribute('data-reciever') != recieverId) {
                        element.style.display = "none";
                    }
                }
            });

            //adding name and profile photo of the recipient in the detail message box
            document.querySelector(".detail-chat-header").innerHTML = reciever.firstname;
            document.querySelector(".detail-chat-photo").src = reciever.profilePhoto;

            for (let i = 0; i < arrayChats.length; i++) {
                const message = arrayChats[i];
                let msgExists = false;

                document.querySelectorAll(".left-chat").forEach(function(element) {
                    if (element.getAttribute('data-sender') != null) {
                        if (element.getAttribute('data-sender') != recieverId) {
                            element.style.display = "none";
                        }else{
                            element.style.display = "inline-block";
                        }
                    }
                });

                document.querySelectorAll(".right-chat").forEach(function(element) {
                    if (element.getAttribute('data-reciever') != null) {
                        console.log(reciever.id);
                        if (element.getAttribute('data-reciever') !=  recieverId) {
                            element.style.display = "none";
                        }else{
                            element.style.display = "block";
                        }
                    }
                });

                //checks on duplicate data in detailed chat
                document.querySelectorAll("li").forEach(function(element) {
                    if (element.getAttribute('data-id') != null) {
                        if (element.getAttribute('data-id') == `msg-${message.id}`) {
                            msgExists = true;
                        }
                    }
                });

                if (!msgExists) {
                    const msg = (message.recieverFk == 1) ?
                        `<li class="left-chat" data-id="msg-${message.id}" data-sender="${recieverId}"><p><b>${message.username}</b> :  ${message.message}</p></li>`:
                        `<li class="right-chat" data-id="msg-${message.id}" data-reciever="${message.recieverFk}"><p><b>${message.username}</b> :  ${message.message}</p></li>`;

                    document.querySelector(".messages-list").innerHTML += msg;
                }
            }
        });
    }


    /**
     *
     * @param {int} senderId - id from the user who sent the message (current user)
     * @param {int} recieverId - id from the user who will reciever the message from current user (recipient)
     * @returns JSON with user message data from the database
     */
    async function getUserMessages(senderId, recieverId){
        try {
            const query = FYSCloud.API.queryDatabase("SELECT messages.id, account.username, messages.message, messages.recieverFk, messages.createdAt FROM messages INNER JOIN account ON senderFk = account.id WHERE senderFk = ? AND recieverFk = ? ORDER BY messages.createdAt;", [senderId, recieverId]);
            const results = await query;
            return await results;
        } catch (error) {
            console.log(error);
        }
    }

    /**
     *
     * @param {int} userId
     * @returns JSON with messages which interacted with the current user
     */
    async function getHistoryList(userId){
        try {
            // const query = FYSCloud.API.queryDatabase("SELECT person.firstname, person.lastname, t1.id AS senderId, t2.profilePhoto, messages.message, t2.id as recieverId, t2.username AS reciever, t1.createdAt FROM messages INNER JOIN account t1 ON messages.senderFk = t1.id INNER JOIN account t2 ON messages.recieverFk = t2.id INNER JOIN person ON person.id = messages.recieverFk WHERE t2.id = ? OR t1.id = ?;", [userId, userId]);
            const query = FYSCloud.API.queryDatabase("SELECT * FROM account INNER JOIN person ON person.accountFk = account.id");
            const results = await query;
            return await results;
        } catch (error) {
            console.log(error);
        }
    }

    async function getReciever(recieverId){
        try {
            const query = FYSCloud.API.queryDatabase("SELECT * FROM person INNER JOIN account ON person.accountFk = account.id WHERE account.id = ?;", [recieverId]);
            const results = await query;
            return await results;
        } catch (error) {
            console.log(error);
        }
    }

    // }
});
