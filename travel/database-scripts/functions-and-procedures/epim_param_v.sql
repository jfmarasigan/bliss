DROP FUNCTION IF EXISTS epim_param_v;

DELIMITER //

CREATE FUNCTION epim_param_v(
	parameter_name	VARCHAR(50)
) RETURNS double(16, 2)
BEGIN
	DECLARE param_value varchar(250);
    
    SELECT param_value_v INTO param_value FROM EPIM_PARAMETERS WHERE param_name = parameter_name;
    
    RETURN param_value;
END //

DELIMITER ;