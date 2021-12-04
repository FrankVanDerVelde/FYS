var baseCard = document.getElementsByClassName("flex-grid")[0].children[0];
var remainder = 0;
var amountOfActiveCards = 3;
var amountOfWantCreateCards = 0;
var userCountLeftToCreate = 0;
var amountOfRows = 1;
var maxAmount = 9;

var wantedUsers = {};

const targetNode = document.getElementsByClassName('toegepaste-filters')[0];
MutationObersver();

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

async function initalSet() {
    wantedUsers = await getAllUsers();
    userCountLeftToCreate = wantedUsers.length;
    var allCards = document.getElementsByClassName('card');
    amountOfActiveCards = allCards.length - 3;

    for (let i = 0; i < userCountLeftToCreate; i++) {
        if (amountOfActiveCards > 0 && userCountLeftToCreate > 0) {
            setPersonCards(allCards[i + 3], wantedUsers[i]);
        }
    }
    document.getElementsByClassName("resultaten")[0].innerHTML = wantedUsers.length + " resultaten gevonden";
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
        console.log("db call with params");
        wantedUsers = await getUsersWithIntrests(age, gender);

    } else {
        console.log("db call all users");
        wantedUsers = await getAllUsers();

    }

    //set users left to create equal to the amount of users.
    userCountLeftToCreate = wantedUsers.length;


    //everytime someone updates remove all cards, -> to make it prettier, change so object just changes information. FASE 4!
    removeAllCards();


    var allCards = document.getElementsByClassName('card');


    //if there are users left to create, first create them all then fill them with data.
    if (userCountLeftToCreate > 0) {

        //check if atleast 1 "custom" filter is checked, when it is check all people.
        if (selectedInterestFilter) {
           wantedUsers =  checkPeopleForFilters(wantedUsers, intrests);
        }

        createPersonCards((wantedUsers.length - (userCountLeftToCreate % 3)) / 3, userCountLeftToCreate % 3);

        //console.log(amountOfActiveCards);
        for (let i = 0; i < amountOfActiveCards; i++) {

            setPersonCards(allCards[i + 3], wantedUsers[i]);
        }
    }


    //set bottom text for result amount.
    document.getElementsByClassName("resultaten")[0].innerHTML = wantedUsers.length + " resultaten gevonden";


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

            if(users[i-1] !== undefined)
            {
                if (!users[i-1].userIntrests.includes(interests[j])) {
                    const index = users.indexOf(users[i-1]);
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
function setPersonCards(card, user) {

    if (card === undefined || card === null || user === undefined || user === null)
        return;
    console.log("set user info");
    // card.children[0].children[0] <-- image
    //card.children[0].children[1]<-- name
    //card.children[0].children[2] <-- place
    // card.children[2].children[0] <-- "meer zien" button;
    card.children[0].children[0].src = user.user.profilePhoto;
    card.children[0].children[1].innerHTML = user.user.name;
    card.children[0].children[2].innerHTML = user.user.email;
    card.children[2].children[0].onclick = "javascript:window.location.href='./profile.html?userid=" + user.user.id + "'";
    userCountLeftToCreate--;
}

//listen if scrollbar is bottom of page, then create more elements
document.addEventListener('scroll', function (e) {
    let documentHeight = document.body.scrollHeight;
    let currentScroll = window.scrollY + window.innerHeight;
    // When the user is [modifier]px from the bottom, fire the event.
    let modifier = 50;
    if (currentScroll + modifier > documentHeight) {
        loadMoreCards();

    }
})


function loadMoreCards()
{
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
        createPersonCards((amountOfWantCreateCards - remainder) / 3, remainder);
        var allCards = document.getElementsByClassName('card');

        for (let i = 0; i < amountOfActiveCards; i++) {

            setPersonCards(allCards[i + 3], wantedUsers[i]);
        }

    }
}


//duplicate person card and create row.
function createPersonCards(numberOfRows, remainder) {
    var flexGrids = document.getElementsByClassName("flex-grid");
    maxAmount = 9;
    //for the numberOfRows wanted,

    if(numberOfRows >= 1)
    {
        for (let i = 0; i < numberOfRows; i++) {

            if (maxAmount === 0)
                return;
            createParentDiv();
            for (let j = 0; j < 3; j++) {

                document.getElementsByClassName("flex-grid")[flexGrids.length - 1].appendChild(baseCard.cloneNode(true));
                amountOfActiveCards++;
                amountOfWantCreateCards--;
                maxAmount--;
            }
        }
    }

    if (remainder === 0) {
        console.log("can create equal amount of rows or no people found");
    } else {
        if (maxAmount === 0)
            return;
        createParentDiv();
        for (let j = 0; j < remainder; j++) {
            document.getElementsByClassName("flex-grid")[flexGrids.length - 1].appendChild(baseCard.cloneNode(true));
            amountOfActiveCards++;
            amountOfWantCreateCards--;
            maxAmount--;
        }
    }
}

//create flex-grid object.
function createParentDiv() {
    var gridParent = document.getElementsByClassName("grid-parent")[0];
    var parentDiv = document.createElement("div");
    parentDiv.className = "flex-grid";
    gridParent.appendChild(parentDiv);
    amountOfRows++;
}
