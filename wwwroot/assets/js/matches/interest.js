
async function getUserIntrests(userId) {
    try {
        const interestList = await sqlSelectAsync("interestdetail");
        const userInterestList = await sqlSelectAsync("userinterests", ["accountFk"], userId);
        let interestIds = [];
        let interest = [];
        for (let i = 0; i < userInterestList.length; i++) {
            interestIds.push(parseInt(userInterestList[i].interestsFk));
        }

        //interestIds[0] = 1;

        for (let i = 0; i < interestIds.length; i++) {
            for (let j = 0; j < interestList.length; j++) {
                if (interestList[j].interestId === interestIds[i]) {
                    interest.push(interestList[j].description);
                }
            }
        }
        //console.log(interest);
        return interest;
    } catch (e) {
        console.log(`Something went wrong: ${e}`)
    }
}


async function getUsersWithIntrests(agesFilter, genderFilter) {
    let queryStrings = ["SELECT * FROM account WHERE"];

    let dateFloor = new Date();
    let dateCeiling = new Date();
    let genderNumber = 1;
    if (agesFilter) {
        let ages = [];
        if (agesFilter.includes('+')) {
            ages[0] = agesFilter.substring(0, 2);
        } else {
            ages = agesFilter.split('-');
        }
        if (ages.length === 1) {
            let minDate = new Date();
            minDate.setFullYear(minDate.getFullYear() - ages[0]);
            minDate = minDate.toISOString().split("T")[0];
            queryStrings.push(`birthdate < '${minDate}'`);
        } else {

            //calculate floor
            dateFloor.setFullYear(dateFloor.getFullYear() - ages[1]);
            dateFloor = dateFloor.toISOString().split("T")[0];

            //calculate ceiling
            dateCeiling.setFullYear(dateCeiling.getFullYear() - ages[0]);
            dateCeiling = dateCeiling.toISOString().split("T")[0];
            checkAnd(queryStrings);

            queryStrings.push(`birthdate BETWEEN '${dateFloor}' AND '${dateCeiling}'`);
        }
    }

    if (genderFilter) {
      //  console.log(genderFilter);
        switch (genderFilter) {
            case "Man":
                genderNumber = 1;
                break;
            case "Vrouw":
                genderNumber = 2;

                break;
            case "Overig":
                genderNumber = 3;

                break;
        }
        checkAnd(queryStrings);
        queryStrings.push(`genderFk = '${genderNumber}'`);
    }

    try {
        //`SELECT * FROM account WHERE birthdate BETWEEN ? AND ? AND genderFk = ?`, [dateFloor, dateCeiling, genderNumber]
        const userList = await FYSCloud.API.queryDatabase(queryStrings.join(' '));
      //  console.log(queryStrings.join(' '));
        let userIntrests = [];

        for (let i = 0; i < userList.length; i++) {
            userIntrests.push({user: userList[i], userIntrests: await getUserIntrests(userList[i].id)});
        }

       // await calcPercentage(userIntrests[0].userIntrests, userIntrests[1].userIntrests)
       // console.log(userIntrests);
        return userIntrests;
    } catch (e) {
        console.log(queryStrings.join(' '))
        console.log(`Something went wrong: ${e}`)
    }
}



async function getAllUsers()
{
    try {
        //`SELECT * FROM account WHERE birthdate BETWEEN ? AND ? AND genderFk = ?`, [dateFloor, dateCeiling, genderNumber]
        const userList =  await FYSCloud.API.queryDatabase("SELECT * FROM account");
        let userIntrests = [];

        for (let i = 0; i < userList.length; i++) {
            userIntrests.push({user: userList[i], userIntrests: await getUserIntrests(userList[i].id)});
        }

        // await calcPercentage(userIntrests[0].userIntrests, userIntrests[1].userIntrests)
      //  console.log(userIntrests);
        return userIntrests;
    } catch (e) {
        console.log(`Something went wrong: ${e}`)
    }
}


function checkAnd(queryStrings) {
    if (!queryStrings[queryStrings.length - 1].includes("WHERE")) {
        queryStrings.push(`AND`);
     //   console.log("pushed and");
    }
}

async function calcPercentage(arrOne, arrTwo) {
    let commonElements = 0;

    if (arrOne.length > arrTwo.length) {

        for (let i = 0; i < arrOne.length; i++) {
            for (let j = 0; j < arrTwo.length; j++) {
                if (arrOne[i] === arrTwo[j]) {
                    commonElements += 1;
                }
            }
        }

        return commonElements / arrOne.length;
    } else {
        for (let i = 0; i < arrTwo.length; i++) {
            for (let j = 0; j < arrOne.length; j++) {
                if (arrTwo[i] === arrOne[j]) {
                    commonElements += 1;
                }
            }
        }

        return commonElements;
    }

}