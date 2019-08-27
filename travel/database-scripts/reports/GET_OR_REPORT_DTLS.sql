CREATE DEFINER=`CPI`@`%` PROCEDURE `GET_OR_REPORT_DTLS`(p_policy_id BIGINT(12))
BEGIN
	DECLARE v_received_from VARCHAR(200);
    DECLARE v_or_no VARCHAR(14);
    DECLARE v_address VARCHAR(150);
    DECLARE v_date_of_payt DATETIME;
    DECLARE v_tin VARCHAR(200);
    DECLARE v_amt_in_words VARCHAR(200);
    DECLARE v_ref_no VARCHAR(250);
    DECLARE v_particulars VARCHAR(65);
    DECLARE v_prem_vat DOUBLE(12, 2);
    DECLARE v_prem_zero_rated INT(1);
    DECLARE v_prem_vat_exempt INT(1);
    DECLARE v_tot_amt DOUBLE(24, 2);
    DECLARE v_payt_method VARCHAR(10);
    DECLARE v_cashier VARCHAR(200);
    DECLARE v_date_inserted DATETIME;
    DECLARE v_company_name VARCHAR(200);
    DECLARE v_company_addr VARCHAR(200);
    DECLARE v_contact_dtls VARCHAR(610);
    DECLARE v_company_tin VARCHAR(200);
    
    SET time_zone = "+8:00";
    
    SET v_prem_zero_rated = 0;
    SET v_prem_vat_exempt = 0;
    SET v_cashier = epim_param_v('TRAVEL_CASHIER_NAME');
    SET v_company_name = epim_param_v('COMP_NAME');
    SET v_company_addr = epim_param_v('COMP_ADD');
    SET v_contact_dtls = CONCAT(epim_param_v('COMP_TEL'), ' Email: ', epim_param_v('COMP_EMAIL'), ' Website: ', epim_param_v('COMP_WEBSITE'));
	SET v_company_tin = epim_param_v('BRANCH_TIN');
    
    SELECT CONCAT(a.first_name, ' ', CASE WHEN a.middle_initial = '' THEN ''
                                          ELSE CONCAT(a.middle_initial, '. ')
									  END, a.last_name),
           CONCAT(a.house_no, ', ', a.street_name, ', ',
				  b.brgy_desc, ', ', c.city_desc, ', ',
                  d.province_desc, ', ', a.zip_cd),
           a.tin_no, a.prem_amt, a.prem_amt + a.tax_amt,
           CONCAT(a.line_cd, '-', a.subline_cd, '-', a.iss_cd, '-', DATE_FORMAT(a.issue_date, '%y'), '-',
				  a.prem_seq_no, '-00 / ', a.iss_cd, '-', a.prem_seq_no),
		   CONCAT(epim_param_v('TRAVEL_OR_PREF'), '-', a.or_no)
	  INTO v_received_from,
           v_address,
           v_tin,
           v_prem_vat,
           v_tot_amt,
           v_particulars,
           v_or_no
	  FROM EPIT_TRAVEL_POLBASIC a,
		   EPIM_BARANGAY b,
           EPIM_CITY c,
           EPIM_PROVINCE d
	 WHERE a.policy_id = p_policy_id
       AND a.province_cd = b.province_cd
       AND a.city_cd = b.city_cd
       AND a.brgy_cd = b.brgy_cd
       AND a.province_cd = c.province_cd
       AND a.city_cd = c.city_cd
       AND a.province_cd = d.province_cd;
     
	SELECT date_of_payt, date_inserted, payt_ref_no, payt_method, CONVERT_AMOUNT_TO_WORDS(payt_amt)
      INTO v_date_of_payt, v_date_inserted, v_ref_no, v_payt_method, v_amt_in_words
      FROM EPIT_TRAVEL_TRANS
	 WHERE policy_id = p_policy_id;

    SELECT v_received_from 'received_from',
		   v_or_no 'or_no',
           v_address 'address',
           v_date_of_payt 'date_of_payt',
           v_tin 'tin',
           v_amt_in_words 'amt_in_words',
           v_ref_no 'ref_no',
           v_particulars 'particulars',
           v_prem_vat 'prem_vat',
           v_prem_zero_rated 'prem_zero_rated',
           v_prem_vat_exempt 'prem_vat_exempt',
           v_tot_amt 'tot_amt',
           v_payt_method 'payt_method',
           v_cashier 'cashier',
           v_date_inserted 'date_inserted',
           v_company_name 'company_name',
           v_company_addr 'company_addr',
           v_contact_dtls 'contact_dtls',
           v_company_tin 'company_tin';
END