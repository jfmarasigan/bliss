let queryStrings = {
    policyType:
        "SELECT SUBLINE_NAME, SUBLINE_CD FROM EPIM_SUBLINE WHERE LINE_CD = 'MC'",
    mvType: "SELECT MV_TYPE_CD, MV_TYPE_DESC FROM EPIM_MV_TYPE"
};

module.exports = queryStrings;
