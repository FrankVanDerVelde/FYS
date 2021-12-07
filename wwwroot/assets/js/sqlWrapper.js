

/**
 * Fetches the user by its userId.
 *
 * @param userId - id of the user stored in DB.
 * @returns {Promise<User:Object>} - Extracts object out of array and gives back user object
 */
async function getUserByIdAsync(userId) {
    try {
        const user = await sqlSelectAsync("account", "id", userId);

        return user[0];
    } catch (e) {
        console.log(`Something went wrong: ${e}`)
    }
}




/**
 * /**
 * Fetches the user by its email, if exists.
 *
 * @param email - email of the user stored in DB.
 * @returns {Promise<string|User:Object>} - User object if exists other wise string with error.
 */
async function getUserByEmailAsync(email) {
    try {
        const user = await sqlSelectAsync("account", "email", email);
        return user[0];
    } catch (e) {
        console.log(`Something went wrong: ${e}`)
    }
}

/**
 *
 * Checks if the user exists in db based on the user's id.
 *
 * @param userId - id of the user to check if exists.
 * @returns {Promise<boolean>} - True if user exists false if not.
 */
async function userExistsByIdAsync(userId) {
    try {
        return !!(await (getUserByIdAsync(userId)));
    } catch (e) {
        console.log(`Something went wrong: ${e}`)
    }
}

/**
 * Checks if the user exists in db based on the user's email.
 *
 * @param email - email of the user to check if exists.
 * @returns {Promise<boolean>} - True if user exists false if not.
 */
async function userExistsByEmailAsync(email) {
    try {
        return !!(await (getUserByEmailAsync(email)));
    } catch (e) {
        console.log(`Something went wrong: ${e}`)
    }
}

/**
 * Fetches all users from the Db.
 *
 * @returns {Promise<array:User>} - Array of user objects.
 */
async function getAllUsersAsync() {
    try {
        return await sqlSelectAsync("account");
    } catch (e) {
        console.log(`Something went wrong: ${e}`)
    }
}

/**
 * Fetches data from the db based on given params.
 *
 * @param table - Table to SELECT from.
 * @param column - Optional Param to use in WHERE STATEMENT
 * @param params - Optional Param to use in WHERE STATEMENT
 * @returns {Promise<*>} - returns an array with objects
 */
async function sqlSelectAsync(table, column = null, params = null) {
    try {
        if (params == null) {
            return await FYSCloud.API.queryDatabase(`SELECT *
                                                     FROM ${table}`);
        } else if (typeof column == "string") {
            return await FYSCloud.API.queryDatabase(`SELECT *
                                                     FROM ${table}
                                                     WHERE ${column} = ?`, params);
        } else {
            let sqlFields = [];

            for (let i = 0; i < column.length; i++) {
                //Increment one to reach maximum
                if (i + 1 == column.length) {
                    sqlFields.push(`${column[i]} = ?`);
                    break;
                }

                sqlFields.push(`${column[i]} = ? AND `);
            }
            const sqlString = `SELECT *
                               FROM ${table}
                               WHERE ${sqlFields.join('')};`;
            // console.log(`${sqlString} `)
            return await FYSCloud.API.queryDatabase(sqlString, params);
        }
    } catch
        (e) {
        console.log(`Something went wrong: ${e}`)
    }
}

async function sqlInsertAsync(table, column, params) {
    try {
        if (table != "" && column.length != 0 && params.length != 0) {
            let sqlColumns = [];
            let sqlParams = [];

            for (let i = 0; i < column.length; i++) {
                //Increment one to reach maximum
                if (i + 1 == column.length) {
                    sqlColumns.push(`${column[i]}`);
                    break;
                }

                sqlColumns.push(`${column[i]}, `);
            }

            for (let i = 0; i < params.length; i++) {
                //Increment one to reach maximum
                if (i + 1 == params.length) {
                    sqlParams.push(`?`);
                    break;
                }
                sqlParams.push(` ?, `);

            }

            const sqlString = `INSERT INTO ${table} (${sqlColumns.join('')})
                               VALUES (${sqlParams.join('')});`;

            console.log(`${sqlString} `);
            return await FYSCloud.API.queryDatabase(sqlString, params);
        }
    } catch (e) {
        console.log(`Something went wrong: ${e}`)
    }
}

async function sqlDeleteAsync(table, column, params) {
    try {
        if (params == null) {
            return await FYSCloud.API.queryDatabase(`SELECT *
                                                     FROM ${table}`);
        } else {
            let sqlFields = [];

            for (let i = 0; i < column.length; i++) {
                //Increment one to reach maximum
                if (i + 1 == column.length) {
                    sqlFields.push(`${column[i]} = ?`);
                    break;
                }

                sqlFields.push(`${column[i]} = ? AND `);
            }
            const sqlString = `DELETE
                               FROM ${table}
                               WHERE ${sqlFields.join('')};`;
            console.log(`${sqlString} `)
            return await FYSCloud.API.queryDatabase(sqlString, params);
        }
    } catch (e) {
        console.log(`Something went wrong: ${e}`)
    }
}