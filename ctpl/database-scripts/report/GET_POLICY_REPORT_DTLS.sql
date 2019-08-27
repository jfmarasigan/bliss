CREATE DEFINER=`CPI`@`%` PROCEDURE `GET_POLICY_REPORT_DTLS`(
	p_policy_id		BIGINT(12)
)
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
    DECLARE v_address VARCHAR(150);
    DECLARE v_incept_date VARCHAR(30);
    DECLARE v_expiry_date VARCHAR(30);
    DECLARE v_date_time VARCHAR(30);
    DECLARE v_premium DOUBLE(12, 2);
    DECLARE v_amount_due DOUBLE(20, 2);
    DECLARE v_ref_pol_no BIGINT(12);
    DECLARE v_tot_sum_insured DOUBLE(16, 2);
    DECLARE v_sum_insured_in_words VARCHAR(150);
    DECLARE v_item_title VARCHAR(200);
    DECLARE v_item_desc VARCHAR(15);
    DECLARE v_assignee VARCHAR(30);
    DECLARE v_model_year VARCHAR(4);
    DECLARE v_make VARCHAR(110);
    DECLARE v_type_of_body VARCHAR(30);
    DECLARE v_color VARCHAR(50);
    DECLARE v_motor_no VARCHAR(30);
    DECLARE v_serial_no VARCHAR(25);
    DECLARE v_plate_no VARCHAR(10);
    DECLARE v_no_of_pass INT(3);
    DECLARE v_unladen_weight VARCHAR(240);
    DECLARE v_motor_type_desc VARCHAR(100);
    DECLARE v_coc_no VARCHAR(10);
    DECLARE v_mv_file_no VARCHAR(15);
    DECLARE v_sum_insured DOUBLE(16, 2);
    DECLARE v_page_heading VARCHAR(230);
    DECLARE v_warr_and_clauses VARCHAR(200);
    DECLARE v_user_id VARCHAR(200);
    DECLARE v_issue_date_w_time VARCHAR(30);
    DECLARE v_intermediary VARCHAR(200);
    DECLARE v_cred_branch VARCHAR(200);
    DECLARE v_signatory_name VARCHAR(200);
    DECLARE v_signatory_label VARCHAR(200);
    
    DECLARE v_finished INTEGER DEFAULT 0;
    
    DECLARE v_tax_rate DOUBLE(12,2);
    DECLARE v_tax_amount DOUBLE(12,2);
    DECLARE v_tax_type VARCHAR(1);
    DEClARE tax_cursor CURSOR FOR SELECT tax_rate, tax_amount, tax_type FROM EPIM_TAXES;
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET v_finished = 1;
    
    SET time_zone = "+8:00";
    
    SET v_company_name = epim_param_v('COMP_NAME');
    SET v_company_addr = epim_param_v('COMP_ADD');
    SET v_contact_dtls = CONCAT(epim_param_v('COMP_TEL'), ' Email: ', epim_param_v('COMP_EMAIL'), ' Website: ', epim_param_v('COMP_WEBSITE'));
	SET v_company_tin = epim_param_v('COMP_TIN');
	
    SELECT a.line_name
      INTO v_line_name
	  FROM EPIM_LINE a, EPIT_CTPL_POLBASIC b
	 WHERE a.line_cd = b.line_cd
       AND b.policy_id = p_policy_id;
       
	SELECT a.subline_name
	  INTO v_subline_name
	  FROM EPIM_SUBLINE a, EPIT_CTPL_POLBASIC b
	 WHERE a.line_cd = b.line_cd
	   AND a.subline_cd = b.subline_cd
       AND b.policy_id = p_policy_id;
       
    SELECT DATE_FORMAT(issue_date, '%M %d, %Y'),
		   DATE_FORMAT(issue_date, '%d-%b-%Y %h:%i:%s'),
           CONCAT(line_cd, '-', subline_cd, '-', iss_cd, '-', DATE_FORMAT(issue_date, '%y'), '-', p_policy_id, '-00'),
           CASE WHEN corporate_name != '' THEN corporate_name
                ELSE CONCAT(first_name, ' ', CASE WHEN middle_initial = '' THEN ''
                                                  ELSE CONCAT(middle_initial, '. ')
											 END, last_name)
		   END,
		   address,
           DATE_FORMAT(inception_date, '%M %d, %Y'),
           DATE_FORMAT(expiry_date, '%M %d, %Y'),
           TIME_FORMAT(DATE_FORMAT(inception_date, '%h:%i:%s'), "%r"),
           prem_amt
      INTO v_issue_date_wo_time,
		   v_issue_date_w_time,
		   v_policy_no,
           v_insured,
           v_address,
           v_incept_date,
           v_expiry_date,
           v_date_time,
           v_premium
	  FROM EPIT_CTPL_POLBASIC
	 WHERE policy_id = p_policy_id;
     
	SET v_amount_due = v_premium;
    
    OPEN tax_cursor;
    read_loop: LOOP
		FETCH tax_cursor INTO v_tax_rate, v_tax_amount, v_tax_type;
        
        IF v_finished = 1 THEN 
			LEAVE read_loop;
		END IF;
        
        IF v_tax_type = 'R'
        THEN
			SET v_amount_due = v_amount_due + ((v_premium * v_tax_rate) / 100);
        ELSE
			SET v_amount_due = v_amount_due + v_tax_amount;
        END IF;
    END LOOP;
    
    SELECT tran_id
      INTO v_ref_pol_no
      FROM EPIT_CTPL_TRANS
	 WHERE policy_id = p_policy_id;
    
    SET v_tot_sum_insured = epim_param_n('CTPL_TSI_AMT');
    SET v_sum_insured_in_words = CONVERT_AMOUNT_TO_WORDS(v_tot_sum_insured);
    
    SELECT CONCAT(a.model_year, ' ', b.car_company, ' ', c.make, ' ', d.engine_series),
		   CASE WHEN a.reg_type = 'N' THEN 'New Policy'
			    ELSE 'Renewal'
		   END,
           assignee, model_year, CONCAT(b.car_company, ' ', c.make), c.type_of_body,
           a.color, a.motor_no, a.serial_no, a.plate_no, a.no_of_pass, e.rv_meaning,
           e.rv_meaning, a.coc_no, a.mv_file_no
      INTO v_item_title,
		   v_item_desc,
           v_assignee,
           v_model_year,
           v_make,
           v_type_of_body,
           v_color,
           v_motor_no,
           v_serial_no,
           v_plate_no,
           v_no_of_pass,
           v_unladen_weight,
           v_motor_type_desc,
           v_coc_no,
           v_mv_file_no
      FROM EPIT_CTPL_VEHICLE a,
		   EPIM_MC_CAR_COMPANY b,
           EPIM_MC_MAKE c,
           EPIM_MC_ENG_SERIES d,
           EPIM_REF_CODES e
	 WHERE a.policy_id = p_policy_id
       AND a.car_company_cd = b.car_company_cd
       AND a.car_company_cd = c.car_company_cd
       AND a.make_cd = c.make_cd
       AND a.car_company_cd = d.car_company_cd
       AND a.make_cd = d.make_cd
       AND a.series_cd = d.series_cd
       AND a.mot_type = e.rv_low_value
       AND e.rv_domain = 'EPIM_MC_MAKE.MOT_TYPE';
       
	SET v_sum_insured = epim_param_n('CTPL_PERIL_TSI');
    SET v_page_heading = CONCAT(epim_param_v('CTPL_DOC_2NDPAGE_HEADING'), ' ', v_policy_no);
    SET v_warr_and_clauses = epim_param_v('CTPL_WARRANTIES_CLAUSES');
    SET v_user_id = epim_param_v('CTPL_USER_ID');
    SET v_intermediary = epim_param_v('CTPL_AGENT_CD');
    SET v_cred_branch = epim_param_v('CTPL_ISS_CD');
    SET v_signatory_name = epim_param_v('CTPL_SIGNATORY');
    SET v_signatory_label = epim_param_v('CTPL_SIGNATORY_DES');

    SELECT v_company_name 'company_name',
		   v_company_addr 'company_addr',
           v_contact_dtls 'company_contact',
           v_company_tin 'company_tin',
           v_line_name 'line_name',
           v_subline_name 'subline_name',
           v_issue_date_wo_time 'issue_date_wo_time',
           v_policy_no 'policy_no',
           v_insured 'insured',
           v_address 'address',
           v_incept_date 'incept_date',
           v_expiry_date 'expiry_date',
           v_date_time 'date_time',
           v_premium 'premium',
           v_amount_due 'amount_due',
           v_ref_pol_no 'ref_pol_no',
           FORMAT(v_tot_sum_insured, 2) 'tot_sum_insured',
           v_sum_insured_in_words 'sum_insured_in_words',
           v_item_title 'item_title',
           v_item_desc 'item_desc',
           v_assignee 'assignee',
           v_model_year 'model_year',
           v_make 'make',
           v_type_of_body 'type_of_body',
           v_color 'color',
           v_motor_no 'motor_no',
           v_serial_no 'serial_no',
           v_subline_name 'subline_name',
           v_plate_no 'plate_no',
           v_no_of_pass 'no_of_pass',
           v_unladen_weight 'unladen_weight',
           v_motor_type_desc 'motor_type_desc',
           v_coc_no 'coc_no',
           v_mv_file_no 'mv_file_no',
           v_sum_insured 'sum_insured',
           v_page_heading 'page_heading',
           v_warr_and_clauses 'warr_and_clauses',
           v_user_id 'user_id',
           v_issue_date_w_time 'issue_date_w_time',
           v_intermediary 'intermediary',
           v_cred_branch 'cred_branch',
           v_signatory_name 'signatory_name',
           v_signatory_label 'signatory_label';
END