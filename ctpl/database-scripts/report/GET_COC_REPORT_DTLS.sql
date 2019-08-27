CREATE DEFINER=`CPI`@`%` PROCEDURE `GET_COC_REPORT_DTLS`(
	p_policy_id		BIGINT(12)
)
BEGIN
    DECLARE v_policy_no VARCHAR(20);
    DECLARE v_assured VARCHAR(250);
    DECLARE v_address VARCHAR(150);
    DECLARE v_coc_no VARCHAR(10);
    DECLARE v_issue_date VARCHAR(30);
    DECLARE v_incept_date VARCHAR(30);
	DECLARE v_expiry_date VARCHAR(30);
    DECLARE v_model_year VARCHAR(4);
    DECLARE v_make VARCHAR(110);
    DECLARE v_type_of_body VARCHAR(30);
    DECLARE v_color VARCHAR(50);
    DECLARE v_mv_file_no VARCHAR(15);
    DECLARE v_plate_no VARCHAR(10);
    DECLARE v_serial_no VARCHAR(25);
    DECLARE v_motor_no VARCHAR(30);
    DECLARE v_no_of_pass INT(3);
    DECLARE v_unladen_weight VARCHAR(240);
    DECLARE v_sum_insured DOUBLE(16, 2);
    DECLARE v_premium DOUBLE(12, 2);
	DECLARE v_coc_atcn VARCHAR(12);
    DECLARE v_company_tin VARCHAR(200);
    DECLARE v_signatory_name VARCHAR(200);
    DECLARE v_signatory_des VARCHAR(200);
    DECLARE v_or_no VARCHAR(14);
    DECLARE v_company_name VARCHAR(200);
    DECLARE v_company_addr VARCHAR(200);
    DECLARE v_company_tel VARCHAR(100);
    
    SET time_zone = "+8:00";
    
    SET v_sum_insured = epim_param_n('CTPL_PERIL_TSI');
    SET v_company_tin = epim_param_v('BRANCH_TIN');
    SET v_signatory_name = epim_param_v('CTPL_SIGNATORY');
    SET v_signatory_des = epim_param_v('CTPL_SIGNATORY_DES');
    SET v_company_name = epim_param_v('COMP_NAME');
    SET v_company_addr = epim_param_v('COMP_ADD');
    SET v_company_tel = epim_param_v('COMP_TEL');
    
	SELECT CASE WHEN corporate_name != '' THEN corporate_name
                ELSE CONCAT(first_name, ' ', CASE WHEN middle_initial = '' THEN ''
                                                  ELSE CONCAT(middle_initial, '. ')
											 END, last_name)
		   END,
           address,
           DATE_FORMAT(issue_date, '%m-%d-%Y'),
           DATE_FORMAT(inception_date, '%m-%d-%Y'),
           DATE_FORMAT(expiry_date, '%m-%d-%Y'),
           prem_amt,
           CONCAT(line_cd, '-', subline_cd, '-', iss_cd, '-', DATE_FORMAT(issue_date, '%y'),
				'-', prem_seq_no, '-00'),
		   CONCAT(epim_param_v('CTPL_OR_PREF'), '-', or_no)
      INTO v_assured,
		   v_address,
           v_issue_date,
           v_incept_date,
           v_expiry_date,
           v_premium,
           v_policy_no,
           v_or_no
      FROM EPIT_CTPL_POLBASIC
	 WHERE policy_id = p_policy_id;
     
	SELECT a.coc_no, a.model_year, b.make, b.type_of_body, a.color,
		   a.mv_file_no, a.plate_no, a.serial_no, a.motor_no, a.no_of_pass,
           a.unladen_wt, coc_atcn
      INTO v_coc_no, v_model_year, v_make, v_type_of_body, v_color,
		   v_mv_file_no, v_plate_no, v_serial_no, v_motor_no, v_no_of_pass,
           v_unladen_weight, v_coc_atcn
      FROM EPIT_CTPL_VEHICLE a,
		   EPIM_MC_MAKE b
	 WHERE a.policy_id = p_policy_id
       AND a.car_company_cd = b.car_company_cd
       AND a.make_cd = b.make_cd;

    SELECT v_policy_no 'policy_no',
		   v_assured 'assured',
           v_address 'assured_addr',
           v_coc_no 'coc_no',
           v_issue_date 'issue_date',
           v_incept_date 'incept_date',
           v_expiry_date 'expiry_date',
           v_model_year 'model_year',
           v_make 'make',
           v_type_of_body 'type_of_body',
           v_color 'color',
           v_mv_file_no 'mv_file_no',
           v_plate_no 'plate_no',
           v_serial_no 'serial_no',
           v_motor_no 'motor_no',
           v_no_of_pass 'no_of_pass',
           v_unladen_weight 'unladen_weight',
           v_sum_insured 'sum_insured',
           v_premium 'premium',
           v_coc_atcn 'coc_atcn',
           v_company_tin 'company_tin',
           v_signatory_name 'signatory_name',
           v_signatory_des 'signatory_des',
           v_or_no 'or_no',
           v_company_name 'company_name',
           v_company_addr 'company_addr',
           v_company_tel 'company_tel';
END