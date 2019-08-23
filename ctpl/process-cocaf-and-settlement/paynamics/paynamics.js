'use strict';
const soapRequest = require('easy-soap-request');
const parseString = require('xml2js').parseString;
const crypto = require('crypto');
const paynamicsSoap = require('./paynamics-soap.json');
const queries = require("./paynamics-query.json");

/**
 * @typedef {import('promise-mysql').Connection} Connection
 * 
 * @typedef {Object} PaymentData
 * @property {string} mode
 * @property {string} tranId
 * @property {string} amount
 * @property {string} requestId
 * @property {string} responseId
 * 
 * @typedef {import('../index').ProcessRequest} ProcessRequest
 * 
 * @param {Connection} connection 
 * @param {PaymentData} paymentData
 * @param {ProcessRequest} requestData
*/
async function processPayment(connection, paymentData, requestData) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '1';
    const mode = paymentData.mode;
    const tranId = paymentData.tranId;
    const amount = paymentData.amount;
    try {
        let paymentResponse = await callPaymentMode(mode, paymentData, requestData);
        let paymentResult = await getPaymentResult(mode, paymentResponse);
        let paytStat = await updateStatus(connection, paymentResult, tranId, amount);
        let paymentResultData = {
            mode : mode,
            paymentResult : paymentResult,
            policyId : requestData.policyId,
            tranId : tranId,
            amount : amount,
            paytStat : paytStat
        };
        console.log("Payment Result Data: ", paymentResultData);
        return paymentResultData;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

/**
 * 
 * @param {String} mode 
 * @param {PaymentData} data
 * @param {ProcessRequest} requestData
 */
async function callPaymentMode(mode, data, requestData) {
    const url = paynamicsSoap.url;
    const headers = {
        'user-agent': paynamicsSoap.userAgent,
        'Content-Type': 'text/xml;charset=UTF-8',
        'soapAction': paynamicsSoap.modes[mode].soapAction
    };
    const envelope = buildSOAPEnvelope(mode, data, requestData);
    console.log("Paynamics Envelope: " + envelope);
    const { response } = await soapRequest(url, headers, envelope);
    const { body } = response;
    return {
        xmlResponse : body
    };
}

/**
 * 
 * @param {String} mode 
 * @param {PaymentData} data
 * @param {ProcessRequest} requestData 
 */
function buildSOAPEnvelope(mode, data, requestData) {
    let envelope = String(paynamicsSoap.modes[mode].envelope.join(" "));
    const { amount } = data;
    const { rawRequestId, responseId } = requestData;
    const requestId = (mode !== 'reverse' ? 'S' : 'R') + rawRequestId; 
    const merchantId = process.env.MERCHANT_ID;
    const ipAddress = process.env.IP_ADDRESS;
    const notificationURL = process.env.NOTIFICATION_URL;
    const responseURL = process.env.RESPONSE_URL || '';
    const merchantKey = process.env.MERCHANT_KEY;

    envelope = envelope.replace("${merchantId}", merchantId);
    envelope = envelope.replace("${requestId}", requestId);
    envelope = envelope.replace("${responseId}", responseId);
    envelope = envelope.replace("${ipAddress}", ipAddress);
    envelope = envelope.replace("${amount}", amount);
    envelope = envelope.replace("${notificationURL}", notificationURL);
    envelope = envelope.replace("${responseURL}", responseURL);
    let unencryptedStr = merchantId.concat(requestId, responseId, ipAddress, amount, notificationURL, responseURL, merchantKey);
    let signature = generateSignature(unencryptedStr);
    envelope = envelope.replace("${signature}", signature);
    return envelope.toString();
}

/**
 * 
 * @param {String} unencryptedStr 
 */
function generateSignature(unencryptedStr) {
    console.log("String for signature: ", unencryptedStr);
    let hash = crypto.createHash('sha512');
    let updatedStr = hash.update(unencryptedStr, 'utf8');
    let encryptedStr = updatedStr.digest('hex');
    return encryptedStr;
}

/**
 * 
 * @param {String} mode 
 * @param {Object} paymentResponse 
 */
function getPaymentResult(mode, paymentResponse) {
    return new Promise((resolve, reject) => {
        let options = {
            explicitArray : false, 
            ignoreAttrs : true
        };
        parseString(paymentResponse.xmlResponse, options, (error, result) => {
            if (error) {
                reject(error);
            } else {
                let soapResponseJSON = JSON.parse(JSON.stringify(result));
                let soapBody = soapResponseJSON['soap:Envelope']['soap:Body'];

                let responseTag = paynamicsSoap.modes[mode].result.responseTag;
                let resultTag = paynamicsSoap.modes[mode].result.resultTag;
                let soapResult = soapBody[responseTag][resultTag];
                let paymentResult = createPaymentResult(soapResult);
                console.log('Payment Result: ', paymentResult);
                resolve(paymentResult);
            }
        });
    });
}

function createPaymentResult(soapResult) {
    return {
        appResponse: {
            merchantId : soapResult.application.merchantid,
            requestId : soapResult.application.request_id,
            responseId : soapResult.application.response_id,
            timestamp : soapResult.application.timestamp
        },
        responseStatus : {
            code : soapResult.responseStatus.response_code,
            message : soapResult.responseStatus.response_message,
            advise : soapResult.responseStatus.response_advise,
            id : soapResult.responseStatus.processor_response_id,
            authcode : soapResult.responseStatus.processor_response_authcode || null,
            pResponseCode : soapResult.responseStatus.processor_response_code || null,
            pResponseMessage : soapResult.responseStatus.processor_response_mess || null
        }
    };
}

/**
 * 
 * @param {Connection} connection 
 * @param {Object} paymentResult 
 * @param {String} tranId 
 * @param {String} amount 
 */
async function updateStatus(connection, paymentResult, tranId, amount) {
    try {
        let queryData = createStatusData(paymentResult, tranId, amount);
        let paytStat = await connection.query(queries.paymentQuery, queryData);
        return paytStat[0].paytStat;
    } catch (e) {
        console.error('Error when updating status after payment : ', e);
        throw e;
    }
}

function createStatusData(paymentData, tranId, amount) {
    let timestamp = new Date(paymentData.appResponse.timestamp);
    let responseCode = paymentData.responseStatus.code;
    let responseId = paymentData.appResponse.responseId;
    return [ tranId, responseCode, responseId, timestamp, amount ];
}

module.exports = {
    pay : processPayment
};