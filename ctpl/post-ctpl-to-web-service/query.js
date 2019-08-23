let mcPolicy = 'CALL cpiectpl.GET_MC_POLICY_BATCH_FOR_API(?)';
let save = 'UPDATE EPIT_CTPL_TRANS SET policy_no = ?, bill_no = ?, or_no = ?, date_inserted = now() WHERE policy_id = ? AND tran_id = ?';

module.exports = {
    mcPolicy : mcPolicy,
    save : save
};