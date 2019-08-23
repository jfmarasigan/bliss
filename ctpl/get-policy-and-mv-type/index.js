const connector = require("/opt/mysql-connect-ssm");
const responseBuilder = require("/opt/response");
const queries = require("./query");

exports.handler = async event => {
    if (event.isPing) {
        // warming event
        console.log("warming event");
    } else {
        return await getPolicyAndMVType().catch(error => {
            console.error(error);
            return responseBuilder.error(error);
        });
    }
};

async function getPolicyAndMVType() {
    let connection = await connector.connect(process.env.DB_NAME_STORE);
    try {
        const queryString = queries.policyType + ";" + queries.mvType;
        let results = await connection.query(queryString, []);
        let body = {
            policyType: results[0],
            mvType: results[1]
        };
        return responseBuilder.success(body);
    } catch (error) {
        console.error(error);
        return responseBuilder.error(error);
    } finally {
        await connection.end();
    }
}
