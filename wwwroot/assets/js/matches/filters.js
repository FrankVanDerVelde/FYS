function changeFilter(item)
{

    console.log(item.className);
    var result;

    const parentDiv = document.getElementsByClassName('toegepaste-filters')[0];
    console.log(parentDiv);


    for (let i = 0; i < parentDiv.children.length; i++) {

        let text = item.className.toLowerCase();
        text = text.slice(6,text.length);
        result = text.includes( parentDiv.children[i].id.toLowerCase());

        if(item.innerHTML === parentDiv.children[i].innerText)
        {
            deleteFilter(parentDiv.children[i].id);

        }
        if(result)
        {
            parentDiv.children[i].innerHTML = item.innerHTML;

        }
    }
    if(!result)
    {
        switch (item.className)
        {
            case "optionGeslacht":

                createFilter("geslacht", item.innerHTML);

                break;
            case "optionRadius":
                createFilter("radius", item.innerHTML);

                break;
            case "optionBestemming":
                createFilter("bestemming", item.innerHTML);

                break;
            case "optionLeeftijd":

                createFilter("leeftijd", item.innerHTML);

                break;
        }
    }
}


function createFilter(typeFilter, valueFilter)
{

    var parentDiv = document.createElement("div");
    parentDiv.className = "gekozen";
    parentDiv.id = typeFilter;
    var childDiv = document.createElement("p");
    childDiv.className = "filterOption";
    childDiv.id = "option"+typeFilter;

    childDiv.innerHTML = valueFilter;
    parentDiv.appendChild(childDiv);


    document.getElementsByClassName("toegepaste-filters")[0].appendChild(parentDiv);

}

function deleteFilter(itemToRemove)
{

    var parentDiv = document.getElementsByClassName("toegepaste-filters")[0];
    var childToRemove = document.getElementById(itemToRemove);
    console.log(childToRemove);
    parentDiv.removeChild(childToRemove);

    console.log("test");

}