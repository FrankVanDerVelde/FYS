document.addEventListener("DOMContentLoaded", async function () {


    try {
        getInterests();
    } catch (e) {
        console.error(e);
    }

})

var bluePrintArray = {
    id: 0,
    headCategory: "",
    subCategorys: [],
}
var bluePrintSubArray =
    {
        id: 0,
        interest: ""
    }

;

var amountOfInterestFilters = 0;
var xxx = [];
var detaildInterests;
var headInterests;

async function getInterests() {
    intresses = await FYSCloud.API.queryDatabase("SELECT interestscategory.id AS parent_id, interestscategory.description AS parent_description, intrestdetail.description AS child_description, intrestdetail.intrestId AS child_id\n" +
        "FROM interestscategory\n" +
        "INNER JOIN intrestdetail ON interestscategory.id = intrestdetail.catgoryId ");

    console.log(intresses);

   // await createFilterOption(intresses);
    await createExtraFilter(intresses);

}

async function fillInterestFilter() {
    headInterests = await FYSCloud.API.queryDatabase("SELECT * FROM fys_is109_4_harmohat_chattest.interestscategory; ")

}

async function fillArray(intrest) {
    xxx.push(bluePrintArray);
    xxx[0].id = intrest[0].parent_id;
    xxx[0].headCategory = intrest[0].parent_description;
    console.log(xxx);
    var customI = 1;
    for (let i = 0; i < intrest.length; i++) {


        if (xxx[customI].id === intrest[i].parent_id) {
            console.log("test");
            //xxx[customI].subCategorys.push(bluePrintSubArray);


        }
        else{
            xxx.push(bluePrintArray);
            customI++;
            xxx[customI].id = intrest[i].parent_id;
            xxx[customI].headCategory = intrest[i].parent_description;
            console.log( intrest[i].parent_description);
            console.log( intrest[i].parent_id);
            console.log( customI);


        }


    }

    //console.log(xxx);

//// ADD ANOTHER LAYER INTO ARRAY.
}

// 'Technology': [
//         { 'description': "software" },
//         { 'description': "hardware" },
//         { 'description': "smartphones" },
//         { 'description': "televisions" },
//         { 'description': "cameras" },
//
//     ],
//     'Sport': [
//         { 'description': "software" },
//         { 'description': "hardware" },
//         { 'description': "smartphones" },
//         { 'description': "televisions" },
//         { 'description': "cameras" },
//
//     ],

async function createFilterOption(interests) {
    const parentDiv = document.getElementsByClassName('dropdown-content-filter')[0]; //<-- first dro
    var madeIntrests = [];


    for (let i = 0; i < interests.length; i++) {


        if (!madeIntrests.includes(interests[i].parent_id)) {
            var childdiv = document.createElement("a");
            childdiv.setAttribute("class", "optionInterest");
            childdiv.setAttribute("href", "javascript:void(0)");
            childdiv.setAttribute("onclick", "changeFilter(this)");
            childdiv.setAttribute("id", interests[i].parent_description);

            childdiv.innerHTML = interests[i].parent_description;
            parentDiv.appendChild(childdiv);
            madeIntrests.push(interests[i].parent_id);
        }


    }

}
async function createExtraFilter(interests) {
    const parentDiv = document.getElementsByClassName('dropdown-content-filter')[0]; //<-- first dro
    var madeIntrests = [];


    for (let i = 0; i < interests.length; i++) {


        if (!madeIntrests.includes(interests[i].parent_id)) {
            var childdiv = document.createElement("button");
            childdiv.setAttribute("class", "dropdown-button-filter");

            childdiv.setAttribute("onclick", "openFilter(this)");
            childdiv.setAttribute("id", interests[i].parent_description);

            childdiv.innerHTML = interests[i].parent_description;
            parentDiv.appendChild(childdiv);
            madeIntrests.push(interests[i].parent_id);
        }


    }

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

    document.getElementsByClassName("toegepaste-filters")[0].appendChild(parentDiv);
    console.log("added standard filter");
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


    document.getElementsByClassName("toegepaste-filters")[0].appendChild(parentDiv);
    console.log("added interest filter");
}

//delete filter.
async function deleteFilter(itemToRemove) {

    var parentDiv = document.getElementsByClassName("toegepaste-filters")[0];
    var childToRemove = document.getElementById(itemToRemove);
    parentDiv.removeChild(childToRemove);

    console.log("removed filter");

}