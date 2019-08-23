const crypto = require('crypto');

/**
 * encodes a string
 * @param {string} string to be encoded 
 * @param {string} encoding
 */
function encode(string, encoding) {
    let data = Buffer.from(string);
    let enc = encoding || 'base64';
    let base64data = data.toString(enc);
    return base64data;
}

/**
 * decodes a string
 * @param {string} string to be encoded 
 * @param {string} encoding
 */
function decode(string, encoding) {
    let enc = encoding || 'base64';
    let data = Buffer.from(string, enc);
    let base64data = data.toString('ascii');
    return base64data;
}

/**
 * returns an encrypted string based on the algorithm input
 * 
 * @param {string} string to be encrypted
 * @param {string} algorithm encryption
 */
function encrypt(string, algorithm) {
    let encAlgo = algorithm || 'sha256';
    let hash = crypto.createHash(encAlgo);
    let data = hash.update(string, 'utf8');
    let encrypted = data.digest('hex');
    return encrypted;
}

module.exports = {
    encode : encode,
    decode : decode,
    encrypt : encrypt
};