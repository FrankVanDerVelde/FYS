document.addEventListener('DOMContentLoaded', async function () {
    if (FYSCloud.Session.get('loggedin')) {
        const detailChatBox = document.querySelector('#detail-chat-box');
        const chatBox = document.querySelector('#main-chat-box');
        const chatList = document.querySelector('.chat-list');
        const requestList = document.querySelector('.requests-list');
        const blockedList = document.querySelector('.blocked-list');

        
        // show chat modal on click button
        document.querySelector('#chat-btn').addEventListener('click', () => {
            chatBox.classList.remove('hide-chat');
            chatBox.classList.add('show-chat');
        });
    
        // go from detail chat modal to overview contacts messages
        document.querySelector('.back-btn-chat').addEventListener('click', () => {
            detailChatBox.classList.remove('show-chat');
            chatBox.classList.remove('hide-chat');
            chatBox.classList.add('show-chat');
        });

        document.querySelector('.requests-btn').addEventListener('click', () => {
            document.querySelector('.chat-header-title').innerHTML = 'Verzoeken';
            chatList.classList.add('hide-tab');
            blockedList.classList.add('hide-tab');
            requestList.classList.add('show-tab');
        });

        document.querySelector('.contacts-btn').addEventListener('click', () => {
            document.querySelector('.chat-header-title').innerHTML = 'Contacten';
            chatList.classList.remove('hide-tab');
            blockedList.classList.add('show-tab');
            requestList.classList.remove('show-tab');
        });

        document.querySelector('.close-chat').addEventListener('click', () => {
            chatBox.classList.remove('show-chat');
            chatBox.classList.add('hide-chat');
        });

        document.querySelector('.close-detail-chat').addEventListener('click', () => {
            detailChatBox.classList.remove('show-chat');
            detailChatBox.classList.add('hide-chat');
        });


        
        // check device, if phone make modal width 100%
        const checkdevice =  () => {
            const isMobile = window.matchMedia('only screen and (max-width: 760px)').matches;
            if (isMobile) {
                chatBox.style.width = '100%';
                detailChatBox.style.width = '100%';
            } else {
                chatBox.style.width = '360px';
                detailChatBox.style.width = '360px';
            }
        }

        checkdevice();
        // on resize add checkdevice function
        window.addEventListener('resize', checkdevice);
    }

});

