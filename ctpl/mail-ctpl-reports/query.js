const connector = require("/opt/mysql-connect-ssm");
const recipientQuery =
    "SELECT email_add AS emailAdd FROM EPIT_CTPL_POLBASIC WHERE policy_id = ?";

/**
 *
 * @param {Number} policyId
 */
async function getRecipient(policyId) {
    let connection = await connector.connect(process.env.DB_NAME_STORE);
    try {
        let result = await connection.query(recipientQuery, [policyId]);
        let recipient = result[0].emailAdd;
        return recipient;
    } catch (e) {
        throw e;
    } finally {
        await connection.end();
    }
}

module.exports = {
    getRecipient: getRecipient
};
