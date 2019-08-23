"use strict";
const warmer = require("lambda-warmer");
const connector = require("/opt/mysql-connect-ssm");
const response = require("/opt/response");
const query = require("./query");

exports.handler = async (event, context) => {
    const warmerParams = {
        correlationId: context.awsRequestId,
        log: true,
        delay: 50
    };

    if (await warmer(event, warmerParams)) {
        console.log("warming event");
    } else {
        return await getFAQ().catch(error => {
            console.error(error);
            return response.error(error);
        });
    }
};

async function getFAQ() {
    let connection = await connector.connect(process.env.DB_NAME_STORE);
    try {
        let faqs = await connection.query(query.faq, []);
        return response.success(faqs);
    } catch (error) {
        console.error(error);
        return response.error(error);
    } finally {
        await connection.end();
    }
}
