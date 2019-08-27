DROP FUNCTION IF EXISTS SAVE_TRANS_INFO;

DELIMITER //

CREATE FUNCTION SAVE_TRANS_INFO(
	p_policy_id				bigint(12)
)
RETURNS BIGINT(12) 
BEGIN
	DECLARE v_tran_id BIGINT(12);
    DECLARE v_payt_req_id VARCHAR(32);
    DECLARE v_iss_cd VARCHAR(2);
    DECLARE v_plate_no VARCHAR(10);

	INSERT INTO EPIT_CTPL_TRANS (policy_id, payment_stat, last_update)
		VALUES (p_policy_id, 'PAYMENT TRANSACTED', sysdate());	
	
    SELECT plate_no
      INTO v_plate_no
	  FROM EPIT_CTPL_VEHICLE
	 WHERE policy_id = p_policy_id;
    
    SET v_tran_id = last_insert_id();
    SET v_iss_cd = epim_param_v('CTPL_ISS_CD');
    SET v_payt_req_id = CONCAT('A', v_iss_cd, LPAD(p_policy_id, 12, '0'), v_plate_no);
    
    SELECT v_tran_id AS tranId, v_payt_req_id AS paymentRequestId;
END//
DELIMITER ;