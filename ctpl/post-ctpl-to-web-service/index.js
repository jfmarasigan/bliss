const connector = require('/opt/mysql-connect');
const query = require('./query');
const needle = require('needle');
const crypto = require('crypto');

const numberOfRecords = parseInt(process.env.NUMBER_OF_RECORDS, 10);

exports.handler = async(event) => {
    // get connection
    let connection = await connector.connect({ 
        host : process.env.dbhost,
        port : process.env.dbport,
        name : process.env.dbname,
        user : process.env.dbuser, 
        pass : process.env.dbpassword 
    });

    // get data to push to local network app
    let queryData = await connection.query(query.mcPolicy, [numberOfRecords]);
    let postData = queryData[0];

    // push data
    let pushResults = {
        recordCount : postData.length,
        success : 0,
        failed : {
            count : 0,
            errorMessages : []
        }
    };
    for (let index = 0; index < postData.length; index++) {
        const element = createPostData(postData[index]);
        let response = await pushDataToLocalApp(element);
        // if (response.message && response.type) {
        //     pushResults.failed.count++;
        //     pushResults.failed.errorMessages.push("[" + element.policyId + "] " + response.errorMessage);
        // } else {
        //     pushResults.success++;
        //     // save to db, pass connection , policy_id, tran_id
        //     let queryData = [response.policyNo, response.invoiceNo, response.orNo, element.policyId, element.tranId];
        //     await connection.query(query.save, queryData);
        // }
        console.log(response);
    }
    await connection.end();
    console.log("Push results: ", pushResults);
};

/**
 * @param {PostData} postData
 * @return {PostData} postData
 */
function createPostData(postData) {
    postData.tranId = postData.refPolNo;
    return postData;
}

/**
 * @return {PostResponse} response
 * @param {PostData} data 
 */
async function pushDataToLocalApp(data) {
    const hashKey = encrypt('CPI' + data.cocNo + data.inceptDate, 'sha256');
    // call web service
    const url = process.env.GENIISYS_ECTPL_URL;
    const method = 'post';
    const options = {
        headers : {  
            hashKey : hashKey,
            'Content-Type' : 'application/json'
        },
        json : true
    };
    let response = await needle(method, url, {}, options);

    return response.body;
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

/**
 * type definitions
 * 
 * @typedef {Object} PostResponse
 * @property {String} message 
 * @property {String} type
 * @property {String} policyNo 
 * @property {String} invoiceNo
 * @property {String} orNo
 * 
 * @typedef {Object} PostData
 * @property {Number} policyId
 * @property {String} corporateTag
 * @property {String} firstName
 * @property {String} lastName
 * @property {String} middleInitial
 * @property {Number} birthDate
 * @property {String} birthMonth
 * @property {Number} birthYear
 * @property {String} assdName
 * @property {String} emailAdd
 * @property {String} address
 * @property {Number} zipCd
 * @property {Number} phoneNo
 * @property {String} assdTin
 * @property {Number} vatTag
 * @property {Number} industryCd
 * @property {String} gender
 * @property {String} lineCd
 * @property {String} sublineCd
 * @property {String} issCd
 * @property {Number} issueYear
 * @property {String} inceptDate
 * @property {String} expiryDate
 * @property {Number} refPolNo
 * @property {Number} tsiAmt
 * @property {Number} premAmt
 * @property {Number} totalTaxAmt
 * @property {Number} dstTaxAmt
 * @property {Number} lgtTaxAmt
 * @property {Number} vatTaxAmt
 * @property {Number} afTaxAmt
 * @property {Number} icfTaxAmt
 * @property {String} engineNo
 * @property {String} chassisNo
 * @property {String} plateNo
 * @property {String} carCompany
 * @property {Number} modelYear
 * @property {String} carMake
 * @property {String} carSeries
 * @property {Number} cocNo
 * @property {String} cocAtcn
 * @property {String} color
 * @property {String} regType
 * @property {String} mvFileNo
 * @property {String} mvType
 * @property {String} mvPremTypeCd
 * @property {String} assignee
 * @property {Number} motType
 * @property {String} unladenWt
 * @property {String} motWeight
 * @property {Number} noOfPass
 * @property {Number} perilCd
 * @property {Number} perilTsi
 * @property {String} payTerm
 * @property {Number} intmNo
 * @property {Number} cashierCd
 * @property {String} paytMethod
 * @property {String} paytRefNo
 * @property {String} userId
 * @property {Number} tranId
 */