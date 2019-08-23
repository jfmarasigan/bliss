"use strict";
const connector = require("/opt/mysql-connect-ssm");
const responseBuilder = require("/opt/response");
const query = require("./query");

exports.handler = async event => {
    if (event.isPing) {
        // warming event
        console.log("warming event");
    } else {
        return await getTaxes().catch(error => {
            console.error(error);
            return responseBuilder.error(error);
        });
    }
};

async function getTaxes() {
    let connection = await connector.connect(process.env.DB_NAME_STORE);
    try {
        let resultSet = await connection.query(query.taxes, []);
        return responseBuilder.success(resultSet);
    } catch (error) {
        console.error(error);
        return responseBuilder.error(error);
    } finally {
        await connection.end();
    }
}
