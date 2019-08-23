/**
 * @typedef {Object} ConnectionParameters
 * @property {String} name
 * @property {String} host
 * @property {Number} port
 * @property {String} user
 * @property {String} pass
 */

"use strict";
const mysql = require("promise-mysql");
const AWS = require("aws-sdk");
AWS.config.update({ region: process.env.AWS_REGION });
const kms = new AWS.KMS();

/**
 * Creates a mysql connection instance
 * @param {ConnectionParameters} params
 * @param {String} user - username used to login to the mysql database
 * @param {String} password - password used to login to the mysql database
 */
function createConnection(params, user, password) {
    return mysql.createConnection({
        host: params.host,
        port: params.port,
        database: params.name,
        user: user,
        password: password,
        multipleStatements: true
    });
}

/**
 * @param {ConnectionParameters} connectionParams
 */
async function getConnection(connectionParams) {
    const encryptedCreds = [
        kms
            .decrypt({
                CiphertextBlob: Buffer.from(connectionParams.user, "base64")
            })
            .promise(),
        kms
            .decrypt({
                CiphertextBlob: Buffer.from(connectionParams.pass, "base64")
            })
            .promise()
    ];

    return await Promise.all(encryptedCreds)
        .then(data => {
            let credentials = {
                user: data[0].Plaintext.toString("ascii"),
                pass: data[1].Plaintext.toString("ascii")
            };
            return createConnection(
                connectionParams,
                credentials.user,
                credentials.pass
            );
        })
        .catch(error => {
            console.error("Error when decrypting: ", error);
            throw error;
        });
}

module.exports = {
    connect: getConnection,
    mysql: mysql
};
