DROP PROCEDURE IF EXISTS cpiectpl.GET_POLICY_DETAILS;

DELIMITER //

CREATE PROCEDURE cpiectpl.GET_POLICY_DETAILS (
	p_policy_id				bigint(12)
)
BEGIN
	SELECT b.REG_TYPE AS registrationType,
		   a.SUBLINE_CD AS policyType,
		   b.MV_TYPE_CD AS mvType,
           b.MV_PREM_TYPE_CD AS mvPremType,
           date_format(a.INCEPTION_DATE, '%m/%d/%Y') AS inceptionDate,
           date_format(a.EXPIRY_DATE, '%m/%d/%Y') AS expiryDate,
           b.MODEL_YEAR AS yearModel,
           b.CAR_COMPANY_CD AS carCompanyCd,
           b.MAKE_CD AS makeCd,
           b.SERIES_CD AS engineCd,
           b.COLOR AS color,
		   b.MOTOR_NO AS motorNo,
		   b.PLATE_NO AS plateNo,
           b.SERIAL_NO AS serialNo,
           b.MV_FILE_NO AS mvFileNo,
		   a.CORPORATE_TAG AS corporateTag,
           a.CORPORATE_NAME AS corporateName,
           a.FIRST_NAME AS firstName,
           a.MIDDLE_INITIAL AS middleInitial,
           a.LAST_NAME AS lastName,
           CASE WHEN date_format(a.DOB, '%m/%d/%Y') = '00/00/0000' THEN null 
				ELSE date_format(a.DOB, '%m/%d/%Y')
                END AS dateOfBirth,
           CASE WHEN LENGTH(a.GENDER) < 1 THEN null ELSE a.GENDER END AS gender,
           a.EMAIL_ADD AS emailAddress,
           a.ADDRESS AS address,
           a.ZIP_CD AS zipCd,
           a.PHONE_NO AS phoneNo,
           a.TIN_NO AS tinNo
      FROM EPIT_CTPL_POLBASIC a
      JOIN EPIT_CTPL_VEHICLE b
        ON a.POLICY_ID = b.POLICY_ID
	 WHERE a.POLICY_ID = p_policy_id;
END //

DELIMITER ;