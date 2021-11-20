document.addEventListener("DOMContentLoaded", async function (){


  try{
      fillInterestFilter();
  }
  catch(e){
        console.error(e);
  }

})

var amountOfInterestFilters = 0;

async function fillInterestFilter()
{
    var interests = await FYSCloud.API.queryDatabase("SELECT * FROM fys_is109_4_harmohat_chattest.interestscategory; ")
    await createFilterOption(interests);
    console.log(interests);
}

async function createFilterOption(interests)
{
    const parentDiv = document.getElementsByClassName('dropdown-content-filter')[0]; //<-- first dro


    for (let i = 0; i < interests.length ; i++) {
        var childdiv = document.createElement("a");
        childdiv.setAttribute("class", "optionInterest");
        childdiv.setAttribute("href",  "javascript:void(0)") ;
        childdiv.setAttribute("onclick", "changeFilter(this)");
        childdiv.setAttribute("id", interests[i].description);

        childdiv.innerHTML =  interests[i].description;
        parentDiv.appendChild(childdiv);

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
            if(parentDiv.children[i].id.includes("interest"))
            {
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
    if(amountOfInterestFilters === 5)
    {
        const parentDiv = document.getElementsByClassName('toegepaste-filters')[0];
        console.log(" je hebt nu 5 filters");
    }
    //if filter doesnt exist or the parent has no filters, create filter.
    if (exists === false || parentDiv.children.length === 0 ) {


        if(wantToRemove === true)
        {
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

                if(amountOfInterestFilters === 5)
                {
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
    parentDiv.id = typeFilter +valueFilter;
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