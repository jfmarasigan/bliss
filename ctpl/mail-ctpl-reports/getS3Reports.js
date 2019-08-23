const AWS = require('aws-sdk');
const S3 = new AWS.S3();

/** 
 * @param {string} bucket - S3 bucket name
 * @param {string} key - S3 object name (this includes the "directory" of the object)
*/
async function getS3Object(bucket, key) {
    return S3.getObject({
        Bucket : bucket,
        Key : key
    }).promise();
}

async function buildS3GetObjectPromises(bucket, prefix) {
    let files = [];
    const reports = process.env.REPORTS.split(",,");
    for (let index = 0; index < reports.length; index++) {
        let key = process.env.BASE_FOLDER + "/" +prefix + "/" + reports[index] + process.env.REPORT_FILE_EXTENSION;
        files.push(getS3Object(bucket, key));
    }

    return await Promise.all(files);
}

module.exports = {
    getAttachments : buildS3GetObjectPromises
};