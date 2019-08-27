DROP PROCEDURE IF EXISTS GET_COC_MC_DTLS;

DELIMITER //

CREATE PROCEDURE GET_COC_MC_DTLS(
	p_policy_id				bigint(12)
) 
BEGIN
	DECLARE v_cocaf_user VARCHAR(30);
    DECLARE v_cocaf_pwd VARCHAR(10);
    DECLARE v_ctpl_vat_tag VARCHAR(200);

	SELECT COCAF_USER, COCAF_PWD
      INTO v_cocaf_user, v_cocaf_pwd
      FROM EPIM_COCAF_USERS
	 LIMIT 1;
    
    SET v_ctpl_vat_tag = epim_param_v('CTPL_VAT_TAG');
    
    SELECT v_cocaf_user AS cocafUser, v_cocaf_pwd AS cocafPwd, v_ctpl_vat_tag AS vatTag,
		   c.REG_TYPE AS regType, c.COC_NO AS cocNo, c.PLATE_NO AS plateNo, c.MV_FILE_NO AS mvFileNo, 
           c.MOTOR_NO AS motorNo, c.SERIAL_NO AS serialNo, date_format(a.INCEPTION_DATE, '%m/%d/%Y') AS inceptionDate, 
           date_format(a.EXPIRY_DATE, '%m/%d/%Y') AS expiryDate, c.MV_TYPE_CD AS mvType, c.MV_PREM_TYPE_CD AS mvPremType,
           CASE WHEN a.CORPORATE_TAG = 'I' THEN CONCAT(a.FIRST_NAME, ' ', a.MIDDLE_INITIAL, ' ', a.LAST_NAME)
				ELSE a.CORPORATE_NAME
                END AS pname,
		   CASE WHEN LENGTH(TIN_NO) = 11 THEN concat(TIN_NO, "-000")
			    ELSE TIN_NO
                END AS tinNo, CAST(a.PREM_AMT + a.TAX_AMT AS CHAR) AS amount,
           b.TRAN_ID AS tranId, p_policy_id AS policyId
      FROM EPIT_CTPL_POLBASIC a
      JOIN EPIT_CTPL_TRANS b
        ON a.POLICY_ID = b.POLICY_ID
	  JOIN EPIT_CTPL_VEHICLE c
        ON a.POLICY_ID = c.POLICY_ID
     WHERE b.POLICY_ID = p_policy_id;
END//
DELIMITER ;