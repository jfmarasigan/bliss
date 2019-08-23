const connector = require("/opt/mysql-connect-ssm");
const responseBuilder = require("/opt/response");
const queryString = require("./query");

exports.handler = async event => {
    if (event.isPing) {
        console.log("Ping event");
    } else {
        return await getCarCompany().catch(error => {
            console.error(error);
            return responseBuilder.error(error);
        });
    }
};

async function getCarCompany() {
    let connection = await connector.connect(process.env.DB_NAME_STORE);
    try {
        let result = await connection.query(queryString.carCompany, []);
        return responseBuilder.success(result);
    } catch (error) {
        console.error(error);
        return responseBuilder.error(error);
    } finally {
        await connection.end();
    }
}
