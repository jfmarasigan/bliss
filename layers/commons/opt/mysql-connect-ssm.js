/**
 * @typedef {Object} ConnectionParameters
 * @property {String} host - host location used for logging in to the mysql database
 * @property {String} port - port used for logging in to the mysql database
 * @property {String} databaseName - name of the database to be used
 * @property {String} user - username used to login to the mysql database
 * @property {String} password - password used to login to the mysql database
 */

"use strict";
const mysql = require("promise-mysql");
const AWS = require("aws-sdk");
AWS.config.update({ region: process.env.AWS_REGION });
const ssm = new AWS.SSM();

/**
 * Creates a mysql connection instance
 * @param {ConnectionParameters} credentials
 */
function createConnection(credentials) {
    return mysql.createConnection({
        host: credentials.host,
        port: credentials.port,
        database: credentials.databaseName,
        user: credentials.user,
        password: credentials.password,
        multipleStatements: true
    });
}

/**
 * @param {String} databaseNameStore
 */
async function getConnection(databaseNameStore) {
    const retrievalData = {
        Names: [
            "MYSQL_DB_HOST",
            "MYSQL_DB_PORT",
            databaseNameStore,
            "MYSQL_DB_USER",
            "MYSQL_DB_PASSWORD"
        ],
        WithDecryption: true
    };
    console.log("Retrieving parameters...");
    const retrievedParams = await ssm.getParameters(retrievalData).promise();
    let credentials = {};
    retrievedParams.Parameters.forEach(parameter => {
        credentials[parameter.Name] = parameter.Value;
    });

    console.log("Creating MYSQL connection...");
    return createConnection({
        host: credentials["MYSQL_DB_HOST"],
        port: credentials["MYSQL_DB_PORT"],
        databaseName: credentials[databaseNameStore],
        user: credentials["MYSQL_DB_USER"],
        password: credentials["MYSQL_DB_PASSWORD"]
    });
}

module.exports = {
    connect: getConnection,
    mysql: mysql
};
