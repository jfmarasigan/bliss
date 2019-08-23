let taxes =
    "select TAX_CD, TAX_DESC, TAX_RATE, TAX_AMOUNT, TAX_TYPE from EPIM_TAXES where line_cd = 'MC'";

module.exports = {
    taxes: taxes
};
