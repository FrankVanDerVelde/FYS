document.addEventListener("DOMContentLoaded", async function (){


  try{
      var interests = await FYSCloud.API.queryDatabase("SELECT * FROM fys_is109_4_harmohat_chattest.interestscategory; ")
        console.log(interests);
  }
  catch(e){
        console.error(e);
  }

})








function changeFilter(item) {

    var result;
    var wantToRemove = false;
    const parentDiv = document.getElementsByClassName('toegepaste-filters')[0];

    for (let i = 0; i < parentDiv.children.length; i++) {

        let text = item.className.toLowerCase();
        text = text.slice(6, text.length);
        result = text.includes(parentDiv.children[i].id.toLowerCase());

        if (item.innerHTML === parentDiv.children[i].innerText) {
            deleteFilter(parentDiv.children[i].id);
            wantToRemove = true;
            break;
        }
        if (result) {
            parentDiv.children[i].children[0].innerHTML = item.innerHTML;
            break;

        }

    }
    if (result === false || parentDiv.children.length === 0 && wantToRemove === false) {

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
        }
    }

}


function createFilter(typeFilter, valueFilter) {

    var parentDiv = document.createElement("div");
    parentDiv.className = "chose";
    parentDiv.id = typeFilter;
    var childDiv = document.createElement("p");
    childDiv.className = "filterOption";
    childDiv.id = "option" + typeFilter;

    childDiv.innerHTML = valueFilter;
    parentDiv.appendChild(childDiv);


    document.getElementsByClassName("toegepaste-filters")[0].appendChild(parentDiv);
    console.log("added");
}

function deleteFilter(itemToRemove) {

    var parentDiv = document.getElementsByClassName("toegepaste-filters")[0];
    var childToRemove = document.getElementById(itemToRemove);
    parentDiv.removeChild(childToRemove);

    console.log("removed");

}