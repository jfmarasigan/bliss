const connector = require("/opt/mysql-connect-ssm");
const response = require("/opt/response");
const query = require("./query");

exports.handler = async event => {
    if (event.isPing) {
        console.log("Ping event");
    } else {
        const { carCompanyCd, makeCd } = event.queryStringParameters;
        return await getEngineSeries(carCompanyCd, makeCd).catch(error => {
            console.error(error);
            return response.error(error);
        });
    }
};

async function getEngineSeries(carCompanyCd, makeCd) {
    let connection = await connector.connect(process.env.DB_NAME_STORE);
    try {
        const queryParams = [carCompanyCd, makeCd];
        let engineSeries = await connection.query(
            query.engineSeries,
            queryParams
        );
        return response.success(engineSeries);
    } catch (error) {
        console.error(error);
        return response.error(error);
    }
}
