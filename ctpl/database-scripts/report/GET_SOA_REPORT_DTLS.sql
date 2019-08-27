CREATE DEFINER=`CPI`@`%` PROCEDURE `GET_SOA_REPORT_DTLS`(
	p_policy_id		BIGINT(12)
)
BEGIN
    DECLARE v_company_name VARCHAR(200);
    DECLARE v_company_addr VARCHAR(200);
    DECLARE v_contact_dtls VARCHAR(610);
    DECLARE v_company_tin VARCHAR(200);
    DECLARE v_bill_no VARCHAR(20);
    DECLARE v_pol_stat VARCHAR(20);
    DECLARE v_intermediary VARCHAR(200);
    DECLARE v_agent VARCHAR(200);
    DECLARE v_issue_date VARCHAR(30);
	DECLARE v_incept_date VARCHAR(30);
	DECLARE v_expiry_date VARCHAR(30);
    DECLARE v_assured VARCHAR(250);
    DECLARE v_address VARCHAR(150);
    DECLARE v_line_name VARCHAR(20);
    DECLARE v_policy_no VARCHAR(20);
    DECLARE v_item_desc VARCHAR(200);
    DECLARE v_sum_insured DOUBLE(16, 2);
    DECLARE v_premium DOUBLE(12, 2);
    DECLARE v_tot_amt DOUBLE(24, 2);
    DECLARE v_signatory_name VARCHAR(200);
    DECLARE v_signatory_des VARCHAR(200);
    DECLARE v_underwriter VARCHAR(200);
    DECLARE v_print_date VARCHAR(40);
    
    SET time_zone = "+8:00";
    
    SET v_company_name = epim_param_v('COMP_NAME');
    SET v_company_addr = epim_param_v('COMP_ADD');
    SET v_contact_dtls = CONCAT(epim_param_v('COMP_TEL'), ' Email: ', epim_param_v('COMP_EMAIL'), ' Website: ', epim_param_v('COMP_WEBSITE'));
	SET v_company_tin = epim_param_v('COMP_TIN');
    SET v_intermediary = epim_param_v('CTPL_AGENT_CD');
    SET v_agent = epim_param_v('CTPL_AGENT_NAME');
    SET v_sum_insured = epim_param_n('CTPL_TSI_AMT');
    SET v_signatory_name = epim_param_v('CTPL_SIGNATORY');
    SET v_signatory_des = epim_param_v('CTPL_SIGNATORY_DES');
    SET v_underwriter = epim_param_v('CTPL_USER_ID');
    
    SELECT CASE WHEN reg_type = 'N' THEN 'New Policy' ELSE 'Renewal' END
      INTO v_pol_stat
      FROM EPIT_CTPL_VEHICLE
	 WHERE policy_id = p_policy_id;
    
	SELECT DATE_FORMAT(issue_date, '%M %d, %Y'),
		   DATE_FORMAT(inception_date, '%M %d, %Y'),
           DATE_FORMAT(expiry_date, '%M %d, %Y'),
           CASE WHEN corporate_name != '' THEN corporate_name
                ELSE CONCAT(first_name, ' ', CASE WHEN middle_initial = '' THEN ''
                                                  ELSE CONCAT(middle_initial, '. ')
											 END, last_name)
		   END,
           address,
           prem_amt,
           prem_amt + tax_amt,
           DATE_FORMAT(issue_date, '%d-%b-%y %h:%i:%s'),
           CONCAT(iss_cd, '-', prem_seq_no),
           CONCAT(line_cd, '-', subline_cd, '-', iss_cd, '-', DATE_FORMAT(issue_date, '%y'), '-', prem_seq_no, '-00')
      INTO v_issue_date,
		   v_incept_date,
           v_expiry_date,
           v_assured,
           v_address,
           v_premium,
           v_tot_amt,
           v_print_date,
           v_bill_no,
           v_policy_no
      FROM EPIT_CTPL_POLBASIC
	 WHERE policy_id = p_policy_id;
     
	SELECT CONCAT(a.model_year, ' ', b.car_company, ' ', c.make, ' ', d.engine_series)
      INTO v_item_desc
      FROM EPIT_CTPL_VEHICLE a,
		   EPIM_MC_CAR_COMPANY b,
           EPIM_MC_MAKE c,
           EPIM_MC_ENG_SERIES d
	 WHERE a.policy_id = p_policy_id
       AND a.car_company_cd = b.car_company_cd
       AND a.car_company_cd = c.car_company_cd
       AND a.make_cd = c.make_cd
       AND a.car_company_cd = d.car_company_cd
       AND a.make_cd = d.make_cd
       AND a.series_cd = d.series_cd;
     
	SELECT line_name
      INTO v_line_name
      FROM EPIM_LINE a, EPIT_CTPL_POLBASIC b
	 WHERE b.policy_id = p_policy_id
       AND b.line_cd = a.line_cd;

    SELECT v_company_name 'company_name',
		   v_company_addr 'company_addr',
           v_contact_dtls 'company_contact',
           v_company_tin 'company_tin',
           v_bill_no 'bill_no',
           v_pol_stat 'pol_stat',
           v_intermediary 'intermediary',
           v_agent 'agent',
           v_issue_date 'issue_date',
           v_incept_date 'incept_date',
           v_expiry_date 'expiry_date',
           v_assured 'assured',
           v_address 'address',
           v_line_name 'line_name',
           v_policy_no 'policy_no',
           v_item_desc 'item_desc',
           v_sum_insured 'sum_insured',
           v_premium 'premium',
           v_tot_amt 'tot_amt',
           v_signatory_name 'signatory_name',
           v_signatory_des 'signatory_des',
           v_underwriter 'underwriter',
           v_print_date 'print_date';
END