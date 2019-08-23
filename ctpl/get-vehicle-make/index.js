const connector = require("/opt/mysql-connect-ssm");
const responseBuilder = require("/opt/response");
const queryString = require("./query").make;

exports.handler = async event => {
    if (event.isPing) {
        console.log("Ping event");
        return;
    }

    const { carCompanyCd } = event.queryStringParameters;
    return await getMake(carCompanyCd)
        .then(data => {
            return responseBuilder.success(data);
        })
        .catch(error => {
            return responseBuilder.error(error);
        });
};

async function getMake(carCompanyCd) {
    let connection = await connector.connect(process.env.DB_NAME_STORE);
    try {
        let makeList = connection.query(queryString, [carCompanyCd]);
        return makeList;
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        await connection.end();
    }
}
