DROP PROCEDURE IF EXISTS SAVE_VEHICLE_DETAILS;

DELIMITER //

CREATE PROCEDURE SAVE_VEHICLE_DETAILS(
	p_policy_id				bigint(12),
    p_reg_type				varchar(1),
    p_model_year			varchar(4),
    p_car_company_cd		bigint(6),
    p_make_cd				bigint(12),
    p_series_cd				bigint(12),
    p_plate_no				varchar(10),
    p_serial_no				varchar(25),
    p_motor_no				varchar(30),
    p_mv_file_no			varchar(15),
    p_mv_type_cd			varchar(2),
    p_mv_prem_type_cd		varchar(2),
    p_color					varchar(50),
    p_assignee    			varchar(502)
)
BEGIN
    DECLARE v_mot_type INT(2);
    DECLARE v_unladen_wt VARCHAR(20);
    DECLARE v_no_of_pass INT(3);    
    DECLARE v_coc_serial_no BIGINT(7);
    DECLARE v_coc_no VARCHAR(10);
    
    SELECT mot_type, no_of_pass
      INTO v_mot_type, v_no_of_pass
      FROM EPIM_MC_MAKE
	 WHERE car_company_cd = p_car_company_cd
       AND make_cd = p_make_cd;
    
    SELECT rv_high_value 
      INTO v_unladen_wt 
      FROM EPIM_REF_CODES 
	 WHERE rv_domain = 'EPIM_MC_MAKE.MOT_TYPE'
       AND rv_low_value = v_mot_type;
       
	SELECT MAX(coc_serial_no) + 1
      INTO v_coc_serial_no
      FROM EPIT_CTPL_VEHICLE;
	
    IF v_coc_serial_no IS NULL THEN
		SET v_coc_serial_no = 1;
    END IF;
    
    SET v_coc_no = concat(epim_param_v('COC_COMPANY_CD'), v_coc_serial_no);
    
    INSERT INTO EPIT_CTPL_VEHICLE (policy_id, motor_no, plate_no, serial_no, mv_file_no, model_year, reg_type, 
								mv_type_cd, mv_prem_type_cd, car_company_cd, make_cd, series_cd, mot_type, unladen_wt,
                                no_of_pass, color, assignee, coc_serial_no, coc_no, last_update)
		VALUES (p_policy_id, p_motor_no, p_plate_no, p_serial_no, p_mv_file_no, p_model_year, p_reg_type,
				p_mv_type_cd, p_mv_prem_type_cd, p_car_company_cd, p_make_cd, p_series_cd, v_mot_type, v_unladen_wt,
                v_no_of_pass, p_color, p_assignee, v_coc_serial_no, v_coc_no, sysdate());
END//
DELIMITER ;