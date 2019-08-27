CREATE DEFINER=`CPI`@`%` PROCEDURE `GET_POLICY_REPORT_DTLS`(p_policy_id BIGINT(12))
BEGIN
	DECLARE v_company_name VARCHAR(200);
    DECLARE v_company_addr VARCHAR(200);
    DECLARE v_contact_dtls VARCHAR(610);
    DECLARE v_company_tin VARCHAR(200);
    DECLARE v_line_name VARCHAR(20);
    DECLARE v_subline_name VARCHAR(30);
    DECLARE v_issue_date_wo_time VARCHAR(20);
    DECLARE v_policy_no VARCHAR(30);
    DECLARE v_insured VARCHAR(250);
    DECLARE v_address VARCHAR(250);
    DECLARE v_incept_date VARCHAR(30);
    DECLARE v_expiry_date VARCHAR(30);
    DECLARE v_date_time VARCHAR(30);
    DECLARE v_premium DOUBLE(12, 2);
    DECLARE v_amount_due DOUBLE(24, 2);
    DECLARE v_ref_pol_no VARCHAR(20);
    DECLARE v_tot_sum_insured DOUBLE(16, 2);
    DECLARE v_sum_insured_in_words VARCHAR(150);
    DECLARE v_desc VARCHAR(30);
    DECLARE v_age VARCHAR(3);
    DECLARE v_gender VARCHAR(10);
    DECLARE v_birthdate VARCHAR(30);
	DECLARE v_no_of_persons BIGINT(12);
	DECLARE v_plan_name VARCHAR(50);
	DECLARE v_itinerary_dtl VARCHAR(1000);
	DECLARE v_document_signature VARCHAR(400);
	DECLARE v_user VARCHAR(200);
	DECLARE v_issue_date_w_time VARCHAR(30);
	DECLARE v_intm_no VARCHAR(20);
	DECLARE v_iss_cd VARCHAR(2);
	DECLARE v_signatory VARCHAR(200);
	DECLARE v_signatory_des VARCHAR(200);
    DECLARE v_currency_desc VARCHAR(10);
	DECLARE v_page_heading VARCHAR(200);
    
    SET time_zone = "+8:00";
    
    SET v_company_name = epim_param_v('COMP_NAME');
    SET v_company_addr = epim_param_v('COMP_ADD');
    SET v_contact_dtls = CONCAT(epim_param_v('COMP_TEL'), ' Email: ', epim_param_v('COMP_EMAIL'), ' Website: ', epim_param_v('COMP_WEBSITE'));
	SET v_company_tin = epim_param_v('COMP_TIN');
	SET v_document_signature = CONCAT(epim_param_v('TRAVEL_DOC_SIGNATURE_POL'), ' ', epim_param_v('COMP_ADD'));
    SET v_user = epim_param_v('TRAVEL_USER_ID');
	SET v_signatory = epim_param_v('TRAVEL_SIGNATORY');
	SET v_signatory_des = epim_param_v('TRAVEL_SIGNATORY_DES');
	
    SELECT b.line_name, c.subline_name,
		   DATE_FORMAT(a.issue_date, '%M %d, %Y'),
           CONCAT(a.line_cd, '-', a.subline_cd, '-',
				  a.iss_cd, '-', DATE_FORMAT(a.issue_date, '%y'), '-',
                  a.prem_seq_no, '-00'),
		   CONCAT(a.first_name, ' ', CASE WHEN a.middle_initial = '' THEN ''
										  ELSE CONCAT(a.middle_initial, '. ')
									 END, a.last_name),
		   CONCAT(a.house_no, ', ', a.street_name, ', ',
				  d.brgy_desc, ', ', e.city_desc, ', ',
                  f.province_desc, ', ', a.zip_cd),
		   DATE_FORMAT(a.inception_date, '%M %d, %Y'),
           DATE_FORMAT(a.expiry_date, '%M %d, %Y'),
           TIME_FORMAT(DATE_FORMAT(a.inception_date, '%h:%i:%s'), "%r"),
           a.prem_amt, a.prem_amt + a.tax_amt,
           CONCAT(a.plan_cd, '-', a.plan_cd, '-', h.tran_id),
           i.tsi_amt, CONVERT_AMOUNT_TO_WORDS(i.tsi_amt),
		   CASE WHEN j.plan_type = 'I' THEN TIMESTAMPDIFF(YEAR, a.dob, CURDATE())
			    ELSE NULL
		   END,
		   CASE WHEN j.plan_type = 'I' THEN CASE WHEN a.gender = 'M' THEN 'Male'
												 ELSE 'Female'
											END
			    ELSE NULL
		   END,
		   CASE WHEN j.plan_type = 'I' THEN DATE_FORMAT(a.dob, '%M %d, %Y')
			    ELSE NULL
		   END,
		   a.no_of_persons,
		   k.plan_desc,
		   a.itinerary_dtl,
		   DATE_FORMAT(a.issue_date, '%d-%b-%Y %h:%i:%s'),
		   CASE WHEN a.agency_cd IS NULL THEN epim_param_v('TRAVEL_INTM_NO')
				ELSE l.intm_no
		   END,
		   a.iss_cd,
		   g.rv_meaning
      INTO v_line_name, v_subline_name, v_issue_date_wo_time, v_policy_no,
		   v_insured, v_address, v_incept_date, v_expiry_date, v_date_time,
           v_premium, v_amount_due, v_ref_pol_no, v_tot_sum_insured,
           v_sum_insured_in_words, v_age, v_gender, v_birthdate,
		   v_no_of_persons, v_plan_name, v_itinerary_dtl, v_issue_date_w_time,
		   v_intm_no, v_iss_cd, v_currency_desc
	  FROM EPIT_TRAVEL_POLBASIC a
	       LEFT JOIN EPIM_AGENCY l
		   ON a.agency_cd = l.agency_cd,
		   EPIM_LINE b,
           EPIM_SUBLINE c,
           EPIM_BARANGAY d,
           EPIM_CITY e,
           EPIM_PROVINCE f,
           EPIM_REF_CODES g,
           EPIT_TRAVEL_TRANS h,
           EPIM_PLAN_PERIL i,
           EPIM_PLAN_TYPE j,
		   EPIM_PLAN k
	 WHERE a.policy_id = p_policy_id
       AND a.line_cd = b.line_cd
       AND a.line_cd = c.line_cd
       AND a.subline_cd = c.subline_cd
       AND a.province_cd = d.province_cd
       AND a.city_cd = d.city_cd
       AND a.brgy_cd = d.brgy_cd
       AND a.province_cd = e.province_cd
       AND a.city_cd = e.city_cd
       AND a.province_cd = f.province_cd
       AND g.rv_low_value IN (SELECT currency_cd
							    FROM EPIM_PLAN
							   WHERE plan_cd = a.plan_cd)
	   AND a.policy_id = h.policy_id
       AND a.plan_cd = i.plan_cd
       AND i.prem_sw = 'Y'
       AND a.plan_cd = j.plan_cd
	   AND a.plan_no = j.plan_no
	   AND a.plan_cd = k.plan_cd;
	   
	SET v_page_heading = CONCAT(epim_param_v('TRAVEL_DOC_2NDPAGE_HEADING'), ' ', v_policy_no);
	SET v_desc = v_subline_name;
       
    SELECT v_company_name 'company_name',
		   v_company_addr 'company_addr',
           v_contact_dtls 'contact_dtls',
           v_company_tin 'company_tin',
           v_line_name 'line_name',														-- '2',
           v_subline_name 'subline_name',												-- '3',
           v_issue_date_wo_time 'issue_date_wo_time',									-- '4',
           v_policy_no 'policy_no',														-- '5',
           v_insured 'insured',															-- '8',
           v_address 'address',															-- '10',
           v_incept_date 'incept_date',													-- '11',
           v_expiry_date 'expiry_date',													-- '12',
           v_date_time 'date_time',														-- '11, 12-1',
           v_premium 'premium',															-- '13',
           v_amount_due 'amount_due',													-- '15',
           v_ref_pol_no 'ref_pol_no',													-- '16',
           FORMAT(v_tot_sum_insured, 2) '17',
		   FORMAT(v_tot_sum_insured * v_no_of_persons, 2) '17-1',
           CONVERT_AMOUNT_TO_WORDS(v_tot_sum_insured * v_no_of_persons) '17-2',
           v_desc 'item_desc',															-- '25',
           v_age 'age',																	-- '26',
           v_gender 'gender',															-- '29',
           v_birthdate 'birthdate',														-- '30',
		   v_no_of_persons 'no_of_persons',												-- '34',
		   v_plan_name 'plan_name',														-- '35',
		   v_itinerary_dtl 'itinerary_dtl',												-- '36',
		   v_document_signature 'document_signature',									-- '61',
		   v_user 'user',																-- '64',
		   v_issue_date_w_time 'issue_date_w_time',										-- '65',
		   v_intm_no 'intm_no',															-- '66',
		   v_iss_cd 'iss_cd',															-- '69',
		   v_signatory 'signatory',														-- '72',
		   v_signatory_des 'signatory_des',												-- '72-1',
           v_currency_desc 'currency_desc',												-- '75',
		   v_page_heading 'page_heading';												-- '76';
END