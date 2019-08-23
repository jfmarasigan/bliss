const connector = require("/opt/mysql-connect-ssm");
const responseBuilder = require("/opt/response");

exports.handler = async event => {
    if (event.isPing) {
        console.log("Ping event");
    } else {
        const policyId = event.queryStringParameters.policyId;
        return await getDetailsOfPolicyId(policyId).catch(error => {
            console.log(error);
            return responseBuilder.error(error);
        });
    }
};

async function getDetailsOfPolicyId(policyId) {
    let connection = await connector.connect(process.env.DB_NAME_STORE);
    try {
        const queryString = "CALL GET_POLICY_DETAILS(?)";
        let resultSet = await connection.query(queryString, [policyId]);
        let policyDetails = resultSet[0][0];
        return responseBuilder.success(policyDetails);
    } catch (error) {
        console.error(error);
        return responseBuilder.error(error);
    } finally {
        await connection.end();
    }
}
