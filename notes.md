
**Sql Select Code**
```js
async function sqlSelectAsync(table, column = null, params = null) {
    try {
        if (params == null) {
            return await FYSCloud.API.queryDatabase(`SELECT *
                                                     FROM ${table}`);
        } else if (column.length == 1) {
            const field = column[0];

            return await FYSCloud.API.queryDatabase(`SELECT *
                                                     FROM ${table}
                                                     WHERE ${field} = ?`, params);
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
            console.log(`${sqlString} `)
            return await FYSCloud.API.queryDatabase(sqlString, params);
        }
    } catch
        (e) {
        console.log(`Something wen't wrong: ${e}`)
    }
}
```

---

## Usage

**Input:**
```js
fields = ['id', 'email'];
params = ['9', `a@qweqweqr2341242a.com`];
```

--- 

**Output:**

_sqlQuery_
```
SELECT *
    FROM account
    WHERE id = ? AND email = ?;
```

_QueryRes_
```js
{ id: 9, email: "a@qweqweqr2341242a.com", password: "ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb", … }
```
    
## Info

Met aanpasssing van de hvlheid params word ook de query aangepast!
Bij 1 field(column->moet de naam nog even veranderen) zal je dus ook geen AND zien staan.
Bij 4 fields zal je 3x And er tussen zien staan!

---


`getUserByIdAsync(userId)` : User

`getUserByEmailAsync(email)` : User

`userExistsByIdAsync(id)` : True ? False

`userExistsByEmailAsync(email)`: True ? False

`getAllUsersAsync()` : Array(user);

`sqlSelectAsync(table, column = null, params = null)`

`sqlInsertAsync(table, column, params)`

`sqlDeleteAsync(table, column, params)`

---

## MORE ORMMMMM

**Feed back Pim:**

- Je vindt een entiteit(tabel) via db.`<entitity>`
- dan heb je verschillende functionaliteiten, `update, find, remove`
- Met een callback(of **liever async/await**)

---

```sql

SELECT * FROM 'account' WHERE id = 9

CREATE TABLE testTable (
    id int AUTO_INCREMENT NOT NULL,
    descriptie NVARCHAR(128)
);