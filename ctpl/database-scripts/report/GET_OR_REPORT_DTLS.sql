CREATE DEFINER=`CPI`@`%` PROCEDURE `GET_OR_REPORT_DTLS`(
	p_policy_id		BIGINT(12)
)
BEGIN
    DECLARE v_received_from VARCHAR(200);
    DECLARE v_or_no VARCHAR(14);
    DECLARE v_address VARCHAR(150);
    DECLARE v_date VARCHAR(30);
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
    DECLARE v_company_name VARCHAR(200);
    DECLARE v_company_addr VARCHAR(200);
    DECLARE v_contact_dtls VARCHAR(610);
    DECLARE v_company_tin VARCHAR(200);
    
    SET time_zone = "+8:00";
    
    SET v_prem_zero_rated = 0;
    SET v_prem_vat_exempt = 0;
    SET v_cashier = epim_param_v('CTPL_USER_ID');
    SET v_company_name = epim_param_v('COMP_NAME');
    SET v_company_addr = epim_param_v('COMP_ADD');
    SET v_contact_dtls = CONCAT(epim_param_v('COMP_TEL'), ' Email: ', epim_param_v('COMP_EMAIL'), ' Website: ', epim_param_v('COMP_WEBSITE'));
	SET v_company_tin = epim_param_v('BRANCH_TIN');
    
    SELECT CASE WHEN corporate_name != '' THEN corporate_name
                ELSE CONCAT(first_name, ' ', CASE WHEN middle_initial = '' THEN ''
                                                  ELSE CONCAT(middle_initial, '. ')
											 END, last_name)
		   END,
           address, tin_no, prem_amt, prem_amt + tax_amt,
           CONCAT(line_cd, '-', subline_cd, '-', iss_cd, '-', DATE_FORMAT(issue_date, '%y'), '-',
				  prem_seq_no, '-00 / ', iss_cd, '-', prem_seq_no),
		   CONCAT(epim_param_v('CTPL_OR_PREF'), '-', or_no)
	  INTO v_received_from,
           v_address,
           v_tin,
           v_prem_vat,
           v_tot_amt,
           v_particulars,
           v_or_no
	  FROM EPIT_CTPL_POLBASIC
	 WHERE policy_id = p_policy_id;
     
	SELECT DATE_FORMAT(date_of_payt, '%d %M %Y'),
		   payt_ref_no,
           payt_method,
           CONVERT_AMOUNT_TO_WORDS(payt_amt)
      INTO v_date, v_ref_no, v_payt_method, v_amt_in_words
      FROM EPIT_CTPL_TRANS
	 WHERE policy_id = p_policy_id;

    SELECT v_received_from 'received_from',
		   v_or_no 'or_no',
           v_address 'address',
           v_date 'date',
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
           v_company_name 'company_name',
           v_company_addr 'company_addr',
           v_contact_dtls 'company_contact',
           v_company_tin 'company_tin';
END