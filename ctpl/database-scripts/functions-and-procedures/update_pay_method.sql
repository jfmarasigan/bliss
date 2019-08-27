-- for updating payment details after authorization
DROP PROCEDURE IF EXISTS UPDATE_PAY_METHOD;

DELIMITER //

CREATE PROCEDURE UPDATE_PAY_METHOD (
	p_policy_id				bigint(12),
    p_payt_method			varchar(10),
    p_auth_res_cd			varchar(7),
    p_auth_message			varchar(250)
)
BEGIN
	DECLARE v_payt_stat VARCHAR(250);

    SELECT rv_meaning
      INTO v_payt_stat
      FROM EPIM_REF_CODES
     WHERE rv_domain = 'PAYMENT_STAT'
       AND rv_low_value = p_auth_res_cd;

    UPDATE EPIT_CTPL_TRANS
       SET payt_method = p_payt_method,
           payment_stat = concat('AUTH-', p_auth_res_cd, '-', v_payt_stat, '-', p_auth_message),
           last_update = now()
     WHERE policy_id = p_policy_id;

END//
DELIMITER ;