function buildSuccessResponse(successData) {
    let data = successData || [];
    return {
        statusCode : 200,
        body : JSON.stringify(data),
        headers: { // CORS headers; lambda proxy integration
            "Access-Control-Allow-Origin": "*"
        }
    };
}

function buildErrorResponse(errorData) {
    return {
        statusCode : 502,
        body : JSON.stringify(errorData),
        error : errorData.toString(),
        headers: { // CORS headers; lambda proxy integration
            "Access-Control-Allow-Origin": "*"
        }
    };
}

module.exports = {
    success : buildSuccessResponse,
    error : buildErrorResponse
};