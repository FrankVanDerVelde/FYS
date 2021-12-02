document.addEventListener("DOMContentLoaded", async function () {


    try {
        getInterests();
    } catch (e) {
        console.error(e);
    }

})

var amountOfInterestFilters = 0;
var selectedFilters = [];



async function getInterests() {
    intresses = await FYSCloud.API.queryDatabase("SELECT interestscategory.id AS parent_id, interestscategory.description AS parent_description, intrestdetail.description AS child_description, intrestdetail.intrestId AS child_id\n" +
        "FROM interestscategory\n" +
        "INNER JOIN intrestdetail ON interestscategory.id = intrestdetail.catgoryId ");

    allFilters = intresses;
    console.log(allFilters);

    await createInterestFilter(intresses);

}
var target = document.querySelector('.toegepaste-filters')

// Create an observer instance.
var observer = new MutationObserver(function(mutations) {
    getPeople();
});

// Pass in the target node, as well as the observer options.
observer.observe(target, {
    attributes:    true,
    childList:     true,
    characterData: true
});



function getPeople()
{
        
}
//create intrest filter header and sub cat
async function createInterestFilter(interests) {
    const parentDiv = document.getElementsByClassName('dropdown-content-filter')[0]; //<-- first dropdown
    var madeIntrests = [];
    var parentElements = [];

    for (let i = 0; i < interests.length; i++) {

        if (!madeIntrests.includes(interests[i].parent_id)) {
            var childdiv = document.createElement("button");
            childdiv.setAttribute("class", "dropdown-button-filter");

            childdiv.setAttribute("onclick", "openInterestFilter(this)");
            childdiv.setAttribute("id", interests[i].parent_description);

            childdiv.innerHTML = interests[i].parent_description;
            parentDiv.appendChild(childdiv);
            madeIntrests.push(interests[i].parent_id);
            parentElements.push(childdiv);
        }

    }

    for (let i = 0; i < parentElements.length; i++) {
        var dropDownChild = document.createElement("div");
        dropDownChild.setAttribute("class", "dropdown-content-filter-interests");
        insertAfter(parentElements[i],dropDownChild);
    }


    var dropdownParent = document.getElementsByClassName("dropdown-content-filter-interests");
    /// TODO creeer div ONDER button niet in en voeg daarna dit stuk hieronder toe.
    var tempNumber = interests[0].parent_id;
    var counter = 0;
    for (let i = 0; i < interests.length; i++) {

        if(tempNumber !== interests[i].parent_id)
        {
            counter++;
            tempNumber = interests[i].parent_id;
        }

       if(interests[i].parent_description === parentElements[counter].id)
       {
           var childDivInterest = document.createElement("a");
           childDivInterest.setAttribute("class", "optionInterest");
           childDivInterest.setAttribute("href", "javascript:void(0)");
           childDivInterest.setAttribute("onclick", "changeFilter(this)");
           childDivInterest.setAttribute("id", interests[i].child_description);

           childDivInterest.innerHTML = interests[i].child_description;
           dropdownParent[counter].appendChild(childDivInterest);
       }

    }

}
function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
async function changeFilter(item) {

    var exists;
    var wantToRemove = false;
    const parentDiv = document.getElementsByClassName('toegepaste-filters')[0];
    // get all active filters
    for (let i = 0; i < parentDiv.children.length; i++) {

        //put classname as string and cut "Option" from classname.
        let classname = item.className.toLowerCase();
        classname = classname.slice(6, classname.length);
        exists = classname.includes(parentDiv.children[i].id.toLowerCase());

        //check if filter already exists, if yes then delete that filter. and set wantToRemove to true.
        if (item.innerHTML === parentDiv.children[i].innerText) {
            if (parentDiv.children[i].id.includes("interest")) {
                amountOfInterestFilters--;
            }
            await deleteFilter(parentDiv.children[i].id);
            wantToRemove = true;
            break;
        }

        //if standard filter is selected but not the same option, change filter text.
        if (exists && classname !== "interest") {
            parentDiv.children[i].children[0].innerHTML = item.innerHTML;

            for (let j = 0; j < selectedFilters.length; j++) {
                if(parentDiv.children[i].children[0] === item)
                {
                    selectedFilters[i] = item;
                }
            }
            console.log(selectedFilters);
            break;

        }

    }
    //todo, remove first added interest filter
    if (amountOfInterestFilters === 5) {
        const parentDiv = document.getElementsByClassName('toegepaste-filters')[0];
    }
    //if filter doesnt exist or the parent has no filters, create filter.
    if (exists === false || parentDiv.children.length === 0) {


        if (wantToRemove === true) {
            return;
        }
        switch (item.className) {
            case "optionGender":

                createFilter("gender", item.innerHTML);

                break;
            case "optionDistance":
                createFilter("distance", item.innerHTML);

                break;
            case "optionDestination":
                createFilter("destination", item.innerHTML);

                break;
            case "optionAge":

                createFilter("age", item.innerHTML);

                break;
            case "optionInterest":

                if (amountOfInterestFilters === 5) {
                    console.log("Too many filters");
                    //todo add warning
                    alert("Too many filters");
                    return;
                }
                amountOfInterestFilters++;
                createFilterInterests("interest", item.innerHTML);
                break;
        }

    }
}

//create div, give classname and id and create child in that div.
function createFilter(typeFilter, valueFilter) {

    var parentDiv = document.createElement("div");
    parentDiv.className = "chose";
    parentDiv.id = typeFilter;
    var childDiv = document.createElement("p");
    childDiv.className = "filterOption";

    childDiv.innerHTML = valueFilter;
    parentDiv.appendChild(childDiv);

    //set filter as child under filters.
    selectedFilters.push(childDiv);
    document.getElementsByClassName("toegepaste-filters")[0].appendChild(parentDiv);
    console.log("added standard filter");
    console.log(selectedFilters);
}

//create div, give classname and id and create child in that div.
function createFilterInterests(typeFilter, valueFilter) {

    var parentDiv = document.createElement("div");
    parentDiv.className = "chose";
    parentDiv.id = typeFilter + valueFilter;
    var childDiv = document.createElement("p");
    childDiv.className = "filterOption";

    childDiv.innerHTML = valueFilter;
    parentDiv.appendChild(childDiv);

    selectedFilters.push(childDiv);
    console.log(selectedFilters);
    document.getElementsByClassName("toegepaste-filters")[0].appendChild(parentDiv);
    console.log("added interest filter");
}

//delete filter.
async function deleteFilter(itemToRemove) {

    var parentDiv = document.getElementsByClassName("toegepaste-filters")[0];
    var childToRemove = document.getElementById(itemToRemove);
    console.log("removed filter");

    const index = selectedFilters.indexOf(childToRemove.firstChild);
    if (index > -1) {
        selectedFilters.splice(index, 1);
    }
    parentDiv.removeChild(childToRemove);

}