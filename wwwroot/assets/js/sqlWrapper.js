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
 * Fetches the user by its name, if exists.
 *
 * @param name - name of the user stored in DB.
 * @returns {Promise<string|User:Object>} - User object if exists other wise string with error.
 */
async function getUserByName(name) {
    try {
        const user = await sqlSelectAsync("account", "name", name);
        return user[0];
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
 * Deletes an user based on its userId.
 *
 * @param userId - Id of the to delete user.
 * @returns {Promise<void>}
 */
async function deleteUserById(userId) {
    try {
        await disableFkCheck();

        await deleteUserIntrests(userId);
        await deleteUserMatch(userId);

        await sqlDeleteAsync("account", ["id"], userId);

        await enableFkChecks();
    } catch (e) {
        console.log(`Something went wrong: ${e}`);
    }
}

/**
 * Deletes user intrests based on userId.
 * @param userId - id of the to delete intrests of the user
 * @returns {Promise<void>}
 */
async function deleteUserIntrests(userId) {
    try {
        await sqlDeleteAsync("userinterests", ["accountFk"], userId);
    } catch (e) {
        console.log(`Something went wrong: ${e}`);
    }
}

/**
 * Deletes an match between users
 * @returns {Promise<void>}
 */
async function deleteUserMatch(userId) {
    try {
        await sqlDeleteAsync("matches", ["currUserFk"], [userId]);
    } catch (e) {
        console.log(`Something went wrong: ${e}`);
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
            // console.log(`${sqlString}`);
            return await FYSCloud.API.queryDatabase(sqlString, params);
        }
    } catch
        (e) {
        console.log(`Something went wrong: ${e}`)
    }
}

/**
 * Insert data to the db.
 *
 * @param table - table to INSERT in
 * @param column - columns to INSERT in
 * @param params - the values to insert with corresponding col.
 * @param userId -
 * @returns {Promise<*>}
 */
async function sqlInsertAsync(table, column, params, userId) {
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

            // console.log(`${sqlString} `);
            return await FYSCloud.API.queryDatabase(sqlString, params);
        }
    } catch (e) {
        console.log(`Something went wrong: ${e}`)
    }
}

/**
 * Update data in the db.
 *
 * @param table - table to UPDATE
 * @param column - columns to UPDATE in
 * @param params - the values to insert with corresponding col.
 * @returns {Promise<*>}
 */
async function sqlUpdateAsync(table, column, params, userId) {
    try {
        if (table != "" && column.length != 0 && params.length != 0) {
            let sqlColumns = [];
            let sqlParams = [];

            for (let i = 0; i < column.length; i++) {
                //Increment one to reach maximum
                if (i + 1 == column.length) {
                    sqlColumns.push(`${column[i]} = ?`);
                    break;
                }

                sqlColumns.push(`${column[i]} = ?, `);
            }

            const sqlString = `UPDATE ${table} 
                               SET ${sqlColumns.join('')}
                               WHERE id = ?;`.replace(/\n/g, '');

            params.push(userId);
            return await FYSCloud.API.queryDatabase(sqlString, params);
        }
    } catch (e) {
        console.log(`Something went wrong: ${e}`)
    }
}

/**
 * Deletes data in the db.
 *
 * @param table - table to DELETE data from
 * @param column - columns to DELETE from
 * @param params - Optional params to add a for ex: WHERE clause
 */
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
            // console.log(`${sqlString} `)
            return await FYSCloud.API.queryDatabase(sqlString, params);
        }
    } catch (e) {
        console.log(`Something went wrong: ${e}`)
    }
}

/**
 * Enables fkChecks in the DB.
 *
 * @returns {Promise<*>}
 */
async function enableFkChecks() {
    try {
        return await FYSCloud.API.queryDatabase(`SET FOREIGN_KEY_CHECKS=?`, [1]);
    } catch (e) {
        console.log(`Something went wrong: ${e}`);
    }
}

/**
 * Disables fkChecks in db to make inserting data on table with constraints easier.
 *
 * @returns {Promise<*>}
 */
async function disableFkCheck() {
    try {
        return await FYSCloud.API.queryDatabase(`SET FOREIGN_KEY_CHECKS=?`, [0]);
    } catch (e) {
        console.log(`Something went wrong: ${e}`);
    }
}

/**
 * Builds DATETIME from sql to DATE.
 *
 * @param dateTime - DateTIME to strip
 * @returns {Promise<string>}
 */
async function stripTimeFromDate(dateTime) {
    const isoToStrip = "T00:00:00.000Z";

    return dateTime.toString().replaceAll(isoToStrip, "");
}
