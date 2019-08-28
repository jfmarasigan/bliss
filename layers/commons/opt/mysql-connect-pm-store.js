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

async function getConnection() {
    const companyName = process.env.COMPANY_NAME;
    const dbParamPrefix = `/bliss/${companyName}/db`;

    const retrievalData = {
        Names: [
            `${dbParamPrefix}/host`,
            `${dbParamPrefix}/port`,
            `${dbParamPrefix}/${process.env.APPLICATION}/database`,
            `${dbParamPrefix}/user`,
            `${dbParamPrefix}/password`
        ],
        WithDecryption: true
    };

    const retrievedParams = await ssm.getParameters(retrievalData).promise();
    let connectionParameters = {
        multipleStatements: true
    };
    retrievedParams.Parameters.forEach(parameter => {
        let paramName = parameter.Name;
        let credentialName = paramName.substring(
            paramName.lastIndexOf("/") + 1
        );
        connectionParameters[credentialName] = parameter.Value;
    });

    return createConnection(connectionParameters);
}

module.exports = {
    connect: getConnection,
    mysql: mysql
};
