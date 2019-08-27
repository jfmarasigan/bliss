DROP FUNCTION IF EXISTS SAVE_POLICY;

DELIMITER //

CREATE FUNCTION SAVE_POLICY(
	p_subline_cd			varchar(7),
    p_inception_date		datetime,
    p_expiry_date			datetime,
    p_first_name			varchar(250),
    p_last_name				varchar(250),
    p_middle_initial		varchar(2),
    p_dob					datetime,
    p_gender				varchar(1),
    p_email_add				varchar(100),
    p_address				varchar(150),
    p_phone_no				varchar(40),
    p_tin_no				varchar(15),
    p_corporate_tag			varchar(1),
    p_corporate_name		varchar(250),
    p_prem_amt				double(12,2),
    p_tax_amt				double(12,2),
    p_zip_code				varchar(12)
) RETURNS bigint(12)
BEGIN
	DECLARE v_ctpl_iss_cd VARCHAR(200);
    DECLARE v_policy_id BIGINT(12);
    
    SET v_ctpl_iss_cd = epim_param_v('CTPL_ISS_CD');
    
    INSERT INTO EPIT_CTPL_POLBASIC (line_cd, subline_cd, iss_cd, issue_date, inception_date, expiry_date,
									first_name, last_name, middle_initial, dob, gender, email_add, address, zip_cd,
                                    phone_no, tin_no, corporate_tag, corporate_name, prem_amt, tax_amt, last_update)
		VALUES ('MC', p_subline_cd, v_ctpl_iss_cd, sysdate(), p_inception_date, p_expiry_date,
				p_first_name, p_last_name, p_middle_initial, p_dob, p_gender, p_email_add, p_address, p_zip_code,
                p_phone_no, p_tin_no, p_corporate_tag, p_corporate_name, p_prem_amt, p_tax_amt, sysdate());
    
    SET v_policy_id = last_insert_id();
    
    UPDATE EPIT_CTPL_POLBASIC
       SET prem_seq_no = v_policy_id,
		   or_no = v_policy_id
	 WHERE policy_id = v_policy_id;
    
    RETURN v_policy_id;
END//
DELIMITER ;