const connector = require("/opt/mysql-connect-ssm");
const response = require("/opt/response");
const query = require("./query");

/**
 * @typedef { import('./query').SaveData } SaveData
 */

/**
 * @param {SaveData} saveData
 */
async function save(saveData) {
    let connection = await connector.connect(process.env.DB_NAME_STORE);

    await connection.beginTransaction();

    let saveResult = {};
    try {
        let policyData = query.getPolicyData(saveData);
        console.log(query.policyQuery);
        console.log(policyData);
        let policyResultSet = await connection.query(
            query.policyQuery,
            policyData
        );
        let policyId = policyResultSet[0].policyId;
        await connection.query(
            query.vehicleQuery,
            query.getVehicleData(policyId, saveData)
        );
        let transactionInfo = await connection.query(query.transactionQuery, [
            policyId
        ]);
        await connection.commit();
        saveResult = response.success(transactionInfo[0][0]);
    } catch (error) {
        await connection.rollback();
        saveResult = response.error(error);
    } finally {
        await connection.end();
    }
    return saveResult;
}

module.exports = {
    save: save
};
