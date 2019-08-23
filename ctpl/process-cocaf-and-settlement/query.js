let paymentStatus = `SELECT SUBSTRING_INDEX(SUBSTRING_INDEX(payment_stat, '-', 3), '-', -1) AS paymentStatus
                       FROM EPIT_CTPL_TRANS 
                      WHERE policy_id = ?`;

module.exports = {
    paymentStatus: paymentStatus
};
