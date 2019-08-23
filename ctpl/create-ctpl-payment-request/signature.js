const tconvert = require('./text-conversion');

/**
 * @typedef {Object} SignatureData
 * @property {string} mid 
 * @property {string} request_id 
 * @property {string} ip_address 
 * @property {string} notification_url 
 * @property {string} response_url 
 * @property {string} fname 
 * @property {string} lname 
 * @property {string} mname 
 * @property {string} address1 
 * @property {string} address2 
 * @property {string} city 
 * @property {string} state 
 * @property {string} country 
 * @property {string} zip 
 * @property {string} email 
 * @property {string} phone 
 * @property {string} client_ip 
 * @property {string} amount 
 * @property {string} currency 
 * @property {string} secure3d 
 * @property {string} merchantKey 
 */

/**
 * Creates a "signed" string for use in POST redirect of paynamics
 * @param {SignatureData} data - data used to create the signature
 * @returns string
 */
function sign (data) {
    let concatenatedString = data.mid + data.request_id + data.ip_address + data.notification_url + 
        data.response_url + data.fname + data.lname + data.mname + data.address1 + data.address2 +
        data.city + data.state + data.country + data.zip + data.email + data.phone + data.client_ip +
        data.amount + data.currency + data.secure3d + data.merchantKey;
    
    console.log("String for encryption: " + concatenatedString);
    let signature = tconvert.encrypt(concatenatedString, 'sha512');
    console.log("Signature generated: " + signature);
    
    return signature;
}

module.exports = {
    generate : sign
};