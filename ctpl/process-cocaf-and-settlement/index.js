"use strict";
const connector = require("/opt/mysql-connect-ssm");
const response = require("/opt/response");
const query = require("./query");
const cocaf = require("./cocaf/cocaf");
const paynamics = require("./paynamics/paynamics");

/**
 * @typedef {Object} LambdaRequestEvent
 * @property {String} body - contains requestId and responseId
 *
 * @typedef {Object} ProcessRequest
 * @property {Number} policyId
 * @property {String} requestId
 * @property {String} rawRequestId
 * @property {String} responseId
 */

/**
 * Handler for processing ECTPL and Paynamics Settlement/Reversal
 * @param {LambdaRequestEvent} event - non Lambda Proxy Integrated data
 */
exports.handler = async function processECTPLAndPayment(event) {
    let body = JSON.parse(event.body);
    let request = buildProcessParams(body);
    console.log("Request parameters: ", request);
    return await processCTPL(request)
        .then(result => {
            console.log("Result: ", result);
            let responseBody = result;
            return response.success(responseBody);
        })
        .catch(error => {
            console.error(error);
            return response.error(error);
        });
};

/**
 * Breaks down request ID returned by paynamics for COC registration and payment processing
 * @param {String} requestId
 * @returns {ProcessRequest} ProcessRequest
 */
function dismantleRequestId(requestId) {
    let clone = requestId.toString();
    return {
        policyId: parseInt(clone.substr(3, 12), 10),
        requestId: requestId,
        rawRequestId: clone.substr(1)
    };
}

/**
 * Converts postBody to an object containing the responseId and the corresponding details
 * retrieved after breaking down the requestId
 * @param {LambdaRequestEvent} postBody
 */
function buildProcessParams(postBody) {
    let processParams = dismantleRequestId(postBody.requestId);
    processParams.responseId = postBody.responseId;
    return processParams;
}

/**
 * @param {ProcessRequest} request
 */
async function processCTPL(request) {
    let connection = await connector.connect(process.env.DB_NAME_STORE);
    try {
        await connection.beginTransaction();
        let resultSet = await connection.query(query.paymentStatus, [
            request.policyId
        ]);
        let paymentStatus = resultSet[0].paymentStatus;
        if (paymentStatus === "Approved") {
            let cocafResult = await cocaf.register(connection, request);
            await connection.commit();
            let result = cocafResult;
            if (cocafResult.mode !== "reverse") {
                console.log("Processing payment...");
                let paymentResult = await paynamics.pay(
                    connection,
                    cocafResult,
                    request
                );
                await connection.commit();
                result = paymentResult;
            }
            return result;
        } else {
            return { paytStat: paymentStatus, mode : 'auth' };
        }
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        await connection.end();
    }
}
