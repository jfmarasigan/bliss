const cheerio = require("cheerio");
const query = require("./query");
const connector = require("/opt/mysql-connect-ssm");
const response = require("/opt/response");

exports.handler = async event => {
    let paymentResponse = event.body.replace("paymentresponse=", "");
    let decodedResponse = decode(paymentResponse, "base64");

    let $ = cheerio.load(decodedResponse, { xmlMode: true });

    const responseData = {
        merchantId: $("application merchantid").text(),
        requestId: $("application request_id").text(),
        responseId: $("application response_id").text(),
        timestamp: $("application timestamp").text(),
        payType: $("application ptype").text(),
        responseCode: $("responseStatus response_code").text(),
        responseMessage: $("responseStatus response_message").text(),
        responseAdvise: $("responseStatus response_advise").text(),
        processorResponseId: $("responseStatus processor_response_id").text(),
        processorResponseAuthcode: $("responseStatus processor_response_authcode").text()
    };

    let policyId = parseInt(responseData.requestId.substr(3, 12), 10);
    responseData.policyId = policyId;

    console.log("Updating record for data: ", responseData);

    return await updatePaytMethod(responseData).catch(error => {
        console.error(error);
        return response.error(error);
    });
};

async function updatePaytMethod(responseData) {
    let connection = await connector.connect(process.env.DB_NAME_STORE);
    try {
        let queryData = [
            responseData.policyId,
            responseData.payType,
            responseData.responseCode,
            responseData.responseMessage
        ];
        await connection.beginTransaction();
        await connection.query(query.updatePayMethod, queryData);
        await connection.commit();
    } catch (error) {
        console.error(error);
        await connection.rollback();
        return response.error(error);
    } finally {
        await connection.end();
    }
}

function decode(string, encoding) {
    let enc = encoding || "base64";
    let data = Buffer.from(string, enc);
    let base64data = data.toString("ascii");
    return base64data;
}
