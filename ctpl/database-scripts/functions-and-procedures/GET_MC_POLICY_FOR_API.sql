DROP PROCEDURE IF EXISTS GET_MC_POLICY_FOR_API;

DELIMITER //

CREATE PROCEDURE GET_MC_POLICY_FOR_API (
	p_policy_id			bigint(12)
)
BEGIN
	DECLARE v_peril_cd int(5);    
    DECLARE pol_prem_amt DOUBLE(12, 2);
    DECLARE dst_tax_amt DOUBLE(12, 2);
    DECLARE lgt_tax_amt DOUBLE(12, 2);
    DECLARE vat_tax_amt DOUBLE(12, 2);
    DECLARE af_tax_amt DOUBLE(12, 2);
    DECLARE icf_tax_amt DOUBLE(12, 2);

	SET @vat_tag := epim_param_v('CTPL_VAT_TAG');
    SET @user_id := epim_param_v('CTPL_USER');
    SET @assd_type := epim_param_v('CTPL_ASSD_TYPE');
    SET @tsi_amt := epim_param_n('CTPL_TSI_AMT');
    SET @peril_tsi_amt := epim_param_n('CTPL_PERIL_TSI');
    SET @pay_term := epim_param_v('CTPL_PAYTERM');
    SET @intm_no := epim_param_v('CTPL_INTM_NO');    
    SET @cashier_cd := epim_param_v('CTPL_CASHIER_CD');
    
    SELECT peril_cd
	  INTO v_peril_cd
      FROM EPIM_PERIL
	 WHERE line_cd = 'MC';
    
    -- get policy prem amt
    SELECT PREM_AMT
      INTO pol_prem_amt
	  FROM EPIT_CTPL_POLBASIC
	 WHERE POLICY_ID = p_policy_id;
     
	-- get amount for doc stamp tax
    SELECT CASE WHEN tax_type = 'R' THEN pol_prem_amt * (tax_rate / 100) ELSE tax_amount END
      INTO dst_tax_amt
      FROM EPIM_TAXES
	 WHERE tax_desc = 'DOCUMENTARY STAMP TAX';
     
	-- get amount for Local Government tax
    SELECT CASE WHEN tax_type = 'R' THEN pol_prem_amt * (tax_rate / 100) ELSE tax_amount END
      INTO lgt_tax_amt
      FROM EPIM_TAXES
	 WHERE tax_desc = 'LOCAL GOVERNMENT TAX';

	-- get amount for Value Added tax.
    SELECT CASE WHEN tax_type = 'R' THEN pol_prem_amt * (tax_rate / 100) ELSE tax_amount END
      INTO vat_tax_amt
      FROM EPIM_TAXES
	 WHERE tax_desc = 'VALUE ADDED TAX';
     
	-- get amount for Authentication Fee
    SELECT CASE WHEN tax_type = 'R' THEN pol_prem_amt * (tax_rate / 100) ELSE tax_amount END
      INTO af_tax_amt
      FROM EPIM_TAXES
	 WHERE tax_desc = 'AUTHENTICATION FEE';
     
	-- get amount for Interconnectivity Fee
    SELECT CASE WHEN tax_type = 'R' THEN pol_prem_amt * (tax_rate / 100) ELSE tax_amount END
      INTO icf_tax_amt
      FROM EPIM_TAXES
	 WHERE tax_desc = 'INTERCONNECTIVITY FEE';
    
	SELECT a.CORPORATE_TAG as corporateTag,
           a.FIRST_NAME AS firstName, 
           a.LAST_NAME AS lastName, 
           a.MIDDLE_INITIAL AS middleInitial, 
           date_format(a.DOB, '%e') AS birthDate,
		   date_format(a.DOB, '%M') as birthMonth, 
           date_format(a.DOB, '%Y') AS birthYear,
           CASE WHEN a.CORPORATE_TAG != 'I' THEN a.CORPORATE_NAME ELSE NULL END AS assdName,
           a.EMAIL_ADD AS emailAdd, 
           a.ADDRESS AS address, 
           a.ZIP_CD AS zipCd,
           a.PHONE_NO AS phoneNo, 
           a.TIN_NO AS assdTin, 
           @vat_tag AS vatTag, 
           CASE WHEN a.CORPORATE_TAG != 'I' THEN @assd_type ELSE null END AS industryCd, 
           a.GENDER AS gender,
           a.LINE_CD AS lineCd, 
           a.SUBLINE_CD AS sublineCd, 
           a.ISS_CD AS issCd, 
           date_format(a.ISSUE_DATE, '%Y') AS issueYear,
           date_format(a.INCEPTION_DATE, '%m/%d/%Y') AS inceptDate, 
           date_format(a.EXPIRY_DATE, '%m/%d/%Y') AS expiryDate, 
           c.TRAN_ID as refPolNo,
           @tsi_amt AS tsiAmt,
           a.PREM_AMT AS premAmt,
           a.TAX_AMT AS totalTaxAmt,
           CASE WHEN dst_tax_amt IS NULL THEN 0 ELSE dst_tax_amt END AS dstTaxAmt,
           CASE WHEN lgt_tax_amt IS NULL THEN 0 ELSE lgt_tax_amt END AS lgtTaxAmt,
           CASE WHEN vat_tax_amt IS NULL THEN 0 ELSE vat_tax_amt END AS vatTaxAmt,
           CASE WHEN af_tax_amt IS NULL THEN 0 ELSE af_tax_amt END AS afTaxAmt,
           CASE WHEN icf_tax_amt IS NULL THEN 0 ELSE icf_tax_amt END AS icfTaxAmt,
           b.MOTOR_NO AS engineNo,
           b.SERIAL_NO AS chassisNo,
           b.PLATE_NO AS plateNo,
           b.CAR_COMPANY AS carCompany,
           b.MODEL_YEAR AS modelYear,
           b.MAKE AS carMake, 
           b.ENGINE_SERIES AS carSeries,
           b.COC_SERIAL_NO AS cocNo,
           b.COC_ATCN AS cocAtcn,
           b.COLOR AS color,
           b.REG_TYPE AS regType,
           b.MV_FILE_NO AS mvFileNo,
           b.MV_TYPE_CD AS mvType,
           b.MV_PREM_TYPE_CD AS mvPremTypeCd, 
           b.ASSIGNEE AS assignee,
           b.MOT_TYPE AS motType,
           b.UNLADEN_WT AS unladenWt,
           (SELECT rv_meaning FROM EPIM_REF_CODES WHERE rv_low_value = b.mot_type) AS motWeight,
           b.NO_OF_PASS AS noOfPass,
           v_peril_cd AS perilCd,
           @peril_tsi_amt AS perilTsi,
           @pay_term AS payTerm,
           @intm_no AS intmNo,
           @cashier_cd AS cashierCd,
           c.PAYT_METHOD AS paytMethod,
           c.PAYT_REF_NO AS paytRefNo,
           @user_id AS userId
      FROM EPIT_CTPL_POLBASIC a
      JOIN MC_VEHICLE_INFO b ON a.POLICY_ID = b.POLICY_ID
      JOIN EPIT_CTPL_TRANS c ON a.POLICY_ID = c.POLICY_ID
	 WHERE a.policy_id = p_policy_id;
END//

DELIMITER ;
