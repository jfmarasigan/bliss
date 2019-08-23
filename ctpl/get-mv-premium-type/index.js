const connector = require("/opt/mysql-connect-ssm");
const responseBuilder = require("/opt/response");
const queryString = require("./query").mvPremTypes;

exports.handler = async event => {
    if (event.isPing) {
        // warmer event
        console.log("warming event");
    } else {
        const { regType, mvType } = event.queryStringParameters;
        return await getMVPremiumTypes(regType, mvType).catch(error => {
            console.error(error);
            return responseBuilder.error(error);
        });
    }
};

async function getMVPremiumTypes(regType, mvType) {
    let connection = await connector.connect(process.env.DB_NAME_STORE);
    try {
        let resultSet = await connection.query(queryString, [regType, mvType]);
        return responseBuilder.success(resultSet);
    } catch (error) {
        console.error(error);
        return responseBuilder.error(error);
    } finally {
        await connection.end();
    }
}
