import * as module from './profanity-filter.js';

window.addEventListener('load', async function () {
    if (FYSCloud.Session.get('loggedin')) {
        const userSession = FYSCloud.Session.get('loggedin');
        const detailChatBox = document.querySelector('#detail-chat-box');
        const chatBox = document.querySelector('#main-chat-box');
        const template = document.querySelector('#chat-template').innerHTML;
        const requestsMainTemplate = document.querySelector('#requests-template').innerHTML;

        //recieves the matches
        const userChatContact = await getUserMatches(userSession[0].id);

        const userRequests = await getPendingRequests(userSession[0].id);

        for (let i = 0; i < userRequests.length; i++) {
            const requestsTemplate = FYSCloud.Utils.parseHtml(requestsMainTemplate)[0];
            const chatRequests = userRequests[i];

            requestsTemplate.dataset.id = chatRequests.id;
            requestsTemplate.querySelector('.accept-request-btn').dataset.id = chatRequests.id;
            requestsTemplate.querySelector('.decline-request-btn').dataset.id = chatRequests.id;

            requestsTemplate.querySelector('.request-profile-pic').src = chatRequests.profilePhoto;
            requestsTemplate.querySelector('.request-title').innerHTML = chatRequests.name;

            document.querySelector('.requests-list').appendChild(requestsTemplate);
        }

        for (let i = 0; i < userChatContact.length; i++) {
            //Parsing the html template element for the contacts list
            const chatTemplate = FYSCloud.Utils.parseHtml(template)[0];
            const chatContacts = userChatContact[i];
            
            //Sets the id from chatContacts for the data-id of chatTemplate 
            chatTemplate.dataset.id = chatContacts.id;

            //Assigning the data from DB to the template attributes
            chatTemplate.querySelector('.message-profile-pic').src = chatContacts.profilePhoto;
            chatTemplate.querySelector('.chat-title').innerHTML = chatContacts.name;
            
            chatTemplate.querySelector('.contact-option').dataset.id = chatContacts.id;
            chatTemplate.querySelector('#chat-dropdown-options').dataset.id = chatContacts.id;
            chatTemplate.querySelector('.block-btn').dataset.id = chatContacts.id;

            //Appending child [chatTemplate] to [.chat-list]
            document.querySelector('.chat-list').appendChild(chatTemplate);
        
            // Looping through all the `contact options`
            document.querySelectorAll('.contact-option').forEach(function(parentDiv) {
                //Adding a click listenere to the parentDiv
                parentDiv.addEventListener('click', (event) => {
                    //Prevents that the `li` element also will be clicked
                    event.stopPropagation();
                    // Looping through all the `.contact-dropdown-content`
                    document.querySelectorAll('.contact-dropdown-content').forEach(function(childDiv) {
                        // If the date-id of parentDiv equals the data-id of childDiv, the display for childDiv will be set to `block`
                        if(parentDiv.dataset.id == childDiv.dataset.id){
                            childDiv.style.display = 'block'; 
                            document.querySelectorAll('.block-btn').forEach(function(button) {
                                button.addEventListener('click', () => {
                                    //Block user function
                                });         
                            });
                        }else{
                            childDiv.style.display = 'none';    
                        }
                    });
                });
            });
                
            //When user clicks on a chat from the list it will show the detailed message box
            chatTemplate.addEventListener('click', async function () {
                const recieverId = this.dataset.id;
                const currentUser = await getUserMessages(userSession[0].id, recieverId);
                const recipientUser =  await getUserMessages(recieverId, userSession[0].id);
                const recieverData = await getReciever(recieverId);
                const array = [currentUser, recipientUser];
                const arrayDate = [];
                let reciever = [];

                //Removes the `li` elements when new chat is opened
                function removeChats(parent) {
                    while (parent.firstChild) {
                        parent.removeChild(parent.firstChild);
                    }
                }
                
                const messagesList = document.querySelector('.messages-list');
                removeChats(messagesList);
                
                //Set recieverId value to hidden input [insert bug fix]
                document.querySelector('.hidden-input-id').value = recieverId;

                array.forEach(element => {
                    for (let i = 0; i < element.length; i++) {
                        arrayDate.push(element[i]);
                    }
                });
            
                //Sorting the recieved chat data on date
                const arrayChats = arrayDate.sort(function(a,b){
                    if (a.createdAt > b.createdAt) return 1;
                    if (a.createdAt < b.createdAt) return -1;
                    return 0;
                });

                //When clicking on a chat from the list it will hide the chatlist and show the detailed chat
                detailChatBox.classList.add('show-chat');
                detailChatBox.classList.remove('hide-chat');
                chatBox.classList.add('hide-chat');
                chatBox.classList.remove('show-chat');
      
                for (let i = 0; i < recieverData.length; i++) {
                    reciever = recieverData[i];
                }

                //Hide messages while switching contacts when users dont have messages between each other
                document.querySelectorAll('.messages-list li').forEach(function(element) {
                    if (element.getAttribute('data-sender') != null || element.getAttribute('data-reciever') != null) {
                        if (element.getAttribute('data-sender') != recieverId || element.getAttribute('data-reciever') != recieverId) {
                            element.style.display = 'none';
                        }
                    }
                });
                
                //adding name and profile photo of the reciever in the detail message box
                document.querySelector('.detail-chat-header').innerHTML = reciever.name;
                document.querySelector('.detail-chat-photo').src = reciever.profilePhoto;
                
                for (let i = 0; i < arrayChats.length; i++) {
                    const message = arrayChats[i];
                    let msgExists = false;

                    // Converting the message time to `toLocaleString`
                    const messageFullDatetime = new Date(message.createdAt);
                    const messageConvertedTime = messageFullDatetime.toLocaleString();
                    
                    //checks on duplicate data in detailed chat
                    document.querySelectorAll('li').forEach(function(element) {
                        if (element.getAttribute('data-id') != null) {
                            if (element.getAttribute('data-id') == `msg-${message.id}`) {
                                msgExists = true;
                            }
                        }
                    });

                    // If the message does not exists the program will add th chats as `li` elements based on current user and reciever
                    if (!msgExists) {
                        let msg = (message.recieverFk == userSession[0].id) ?
                            `<li class="left-chat" data-id="msg-${message.id}" data-sender="${userSession[0].id}"><p><b>${message.name}</b> :  
                            ${message.message} <p class="messages-time">${messageConvertedTime}</p></p></li>`:

                            `<li class="right-chat" data-id="msg-${message.id}" data-reciever="${recieverId}"><p><b>${message.name}</b> :  
                            ${message.message} <p class="messages-time">${messageConvertedTime}</p></p></li>`;
                        
                        // Adds the message to `.messages-list` (`ul` element)
                        document.querySelector('.messages-list').innerHTML += msg;
                    }
                }

                document.querySelector('.chat-form').addEventListener('submit', async function(e){
                    //preventing the refresh action from the form
                    e.preventDefault();
                    let message = document.forms['chat-form']['msg-input'].value;
                    let userId = document.querySelector('.hidden-input-id').value;
                    //Checking if the message is nt empty
                    if (message != '') {
                        // Using the function censorProfanity in `profanity-filter.js` to censor words before the insert
                        message = module.censorProfanity(message);
                        await insertMessage(userSession[0].id, userId, message);
                        document.querySelector('.chat-form').reset();
                    }
                });
            });
        }

        /*
         When user accepts the match the program calls the `updatePendingRequests` function and 
         updates the field `status` in the DB to accepted
        */
        document.querySelectorAll('.accept-request-btn').forEach(function(button) {
            button.addEventListener('click', async function () {
                await updatePendingRequests('accepted', userSession[0].id, button.dataset.id); 
            });
        });

        /*
         When user declines the match the program calls the `updatePendingRequests` function and 
         updates the field `status` in the DB to declined
        */
        document.querySelectorAll('.decline-request-btn').forEach(function(button) {
            button.addEventListener('click', async function () {
                await updatePendingRequests('declined', userSession[0].id, button.dataset.id); 
            });
        });


        /**
         * @param {int} userId 
         * @returns the matches from table `matches` which are pending
         */
        async function updatePendingRequests(status, userId, matchedUserId){
            try {
                const query = FYSCloud.API.queryDatabase(`UPDATE matches SET status = ? WHERE currUserFk = ?  AND matchedUserFk = ?`, [status, userId, matchedUserId]);
                const results = await query;
                return await results;
            } catch (error) {
                console.log(error);
            }
        }

        async function getPendingRequests(userId){
            try {
                const query = FYSCloud.API.queryDatabase(`SELECT * FROM matches INNER JOIN account ON matchedUserFk = account.id WHERE currUserFk = ? AND status = 'pending'`, [userId]);
                const results = await query;
                return await results;
            } catch (error) {
                console.log(error);
            }
        }
    
        /**
         * Function selects the user messages + account data where senderFk equals senderId and recieverFk equals recieverId
         * 
         * @param {int} senderId - id from the user who sent the message (current user)
         * @param {int} recieverId - id from the user who will reciever the message from current user (recipient)
         * @returns JSON with user message data from the database
         */
        async function getUserMessages(senderId, recieverId){
            try {
                const query = FYSCloud.API.queryDatabase(`SELECT messages.id, account.name, messages.message, messages.recieverFk, messages.createdAt FROM messages INNER JOIN account ON senderFk = account.id WHERE senderFk = ? AND recieverFk = ? ORDER BY messages.createdAt;`, [senderId, recieverId]);
                const results = await query;
                return await results;
            } catch (error) {
                console.log(error);
            }
        }


        /**
         *!TODO: Get users from matches

         * @param {int} userId
         * @returns JSON with messages which interacted with the current user
         */
        async function getUserMatches(userId){
            try {
                const query = FYSCloud.API.queryDatabase('SELECT * FROM matches INNER JOIN account ON matchedUserFk = account.id WHERE currUserFk = ? AND status = "accepted"', [userId]);
                const results = await query;
                return await results;
            } catch (error) {
                console.log(error);
            }
        }

        /**
         * Inserts the messages into table `messages`
         * 
         * @param {int} senderId
         * @param {int} recieverId
         * @param {string} message
         */
        async function insertMessage(senderId, recieverId, message){
            try {
                // const query = FYSCloud.API.queryDatabase('SELECT person.firstname, person.lastname, t1.id AS senderId, t2.profilePhoto, messages.message, t2.id as recieverId, t2.username AS reciever, t1.createdAt FROM messages INNER JOIN account t1 ON messages.senderFk = t1.id INNER JOIN account t2 ON messages.recieverFk = t2.id INNER JOIN person ON person.id = messages.recieverFk WHERE t2.id = ? OR t1.id = ?;', [userId, userId]);
                const query = FYSCloud.API.queryDatabase('INSERT INTO messages (id, senderFk, recieverFk, message, createdAt) VALUES(NULL, ?, ?, ?, CURRENT_TIMESTAMP())',[senderId, recieverId, message]);
                const results = await query;
                return await results;
            } catch (error) {
                console.log(error);
            }
        }

        /**
         * Function selects the data from table `account` where id equals the id from the chat reciever
         * 
         * @param {int} recieverId
         * @returns the data from message reciever
         */
        async function getReciever(recieverId){
            try {
                const query = FYSCloud.API.queryDatabase('SELECT * FROM account WHERE account.id = ?;', [recieverId]);
                const results = await query;
                return await results;
            } catch (error) {
                console.log(error);
            }
        }
    }
});


