import * as module from './profanity-filter.js';

document.addEventListener('DOMContentLoaded', async function () {
    if (FYSCloud.Session.get('loggedin')) {
        const userSession = FYSCloud.Session.get('loggedin');
        const detailChatBox = document.querySelector('#detail-chat-box');
        const chatBox = document.querySelector('#main-chat-box');

        const template = document.querySelector('#chat-template').innerHTML;
        const requestsMainTemplate = document.querySelector('#requests-template').innerHTML;
        const messageMainTemplate = document.querySelector('#message-template').innerHTML;
        const blockedUserMainTemplate = document.querySelector('#blocked-user-template').innerHTML;

        document.querySelector('.profile-photo').src = userSession[0].profilePhoto;

        //Adds the match requests in the requests tab/view
        await addRequests();

        //Adds the blocked users in the main tab/view
        await addBlockedUsers();
        
        //Adds the contacts in the main tab/view
        await addContacts();
 
        async function addContacts(){
            const userChatContact = await getUserMatches(userSession[0].id, userSession[0].email);

            function removeChats(parent) {
                while (parent.firstChild) {
                    parent.removeChild(parent.firstChild);
                }
            }
            
            const messagesList = document.querySelector('.chat-list');
            removeChats(messagesList);

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
            
                //Hides block button when user clicks outside
                window.addEventListener('click', function() {
                    document.querySelectorAll('.chat-list li').forEach(function(item) {
                        item.querySelector('.contact-dropdown-content').style.display = 'none';
                    });
                });

                // Looping through all the `contact options` [block user]
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
                                    button.addEventListener('click', async () => {
                                        const userId = +button.dataset.id;
                                        await updatePendingRequests('blocked', userSession[0].id, userId);                                         
                                        await addBlockedUsers();
                                    });         
                                });
                            }else{
                                childDiv.style.display = 'none';    
                            }
                        });
                    });
                });

                //When user clicks on a chat from the list it will show the detailed message box
                chatTemplate.addEventListener('click', async function (e) {
                    const recieverId = this.dataset.id;
                    const recieverData = await getReciever(recieverId);
                    let inputRecieverId = document.forms['chat-form']['hidden-id'];
                    
                    inputRecieverId.dataset.id = recieverId;

                    function removeChats(parent) {
                        while (parent.firstChild) {
                            parent.removeChild(parent.firstChild);
                        }
                    }
                    
                    const messagesList = document.querySelector('.messages-list');
                    removeChats(messagesList);
                    
                    await addMessages(recieverId);
                    
                    document.querySelector('.chat-content').scrollTo(0, document.querySelector('.chat-content').scrollHeight);
                    
                    //When clicking on a chat from the list it will hide the chatlist and show the detailed chat
                    detailChatBox.classList.add('show-chat');
                    detailChatBox.classList.remove('hide-chat');
                    chatBox.classList.add('hide-chat');
                    chatBox.classList.remove('show-chat');
                    
                    //adding name and profile photo of the reciever in the detail message box
                    document.querySelector('.detail-chat-header').innerHTML = recieverData[0].name;
                    document.querySelector('.detail-chat-photo').src = recieverData[0].profilePhoto;

                    document.querySelector('.detail-chat-photo').addEventListener('click', function () {
                        FYSCloud.URL.redirect("profile.html", {
                            profileid: recieverData[0].id
                        });
                    });
                });
            }
        }

        document.querySelector('.chat-form').addEventListener('submit', async function(e){
            //preventing the refresh action from the form
            e.preventDefault();
            
            let message = document.forms['chat-form']['msg-input'].value;
            let inputRecieverId = document.forms['chat-form']['hidden-id'];

            
            if(message == ''){
                document.querySelector('.error-box').style.display = 'flex';
                document.querySelector('.error-msg').innerHTML = 'Field is empty';
            }else{
                document.querySelector('.error-box').style.display = 'none';
                //Using the function censorProfanity in `profanity-filter.js` to censor words before the insert
                message = module.censorProfanity(message);
                await insertMessage(userSession[0].id, inputRecieverId.dataset.id, message);
                document.querySelector('.chat-form').reset();
                await addMessages(inputRecieverId.dataset.id);
            }
        });
           
        //adds the blocked user to the contactlist tab/view
        async function addBlockedUsers(){
            const blockedUsers = await getBlockedUsers(userSession[0].id);

            function removeBlockedUsers(parent) {
                while (parent.firstChild) {
                    parent.removeChild(parent.firstChild);
                }
            }
            
            const blockedUsersList = document.querySelector('.blocked-list');
            removeBlockedUsers(blockedUsersList);

            for (let i = 0; i < blockedUsers.length; i++) {
                const blockedUserTemplate = FYSCloud.Utils.parseHtml(blockedUserMainTemplate)[0];
                const blockedUser = blockedUsers[i];
    
                blockedUserTemplate.querySelector('.unblock-btn').dataset.id = blockedUser.id;

                blockedUserTemplate.querySelector('.request-profile-pic').src = blockedUser.profilePhoto;
                blockedUserTemplate.querySelector('.request-title').innerHTML = blockedUser.name;

                document.querySelector('.blocked-list').appendChild(blockedUserTemplate);

                blockedUserTemplate.querySelector('.unblock-btn').addEventListener('click', async function () {
                    const userId = +blockedUserTemplate.querySelector('.unblock-btn').dataset.id;
                    await updatePendingRequests("accepted", userSession[0].id, userId); 
                    document.querySelector('.blocked-list').removeChild( blockedUserTemplate.querySelector('.unblock-btn').parentNode.parentNode);
                    await addContacts();
                });
            }

            await addContacts();
        }


        //Adds the matched requests to the chat requests tab/view
        async function addRequests(){
            const userRequests = await getPendingRequests(userSession[0].id, userSession[0].email);

            function removeRequests(parent) {
                while (parent.firstChild) {
                    parent.removeChild(parent.firstChild);
                }
            }
            
            const messagesList = document.querySelector('.requests-list');
            removeRequests(messagesList);


            for (let i = 0; i < userRequests.length; i++) {
                const requestsTemplate = FYSCloud.Utils.parseHtml(requestsMainTemplate)[0];
                const chatRequests = userRequests[i];

                requestsTemplate.dataset.id = chatRequests.id;
                requestsTemplate.querySelector('.accept-request-btn').dataset.id = chatRequests.id;
                requestsTemplate.querySelector('.decline-request-btn').dataset.id = chatRequests.id;

                requestsTemplate.querySelector('.request-profile-pic').src = chatRequests.profilePhoto;
                requestsTemplate.querySelector('.request-title').innerHTML = chatRequests.name;

                document.querySelector('.requests-list').appendChild(requestsTemplate);

                /*
                    When user accepts the match the program calls the `updatePendingRequests` function and 
                    updates the field `status` in the DB to accepted
                */
                requestsTemplate.querySelector('.accept-request-btn').addEventListener('click', async function () {
                    const userId = +requestsTemplate.querySelector('.accept-request-btn').dataset.id;
                    await updatePendingRequests("accepted", userSession[0].id, userId ); 
                    await addRequests();
                });

                /*
                    When user declines the match the program calls the `updatePendingRequests` function and 
                    updates the field `status` in the DB to declined
                */
                requestsTemplate.querySelector('.decline-request-btn').addEventListener('click', async function () {
                    const userId = +requestsTemplate.querySelector('.accept-request-btn').dataset.id;
                    await updatePendingRequests("declined", userSession[0].id, userId ); 
                    await addRequests();
                });

                

            }
        }

        //Adds the messages when user inserts a message or when user loads the chat
        async function addMessages(recieverId){
            const currentUser = await getUserMessages(userSession[0].id, recieverId);
            const recipientUser =  await getUserMessages(recieverId, userSession[0].id);
            const array = [currentUser, recipientUser];
            const arrayDate = [];


            function removeMessages(parent) {
                while (parent.firstChild) {
                    parent.removeChild(parent.firstChild);
                }
            }
            
            const messagesList = document.querySelector('.messages-list');
            removeMessages(messagesList);

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

            for (let i = 0; i < arrayChats.length; i++) {
                const message = arrayChats[i];

                const messageFullDatetime = new Date(message.createdAt);
                const messageConvertedTime = messageFullDatetime.toLocaleString();
                        
                const messageTemplate = FYSCloud.Utils.parseHtml(messageMainTemplate)[0];

                messageTemplate.dataset.id = message.id;

                message.recieverFk == userSession[0].id ? messageTemplate.className = 'left-chat' :
                    messageTemplate.className = 'right-chat';

                messageTemplate.querySelector('.messages-username').innerHTML = `${message.name}: `;
                messageTemplate.querySelector('.messages-time').innerHTML = messageConvertedTime;
                messageTemplate.querySelector('.messages-message').innerHTML = message.message;

                document.querySelector('.messages-list').appendChild(messageTemplate);

                document.querySelector('.chat-content').scrollTo(0, document.querySelector('.chat-content').scrollHeight);

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
                const query = FYSCloud.API.queryDatabase(
                    'INSERT INTO `messages` (id, senderFk, recieverFk, message) VALUES(NULL, ?, ?, ?);',[senderId, recieverId, message]
                );
                const results = await query;
                return await results;
            } catch (error) {
                console.log(error);
            }
        }

        /**
         *  Updates the status to accepted or declined
         * 
         * @param {int} userId 
         */
        async function updatePendingRequests(status, userId, matchedUserId){
            try {
                const query =  FYSCloud.API.queryDatabase(
                    "UPDATE matches SET status = ? WHERE currUserFk = ?  AND matchedUserFk = ?", 
                    [status, userId, matchedUserId]
                );
                const results = await query;
                return await results;
            } catch (error) {
                console.log(error);
            }
        }


        /**
         *  @param {int} userId 
         * @returns the match requests which are `pending`
         */
        async function getPendingRequests(userId, email){
            try {
                const query = FYSCloud.API.queryDatabase(
                    'SELECT * FROM matches ' +
                    'INNER JOIN account ' +
                    'ON matchedUserFk = account.id or currUserFk = account.id ' +
                    'WHERE (matchedUserFk = ? OR currUserFk = ?) AND email != ? AND status = "pending"', 
                    [userId, userId, email]
                );
                const results = await query;
                return await results;
            } catch (error) {
                console.log(error);
            }
        }

        async function getBlockedUsers(userId) {
            try {
                const query = FYSCloud.API.queryDatabase(
                    'SELECT * FROM matches ' + 
                    'INNER JOIN account ' +
                    'ON matchedUserFk = account.id ' +
                    'WHERE currUserFk = ? AND status="blocked"',
                    [userId]
                );
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
                const query = FYSCloud.API.queryDatabase(
                    'SELECT messages.id, account.name, messages.message, messages.recieverFk, messages.createdAt ' + 
                    'FROM messages ' +
                    'INNER JOIN account ' + 
                    'ON senderFk = account.id ' + 
                    'WHERE senderFk = ? AND recieverFk = ? ' +
                    'ORDER BY messages.createdAt;', 
                    [senderId, recieverId]
                );
                const results = await query;
                return await results;
            } catch (error) {
                console.log(error);
            }
        }


        /**
         * @param {int} userId
         * @returns JSON with messages which interacted with the current user
         */
        async function getUserMatches(userId, email){
            try {
                const query = FYSCloud.API.queryDatabase(
                    'SELECT * FROM matches ' + 
                    'INNER JOIN account ' + 
                    'ON matchedUserFk = account.id or currUserFk = account.id ' +
                    'WHERE (matchedUserFk = ? OR currUserFk = ?) AND email != ? AND status = "accepted"', 
                    [userId, userId, email]);
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


