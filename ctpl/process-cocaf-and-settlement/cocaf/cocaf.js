const soapRequest = require('easy-soap-request');
const parseString = require('xml2js').parseString;
const cocafSoap = require('./cocaf-soap');
const queries = require('./cocaf-query.json');

async function register(connection, requestData) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    try {
        let mcDtls = await getCOCMCDetails(connection, requestData);
        let registrationData = await callCOCRegistration(mcDtls);
        let registrationResult = await getCOCRegistrationResult(registrationData);
        console.log("Registration result: ", registrationResult);
        let cocafStatus = await updateStatus(connection, registrationResult);
        return cocafStatus;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

async function getCOCMCDetails(connection, requestData) {
    try {
        let details = await connection.query(queries.cocafDetails, [requestData.policyId]);
        let result = details[0][0];
        console.log("MC Dtls: ", JSON.stringify(result));
        return result;
    } catch (e) {
        console.error("Error when retrieving COC MC Details: ", e);
        throw e;
    }
}

async function callCOCRegistration(mcDtls) {
    const url = cocafSoap.url;
    const headers = {
        'user-agent': cocafSoap.userAgent,
        'Content-Type': 'text/xml;charset=UTF-8'
    };
    const envelope = cocafSoap.envelope(mcDtls);
    console.log('COC Envelope: ', envelope);
    const { response } = await soapRequest(url, headers, envelope);
    const { body } = response;
    console.log('COCAF SOAP Response: ', body);
    return {
        tranId : mcDtls.tranId,
        policyId : mcDtls.policyId,
        amount : mcDtls.amount,
        body : body
    };
}

function getCOCRegistrationResult(registrationData) {
    return new Promise((resolve, reject) => {
        let options = {
            explicitArray : false, 
            ignoreAttrs : true
        };
        parseString(registrationData.body, options, (error, parseResult) => {
            if (error) {
                reject(error);
            } else {
                let soapResponseJSON = JSON.parse(JSON.stringify(parseResult));
                let soapBody = soapResponseJSON['soap:Envelope']['soap:Body']['ns1:registerResponse']['return'];
                console.log("soapResponseJSON: ", soapResponseJSON);
                console.log("soapBody: ", soapBody);
                let result = {
                    tranId: registrationData.tranId,
                    policyId: registrationData.policyId,
                    amount : registrationData.amount, 
                    responseData : soapBody
                };
                resolve(result);
            }
        });
    });
}

async function updateStatus(connection, registrationResult) {
    try {
        let queryData = buildQueryData(registrationResult);
        await connection.query(queryData.query, queryData.params);
        return {
            message : 'SUCCESS',
            mode : queryData.isError ? "reverse" : "settle",
            amount : registrationResult.amount,
            tranId : registrationResult.tranId,
            policyId : registrationResult.policyId,
            errorMessage : queryData.isError ? registrationResult.responseData.errorMessage : null,
        };
    } catch (e) {
        console.error("Error when updating status: ", e);
        throw e;
    }
}

function buildQueryData(registrationResult) {
    let { errorMessage, authNo, cocNo } = registrationResult.responseData;
    if (errorMessage) {
        return {
            isError : true,
            query : queries.cocafQuery.trans,
            params : [errorMessage, registrationResult.tranId]
        };
    } else {
        return {
            isError : false,
            query : queries.cocafQuery.trans + "; " + queries.cocafQuery.vehicle,
            params : ['SUCCESS', registrationResult.tranId, cocNo, authNo, registrationResult.policyId]
        };
    }
}

module.exports = {
    register : register
};