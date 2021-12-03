
var users;



const targetNode = document.getElementsByClassName('toegepaste-filters')[0];

// Options for the observer (which mutations to observe)
const config = { attributes: true, childList: true, subtree: true };

// Callback function to execute when mutations are observed
const callback = function(mutationsList, observer) {
    // Use traditional 'for loops' for IE 11
    for(const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            var selectedFilters =  returnSelectedFilters();
            checkInterests(selectedFilters);
        }
    }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);
test();
async function test()
{
    users = await getAllFromInterest();
    checkInterests("");
}
async  function checkInterests(selectedFilters)
{
    console.log(selectedFilters);
    var gender= "";
    var age= "";
    for (let i = 0; i < selectedFilters.length; i++) {
        if(selectedFilters[i].parentNode.id === "gender")
        {
            gender = selectedFilters[i].innerHTML;
            console.log(gender);
        }
        else if(selectedFilters[i].parentNode.id === "age")
        {
            age = selectedFilters[i].innerHTML;

        }
    }

    if(age !=="" || gender !== "")
    {
        console.log("db call with params");
        users= await getUsersWithIntrests(age, gender);

    }
    else
    {
        users = await getAllFromInterest();

    }

    console.log(users);
    var allPersonCards = document.getElementsByClassName("card");
     for (let i = 0; i < users.length; i++) {

         if(i+3 === allPersonCards.length)
             break;
         setPersonCard(allPersonCards[i+ 3],users[i]);

     }
    document.getElementsByClassName("resultaten")[0].innerHTML = users.length +" resultaten weergegeven";

}

function setPersonCard(card, user)
{
   var info = card.querySelectorAll("p");
   console.log(info);
   info[0].innerHTML = "xc";
   info[1].innerHTML = "test"
    console.log(user);
}



document.addEventListener('scroll', function(e) {
    let documentHeight = document.body.scrollHeight;
    let currentScroll = window.scrollY + window.innerHeight;
    // When the user is [modifier]px from the bottom, fire the event.
    let modifier = 150;
    if(currentScroll + modifier > documentHeight) {
        console.log('You are at the bottom!')
    }
})