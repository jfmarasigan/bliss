let policy = "SELECT SAVE_POLICY(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) as policyId";
let vehicle = "CALL SAVE_VEHICLE_DETAILS(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
let transaction = "CALL SAVE_TRANS_INFO(?)";

/**
 * @returns {Array<String | Number>}
 * @param {SaveData} saveData 
 */
function buildPolicyQueryData(saveData) {
    let policyData = saveData.policy;
    
    const inceptionDate = policyData.inceptionDate.split("/");
    let inceptDate = new Date(parseInt(inceptionDate[2], 10), parseInt(inceptionDate[0], 10) - 1, parseInt(inceptionDate[1], 10));
    
    const expiryDate = policyData.expiryDate.split("/");
    let expDate = new Date(parseInt(expiryDate[2], 10), parseInt(expiryDate[0], 10) - 1, parseInt(expiryDate[1], 10));
    
    const dobDate = policyData.dob.split("/");
    let dob = new Date(parseInt(dobDate[2], 10), parseInt(dobDate[0], 10) - 1, parseInt(dobDate[1], 10));
    
    return [
        policyData.sublineCd,
        inceptDate,
        expDate,
        policyData.firstName,
        policyData.lastName,
        policyData.middleInitial,
        dob,
        policyData.gender,
        policyData.emailAdd,
        policyData.address,
        policyData.phoneNo,
        policyData.tinNo,
        policyData.corporateTag,
        policyData.corporateName,
        policyData.premAmt,
        policyData.taxAmt,
        policyData.zipCode
    ];
}

/**
 * @returns {Array<String | Number>}
 * @param {Number} policyId 
 * @param {SaveData} saveData 
 */
function buildVehicleQueryData(policyId, saveData) {
    let vehicleData = saveData.vehicle;
    return [
        policyId, 
        vehicleData.regType, 
        vehicleData.modelYear, 
        vehicleData.carCompanyCd, 
        vehicleData.makeCd, 
        vehicleData.seriesCd, 
        vehicleData.plateNo, 
        vehicleData.serialNo, 
        vehicleData.motorNo, 
        vehicleData.mvFileNo,
        vehicleData.mvTypeCd, 
        vehicleData.mvPremTypeCd, 
        vehicleData.color,
        vehicleData.assignee
    ];
}

module.exports = {
    policyQuery : policy,
    vehicleQuery : vehicle,
    transactionQuery : transaction,
    getPolicyData : buildPolicyQueryData,
    getVehicleData : buildVehicleQueryData
};


/**
 * @typedef {Object} Policy
 * @property {String} sublineCd
 * @property {String} inceptionDate
 * @property {String} expiryDate
 * @property {String} firstName
 * @property {String} lastName
 * @property {String} middleInitial
 * @property {String} dob
 * @property {String} gender
 * @property {String} emailAdd
 * @property {String} address
 * @property {String} phoneNo
 * @property {String} tinNo
 * @property {String} corporateTag
 * @property {String} corporateName
 * @property {Number} premAmt
 * @property {Number} taxAmt
 * @property {String} zipCode
 * 
 * @typedef {Object} Vehicle
 * @property {String} regType
 * @property {Number} modelYear
 * @property {String} carCompanyCd
 * @property {String} makeCd
 * @property {String} seriesCd
 * @property {String} plateNo
 * @property {String} serialNo
 * @property {String} motorNo
 * @property {String} mvFileNo
 * @property {String} mvTypeCd
 * @property {String} mvPremTypeCd
 * @property {String} color
 * @property {String} assignee
 * 
 * @typedef {Object} SaveData
 * @property {Policy} policy
 * @property {Vehicle} vehicle
 */