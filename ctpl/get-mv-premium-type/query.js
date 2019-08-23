const mvPremTypes =
    "SELECT MV_PREM_TYPE_CD, MV_PREM_TYPE_DESC, PREM_AMT FROM EPIM_MV_PREM_TYPE WHERE REG_TYPE = ? AND MV_TYPE_CD = ?";

module.exports = {
    mvPremTypes: mvPremTypes
};
