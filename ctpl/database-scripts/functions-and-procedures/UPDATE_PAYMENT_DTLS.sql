DROP FUNCTION IF EXISTS UPDATE_PAYMENT_DTLS;

DELIMITER //

CREATE FUNCTION UPDATE_PAYMENT_DTLS (
    p_tran_id               bigint(12),
    p_response_code         varchar(7),
    p_ref_no                varchar(250),
    p_date_paid             datetime,
    p_amount                double(12, 2)
)
RETURNS VARCHAR(250)
BEGIN
    DECLARE v_payt_stat VARCHAR(250);

    SELECT rv_meaning
      INTO v_payt_stat
    FROM EPIM_REF_CODES
   WHERE rv_domain = 'PAYMENT_STAT'
       AND rv_low_value = p_response_code;

  UPDATE EPIT_CTPL_TRANS
       SET payment_stat = v_payt_stat,
           payt_ref_no = p_ref_no,
           payt_amt = p_amount,
           date_of_payt = p_date_paid,
           last_update = now()
   WHERE tran_id = p_tran_id;

  RETURN v_payt_stat;
END//
DELIMITER ;