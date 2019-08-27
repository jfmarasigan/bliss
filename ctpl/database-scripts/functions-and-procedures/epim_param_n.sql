DROP FUNCTION IF EXISTS epim_param_n;

DELIMITER //

CREATE FUNCTION epim_param_n(
	parameter_name	VARCHAR(50)
) RETURNS double(16, 2)
BEGIN
	DECLARE param_value double(16, 2);
    
    SELECT param_value_n INTO param_value FROM EPIM_PARAMETERS WHERE param_name = parameter_name;
    
    RETURN param_value;
END //

DELIMITER ;