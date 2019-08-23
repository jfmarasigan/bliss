exports.handler = async (event) => {
    let redirectURL = process.env.HOME_PAGE;
    const qsp = event.queryStringParameters;
    console.log('Processing redirect: ', event);
    
    if (qsp && qsp.requestid && qsp.responseid) {
        const { responseid, requestid } = event.queryStringParameters;
        redirectURL = process.env.REDIRECT_URL + '?requestId=' + decode(requestid) + "&responseId=" + decode(responseid);
    }
    const response = {
        statusCode: 301,
        body: null,
        headers : {
            "Access-Control-Allow-Origin": "*",
            "Location" : redirectURL
        }
    };
    return response;
};

function decode(string, encoding) {
    let data = Buffer.from(string, 'base64');
    let base64data = data.toString('ascii');
    return base64data;
}