const mysql = require("mysql2/promise");

/**
 *
 * Establish a connection with the database. 
 * 
 * @param {boolean} [multipleStatements=false] - parameter used to inform if will use multiple queries at once.
 * @returns a new connection.
 */
async function connect(multipleStatements = false) {
    return await mysql.createConnection({
        host: "127.0.0.1",
        port: "3306",
        database: "database_development",
        user: "api",
        password: "password",
        multipleStatements: multipleStatements,
        dateStrings: true
    });
}

/**
 * 
 * End the connection with the database. 
 *
 * @param {*} connection - connection with the database.
 */
function close(connection) {

    if(connection){
        connection.end();
    }
    
}

/**
 * 
 * Method to escape any query to avoid SQL Injection.
 * The query must respect sql format and all values that will be 
 * pass through args must be represent by ? in the query. 
 *
 * @param {*} query
 * @param {*} args
 * @returns escaped query
 */
function formatQuery(query, args) {
    
    return mysql.format(query, args);
}

module.exports = {
    connect,
    close,
    formatQuery
}
