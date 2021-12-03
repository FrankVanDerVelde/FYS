
// leeftijdsgroeps 30-40, 40-50   1 per keer
// geslacht man, vrouw, overig    1 per keer
// interests sports, dansen, uitgaan, drinken, eten     max 5
// "SELECT * FROM fys_is109_4_harmohat_chattest.account WHERE id = 1;"

//let foundUsers = [];
// selectElement.addEventListener('change', (event) => {
//     getResult();
//   });


async function getResult() {
    let queryStrings = ["SELECT * FROM fys_is109_4_harmohat_chattest.account WHERE"];
    // Place get element on id's to get the values;
    let agesFilter = "1-80";
    let genderFilter = "man";
    let interestFilter = ["Interest1", "Interest2", "Interest3", "Interest4", "Interest5"];

    if (agesFilter) {
        let ages =[];
        if (agesFilter.includes('+')) {
            ages[0] = agesFilter.substring(0, 2);
        }
        else
        {
            ages = agesFilter.split('-');

        }
        console.log(ages);
        //  StartTime BETWEEN DATEADD(HOUR, -1, GetDate())
        //         AND DATEADD(HOUR, 1, GetDate())
        if (ages.length === 1) {
            let minDate = new Date();
            minDate.setFullYear(minDate.getFullYear() - ages[0]);
            minDate = minDate.toISOString().split("T")[0];
            queryStrings.push(`WHERE birthdate > '${minDate}'`);
        } else {
            let birthdateInput = "10-15-1978"

            let dateFloor = new Date();
            dateFloor.setFullYear(dateFloor.getFullYear() - ages[1]);
            dateFloor = dateFloor.toISOString().split("T")[0];

            let dateCeiling = new Date();
            dateCeiling.setFullYear(dateCeiling.getFullYear() - ages[0]);
            dateCeiling = dateCeiling.toISOString().split("T")[0];
            checkAnd(queryStrings);

            queryStrings.push(`birthdate BETWEEN '${dateFloor}' AND '${dateCeiling}'`);
        }
    }        
    
    if (genderFilter){
        var genderNumber = 1;
        switch (genderFilter)
        {
            case "man":
                genderNumber = 1;
                break;
            case "vrouw":
                genderNumber = 2;

                break;
            case "overig":
                genderNumber = 3;

                break;
        }
        checkAnd(queryStrings);
        queryStrings.push(`gender = '${genderNumber}'`);
    }


    if (interestFilter.length != 0){
        interestFilter.forEach(interest => {
            checkAnd(queryStrings);
            queryStrings.push(`interest = '${interest}'`)
        });
    }

    console.log(queryStrings.join(' '));

    await console.log(await FYSCloud.API.queryDatabase(queryStrings.join(' ')));
    
}
function checkAnd(queryStrings)
{
    console.log(queryStrings[0].includes("WHERE"));

    if(!queryStrings[queryStrings.length-1].includes("WHERE"))
    {
        queryStrings.push(`AND`);
        console.log("pushed and");

    }
}
getResult()