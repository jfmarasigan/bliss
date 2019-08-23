exports.handler = async (event) => {
    let redirectURL = process.env.HOME_PAGE;
    const qsp = event.queryStringParameters;
    console.log('Processing redirect: ', event);
    
    if (qsp && qsp.invnum && qsp.rid) {
        const invoiceNum = event.queryStringParameters.invnum;
        const requestId = event.queryStringParameters.rid;
        redirectURL = process.env.REDIRECT_URL + '?requestId=' + requestId + "&responseId=" + invoiceNum;
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
