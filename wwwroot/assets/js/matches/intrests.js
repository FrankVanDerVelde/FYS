async function getUserIntrests(userId) {
    try {
        const instrestList = await sqlSelectAsync("intrestdetail");
        const userIntrestsList = await sqlSelectAsync("userinterests", ["accountFk"], userId);

        let intrestIds = [];
        let intrest = [];

        for (let i = 0; i < userIntrestsList.length; i++) {
            intrestIds.push(parseInt(userIntrestsList[i].interestsFk));
        }

        intrestIds[0] = 1;

        for (let i = 0; i < intrestIds.length; i++) {
            for (let j = 0; j < instrestList.length; j++) {
                if (instrestList[j].intrestId === intrestIds[i]) {
                    intrest.push(instrestList[j].description);
                }
            }
        }
        // console.log(intrest)
        return intrest;
    } catch (e) {
        console.log(`Something went wrong: ${e}`)
    }
}

async function getUsersWithIntrests() {
    try {
        const userList = await FYSCloud.API.queryDatabase(`SELECT * FROM account WHERE birthdate BETWEEN ? AND ? AND genderFk = ?`, ["1941-12-02", "2020-12-02", 1]);
        let userIntrests = [];

        for (let i = 0; i < userList.length; i++) {
            userIntrests.push({user: userList[i], userIntrests: await getUserIntrests(userList[i].id)});
        }

        await calcPercentage(userIntrests[0].userIntrests, userIntrests[1].userIntrests)

        return userIntrests;
    } catch (e) {
        console.log(`Something went wrong: ${e}`)
    }
}


async function calcPercentage(arrOne, arrTwo) {
    let commonElements = 0;

    if(arrOne.length > arrTwo.length) {

        for(let i=0; i<arrOne.length; i++) {
            for(let j=0; j<arrTwo.length; j++) {
                if(arrOne[i] === arrTwo[j]) {
                    commonElements += 1;
                }
            }
        }

        return commonElements/arrOne.length;
    } else {
        for(let i=0; i<arrTwo.length; i++) {
            for(let j=0; j<arrOne.length; j++) {
                if(arrTwo[i] === arrOne[j]) {
                    commonElements += 1;
                }
            }
        }

        return commonElements;
    }
}