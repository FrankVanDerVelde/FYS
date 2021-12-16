//document.addEventListener('DOMContentLoaded', async function () {

var skeletonCard = document.getElementsByClassName("col")[0];
var baseCard = document.getElementsByClassName("col")[1];

baseCard.remove();

var remainder = 0;
var amountOfActiveCards = 3;
var amountOfWantCreateCards = 0;
var userCountLeftToCreate = 0;
var amountOfRows = 1;
var maxAmount = 9;

var wantedUsers = {};
var thisUserID = 0;
const targetNode = document.getElementsByClassName('toegepaste-filters')[0];
var thisInterestList = [];

//check for mutations in div.
function MutationObersver() {

    // Options for the observer (which mutations to observe)

    const config = {attributes: true, childList: true, subtree: true};

// Callback function to execute when mutations are observed
    const callback = function (mutationsList, observer) {
        // Use traditional 'for loops' for IE 11
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                var selectedFilters = returnSelectedFilters();
                checkInterests(selectedFilters);
            }
        }
    };


// Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
    observer.observe(targetNode, config);
}

//inital set of values for people
initalSet();


//start observing
MutationObersver();

async function initalSet() {
    //get session
    let session = FYSCloud.Session.get('loggedin');
    if (session === null || session === undefined)
        return;

    // console.log(session);
    thisUserID = session[0].id;
    // thisUserID = 61;

    wantedUsers = await getAllUsers();

    if (wantedUsers !== undefined) {
        if (wantedUsers.length !== 0)
            shuffle(wantedUsers);


        //     console.log(wantedUsers);


        checkForOwnIDAndAdmin(wantedUsers);

        //set matches based on intrests
        await setBasedMatches(wantedUsers);


        userCountLeftToCreate = wantedUsers.length;
        var allCards = document.getElementsByClassName('col');
        amountOfActiveCards = allCards.length - 3;

        //set users under filter
        for (let i = 0; i < userCountLeftToCreate; i++) {
            if (amountOfActiveCards > 0 && userCountLeftToCreate > 0) {


                setPersonCards(allCards[i + 3], wantedUsers[i], false);
            }
        }
        document.getElementsByClassName("resultaten")[0].innerHTML = wantedUsers.length + " resultaten gevonden";
    }

}

function checkForOwnIDAndAdmin(wantedUsers) {
    for (let i = wantedUsers.length; i > 0; i--) {
        if (wantedUsers[i - 1].user.id === thisUserID) {
            const index = wantedUsers.indexOf(wantedUsers[i - 1]);
            if (index > -1) {
                wantedUsers.splice(index, 1);
            }
        } else if (wantedUsers[i - 1].user.usertypeFk === 1) {
            const index = wantedUsers.indexOf(wantedUsers[i - 1]);
            if (index > -1) {
                wantedUsers.splice(index, 1);
            }
        }
    }
}

async function setBasedMatches(wantedUsers) {
    if (thisUserID === 0)
        return;
    thisInterestList = await getUserIntrests(thisUserID);
    setBasedCards(wantedUsers, thisInterestList);
}

//check interests, checks given iterests fro mthe user and returns array of people
async function checkInterests(selectedFilters) {
    var gender = "";
    var age = "";
    var intrests = [];
    var selectedInterestFilter = false;
    for (let i = 0; i < selectedFilters.length; i++) {
        if (selectedFilters[i].parentNode.id === "gender") {
            gender = selectedFilters[i].innerHTML;

        } else if (selectedFilters[i].parentNode.id === "age") {
            age = selectedFilters[i].innerHTML;

        } else {
            intrests.push(selectedFilters[i].parentNode.children[0].innerHTML);
            selectedInterestFilter = true;
        }

    }

    if (age !== "" || gender !== "") {
        // console.log("db call with params");
        wantedUsers = await getUsersWithIntrests(age, gender);

    } else {
        //   console.log("db call all users");
        wantedUsers = await getAllUsers();

    }
    checkForOwnIDAndAdmin(wantedUsers);
    //creation and setting of elements.
    callCreateFunctions(wantedUsers, intrests, selectedInterestFilter);


}

//set cards based on your intresses.
function setBasedCards(wantedUsers, interests) {
    //get temp variable with the wanted users,
    var allCards = document.getElementsByClassName('col');
    console.log(allCards);

    //if no own interest set 3 random users 
    if (interests.length === 0) {
        for (let i = 0; i < 3; i++) {
            setPersonCards(allCards[i], wantedUsers[Math.floor(Math.random() * wantedUsers.length)].user, true);
        }
    } else {
        //else, copy wanted users
        var tempUsers = Array.from(wantedUsers);
        try {
            //loop through array, check if their interests arent 0 if so remove
            for (let i = tempUsers.length; i > 0; i--) {
                if (tempUsers[i - 1].userIntrests.length === 0) {
                    const index = tempUsers.indexOf(tempUsers[i - 1]);
                    if (index > -1) {
                        tempUsers.splice(index, 1);
                    }
                }
            }
        } catch (e) {
            console.log(e);
        }
        //loop through users with interest and if user 1 of the interests overlaps add a counter, do this for everyuser and every interest.
        var basedMatches = [];
        for (let i = 0; i < tempUsers.length; i++) {
            var matchingCount = 0;
            for (let j = 0; j < tempUsers[i].userIntrests.length; j++) {
                for (let k = 0; k < interests.length; k++) {
                    if (tempUsers[i].userIntrests[j] === interests[k]) {
                        matchingCount++;
                    }
                }
            }
            //push the users into the basedMatches
            const x = {user: tempUsers[i].user, matchingInterestCount: matchingCount};
            basedMatches.push(x);


        }
        //sort users based on matching interest count 
        basedMatches.sort((a, b) => {
            return a.matchingInterestCount - b.matchingInterestCount;
        });
        //reverse the array (array.sort sorts it from 0-1-2...etc)
        basedMatches.reverse();

        //set users 
        for (let i = 0; i < 3; i++) {
            setPersonCards(allCards[i], basedMatches[i].user, true);
        }
    }
}

function callCreateFunctions(wantedUsers, interest, selectedInterestFilter) {
    //set users left to create equal to the amount of users.
    userCountLeftToCreate = wantedUsers.length;

    shuffle(wantedUsers);

    //everytime someone updates remove all cards, -> to make it prettier, change so object just changes information. FASE 4!
    removeAllCards();


    var allCards = document.getElementsByClassName('col');


    //if there are users left to create, first create them all then fill them with data.
    if (userCountLeftToCreate > 0) {

        //check if atleast 1 "custom" filter is checked, when it is check all people.
        if (selectedInterestFilter) {
            wantedUsers = checkPeopleForFilters(wantedUsers, interest);
        }

        createPersonCards((wantedUsers.length - (userCountLeftToCreate % 3)) / 3, userCountLeftToCreate % 3);
        //console.log(amountOfActiveCards);
        for (let i = 0; i < amountOfActiveCards; i++) {

            setPersonCards(allCards[i + 3], wantedUsers[i], false);

        }
    }
    //set bottom text for result amount.
    document.getElementsByClassName("resultaten")[0].innerHTML = wantedUsers.length + " resultaten gevonden";
}


//shuffle array
function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}


//filter people out without the filter
function checkPeopleForFilters(users, interests) {


//loop backwards through array of people and remove elements if they have no interests selected.
    for (let i = users.length; i > 0; i--) {

        if (users[i - 1].userIntrests.length === 0) {
            const index = users.indexOf(users[i - 1]);
            if (index > -1) {
                users.splice(index, 1);
            }
        }

    }
    //loop backwards through array and check if the filter('s) selected are in their interests otherwise remove the people,
    for (let i = users.length; i > 0; i--) {

        for (let j = 0; j < interests.length; j++) {

            if (users[i - 1] !== undefined) {
                if (!users[i - 1].userIntrests.includes(interests[j])) {
                    const index = users.indexOf(users[i - 1]);
                    if (index > -1) {
                        users.splice(index, 1);
                    }
                }
            }
        }
    }
    //set new usercount to the length of final amount of people and return users.
    userCountLeftToCreate = users.length;
    return users;

}

// search user with name,
async function searchUser(searchBar) {
    if (event.key === 'Enter') {

        if (searchBar.value === "") {
            wantedUsers = await getAllUsers();

        } else {
            try {
                //select all users where part of the name contains given value.
                const userList = await FYSCloud.API.queryDatabase('SELECT * FROM account WHERE name LIKE ' + "'%" + searchBar.value + "%'");

                //  console.log(queryStrings.join(' '));
                let userIntrests = [];

                for (let i = 0; i < userList.length; i++) {
                    userIntrests.push({user: userList[i], userIntrests: await getUserIntrests(userList[i].id)});
                }

                // await calcPercentage(userIntrests[0].userIntrests, userIntrests[1].userIntrests)

                wantedUsers = userIntrests;
            } catch (e) {

                console.log(`Something went wrong: ${e}`);
            }
        }
        //check if wanted users isnt 0,
        if (wantedUsers !== 0) {
            callCreateFunctions(wantedUsers);
        }
    }
}

//remove all cards
function removeAllCards() {
    var gridParent = document.getElementsByClassName("grid-parent")[0];

    while (gridParent.firstChild) {
        gridParent.removeChild(gridParent.lastChild);
        amountOfRows--;
    }
    amountOfActiveCards = 0;
}

//set person info on card,
function setPersonCards(card, user, initalSet) {


    if (card === undefined || card === null || user === undefined || user === null)
        return;


    // card.children[0].children[0] <-- image
    //card.children[0].children[1]<-- name
    //card.children[0].children[2] <-- place
    // card.children[2].children[0] <-- "meer zien" button;
    try {
        if (!initalSet) {
            setInfo(user.user, card);
            userCountLeftToCreate--;

        } else {
            setInfo(user, card);
        }

    } catch (e) {
        console.log(e);
    }


}

function setInfo(user, card) {

    //card = baseCard;
    console.log(baseCard);
    const profilePhoto = user.profilePhoto;
    const name = user.name;
    baseCard.children[0].children[0].children[0].src = (profilePhoto ? profilePhoto : `https://ui-avatars.com/api/?name=${name}?background=#e0dcdc`);

    baseCard.children[0].children[0].children[1].innerHTML = name;
    var genderText = "";
    switch (user.genderFk) {
        case 1:
            genderText = "Man";
            break;
        case 2:
            genderText = "Vrouw";
            break;
        case 3:
            genderText = "Overig";
            break;
        default:
            genderText = "Onbekend";
            break;
    }

    baseCard.children[0].children[0].children[2].innerHTML = genderText;

    if (user.birthdate !== null) {
        let dateCeiling = new Date();
        var birthday = dateCeiling.getFullYear() - user.birthdate.split("-")[0];
        baseCard.children[0].children[0].children[3].innerHTML = `Leeftijd: ${birthday}`;
    } else {
        baseCard.children[0].children[0].children[3].innerHTML = "Leeftijd: ??";
    }

    console.log( card.children)
    baseCard.children[0].children[1].children[0].href = `javascript:window.location.href="./profile.html?profileid=${user.id}"`;
    card.replaceWith(baseCard);
    console.log(card);
}

function loadMoreCards() {


    if (wantedUsers === undefined || wantedUsers === null)
        return;
    checkCardAmount();
}


//check card amount, if amount of active cards is less then user (that dont have a card), set amount of cards left to create to the amount of users
// also calculate the remainder to check if extra row is needed.
function checkCardAmount() {

    if (amountOfActiveCards !== wantedUsers.length) {
        maxAmount = 9;


        amountOfWantCreateCards = userCountLeftToCreate;
        remainder = (userCountLeftToCreate % 3);
        //call createPersonCards.
        //console.log(wantedUsers);
        var activeCardsBeforeCreation = amountOfActiveCards;
        createPersonCards((amountOfWantCreateCards - remainder) / 3, remainder);
        var allCards = document.getElementsByClassName('card');


        // code below might cause a bug.
        for (let i = 0; i < amountOfActiveCards; i++) {

            setPersonCards(allCards[i + 3 + activeCardsBeforeCreation], wantedUsers[i + activeCardsBeforeCreation], false);
        }

    }

}

//duplicate person card and create row.
function createPersonCards(numberOfRows, remainder) {
    var flexGrids = document.getElementsByClassName("flex-grid");

    maxAmount = 9;
    //for the numberOfRows wanted,
    if (numberOfRows >= 1) {
        for (let i = 0; i < numberOfRows; i++) {

            if (maxAmount === 0)
                return;
            createParentDiv();
            for (let j = 0; j < 3; j++) {
                appendBaseCard(flexGrids);
            }
        }
    }


    if (remainder <= 0) {
        // console.log("can create equal amount of rows or no people found");
    } else {

        if (maxAmount === 0)
            return;

        createParentDiv();
        for (let j = 0; j < remainder; j++) {
            appendBaseCard(flexGrids);
        }
    }
}

//append new child to last flex-grid row;
function appendBaseCard(flexGrids) {
    flexGrids[flexGrids.length - 1].appendChild(skeletonCard.cloneNode(true));
    amountOfActiveCards++;
    amountOfWantCreateCards--;
    maxAmount--;
}

//create flex-grid object.
function createParentDiv() {
    var gridParent = document.getElementsByClassName("grid-parent")[0];
    var parentDiv = document.createElement("div");
    parentDiv.className = "flex-grid";
    gridParent.appendChild(parentDiv);
    amountOfRows++;
}

//listen if scrollbar is bottom of page, then create more elements
window.addEventListener('scroll', function (e) {
    let documentHeight = document.body.scrollHeight;
    let currentScroll = window.scrollY + window.innerHeight;
    // When the user is [modifier]px from the bottom, fire the event.
    let modifier = 50;
    // console.log(currentScroll);
    if (currentScroll + modifier > documentHeight) {
        loadMoreCards();

    }
}, false);
//});