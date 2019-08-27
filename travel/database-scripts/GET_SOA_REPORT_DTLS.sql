CREATE DEFINER=`CPI`@`%` PROCEDURE `GET_SOA_REPORT_DTLS`(p_policy_id BIGINT(12))
BEGIN
	DECLARE v_company_name VARCHAR(200);
    DECLARE v_company_addr VARCHAR(200);
    DECLARE v_contact_dtls VARCHAR(610);
    DECLARE v_company_tin VARCHAR(200);
    DECLARE v_emp_no VARCHAR(100);
    DECLARE v_bill_no VARCHAR(20);
    DECLARE v_pol_stat VARCHAR(10);
    DECLARE v_intm_no VARCHAR(200);
    DECLARE v_intm_name VARCHAR(200);
    DECLARE v_issue_date VARCHAR(30);
	DECLARE v_incept_date VARCHAR(30);
	DECLARE v_expiry_date VARCHAR(30);
    DECLARE v_assured VARCHAR(250);
    DECLARE v_address VARCHAR(250);
    DECLARE v_line_name VARCHAR(20);
    DECLARE v_policy_no VARCHAR(20);
    DECLARE v_item_desc VARCHAR(200);
    DECLARE v_premium DOUBLE(12, 2);
    DECLARE v_tot_amt DOUBLE(24, 2);
    DECLARE v_signatory_name VARCHAR(200);
    DECLARE v_signatory_des VARCHAR(200);
    DECLARE v_underwriter VARCHAR(200);
    DECLARE v_print_date VARCHAR(40);
    
    SET time_zone = "+8:00";
    
    SET v_pol_stat = 'New Policy';
    
    SET v_company_name = epim_param_v('COMP_NAME');
    SET v_company_addr = epim_param_v('COMP_ADD');
    SET v_contact_dtls = CONCAT(epim_param_v('COMP_TEL'), ' Email: ', epim_param_v('COMP_EMAIL'), ' Website: ', epim_param_v('COMP_WEBSITE'));
	SET v_company_tin = epim_param_v('COMP_TIN');
    SET v_signatory_name = epim_param_v('TRAVEL_SIGNATORY');
    SET v_signatory_des = epim_param_v('TRAVEL_SIGNATORY_DES');
    SET v_underwriter = epim_param_v('TRAVEL_USER');
    
	SELECT a.emp_no,
		   CONCAT(a.iss_cd, '-', a.prem_seq_no),
		   CASE WHEN a.agency_cd IS NULL THEN epim_param_v('TRAVEL_INTM_NO')
			    ELSE b.intm_no
		   END,
           CASE WHEN a.agency_cd IS NULL THEN epim_param_v('TRAVEL_INTM_NAME')
			    ELSE b.intm_name
		   END,
           DATE_FORMAT(a.issue_date, '%M %d, %Y'),
		   DATE_FORMAT(a.inception_date, '%M %d, %Y'),
           DATE_FORMAT(a.expiry_date, '%M %d, %Y'),
           CONCAT(a.first_name, ' ', CASE WHEN a.middle_initial = '' THEN ''
										  ELSE CONCAT(a.middle_initial, '. ')
								     END, a.last_name),
		   CONCAT(a.house_no, ', ', a.street_name, ', ',
				  c.brgy_desc, ', ', d.city_desc, ', ',
                  e.province_desc, ', ', a.zip_cd),
		   f.line_name,
           CONCAT(a.line_cd, '-', a.subline_cd, '-',
				  a.iss_cd, '-', DATE_FORMAT(a.issue_date, '%y'), '-',
                  a.prem_seq_no, '-00'),
		   a.prem_amt, a.prem_amt + a.tax_amt,
           DATE_FORMAT(a.issue_date, '%d-%b-%Y'),
           CONCAT(a.subline_cd, ' - ', g.subline_name)
      INTO v_emp_no, v_bill_no, v_intm_no, v_intm_name, v_issue_date,
		   v_incept_date, v_expiry_date, v_assured, v_address, v_line_name,
           v_policy_no, v_premium, v_tot_amt, v_print_date, v_item_desc
      FROM EPIT_TRAVEL_POLBASIC a,
		   EPIM_AGENCY b,
           EPIM_BARANGAY c,
           EPIM_CITY d,
           EPIM_PROVINCE e,
           EPIM_LINE f,
           EPIM_SUBLINE g
	 WHERE a.policy_id = p_policy_id
       AND (a.agency_cd = b.agency_cd
			OR a.agency_cd IS NULL)
	   AND a.province_cd = c.province_cd
       AND a.city_cd = c.city_cd
       AND a.brgy_cd = c.brgy_cd
       AND a.province_cd = d.province_cd
       AND a.city_cd = d.city_cd
       AND a.province_cd = e.province_cd
       AND a.line_cd = f.line_cd
       AND a.subline_cd = g.subline_cd;
     
    SELECT v_company_name 'company_name',
		   v_company_addr 'company_addr',
           v_contact_dtls 'contact_dtls',
           v_company_tin 'company_tin',
           v_emp_no 'emp_no',
           v_bill_no 'bill_no',
           v_pol_stat 'pol_stat',
           v_intm_no 'intm_no',
           v_intm_name 'intm_name',
           v_issue_date 'issue_date',
           v_incept_date 'incept_date',
           v_expiry_date 'expiry_date',
           v_assured 'assd_name',
           v_address 'assd_addr',
           v_line_name 'line_name',
           v_policy_no 'policy_no',
           v_item_desc 'item_desc',
           v_premium 'premium',
           v_tot_amt 'tot_amt',
           v_signatory_name 'signatory_name',
           v_signatory_des 'signatory_des',
           v_underwriter 'underwriter',
           v_print_date 'print_date';
END