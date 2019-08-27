CREATE DEFINER=`CPI`@`%` FUNCTION `CONVERT_AMOUNT_TO_WORDS`(p_amount DECIMAL(12, 2)) RETURNS varchar(10000) CHARSET latin1
BEGIN
	declare ans varchar(10000);

	-- (one variable per digit)
    -- dig1 - Once
    -- dig2 - Tens
    -- dig3 - Hundreds
    -- dig4 - Thousands
    -- dig5 - Ten Thousands
    -- dig6 - Hundred Thousands
    -- dig7 - Millions
    -- dig8 - Ten Millions
    -- dig9 - Hundred Millions
    -- dig10 - Billions
	declare dig1, dig2, dig3, dig4, dig5, dig6, dig7, dig8, dig9, dig10 int;

	declare degDecimal varchar(20);

	set ans = '';

	set dig10 = floor(p_amount / 1000000000);
	set dig9 = floor(p_amount / 100000000) - dig10*10;
	set dig8 = floor(p_amount / 10000000) - (dig10*100 + dig9*10);
	set dig7 = floor(p_amount / 1000000) - (dig10*1000 + dig9*100 + dig8*10);
	set dig6 = floor(p_amount / 100000) - (dig10*10000 + dig9*1000 + dig8*100 + dig7*10);
	set dig5 = floor(p_amount / 10000) - (dig10*100000 + dig9*10000 + dig8*1000 + dig7*100 + dig6*10);
	set dig4 = floor(p_amount / 1000) - (dig10*1000000 + dig9*100000 + dig8*10000 + dig7*1000 + dig6*100 + dig5*10);
	set dig3 = floor(p_amount / 100) - (dig10*10000000 + dig9*1000000 + dig8*100000 + dig7*10000 + dig6*1000 + dig5*100 + dig4*10);
	set dig2 = floor(p_amount / 10) - (dig10*100000000 + dig9*10000000 + dig8*1000000 + dig7*100000 + dig6*10000 + dig5*1000 + dig4*100 + dig3*10);
	set dig1 = p_amount - (dig10*1000000000 + dig9*100000000 + dig8*10000000 + dig7*1000000 + dig6*100000 + dig5*10000 + dig4*1000 + dig3*100 + dig2*10);

    if dig10 > 0 then
		case
			when dig10=1 then set ans=concat(ans, ' One Billion');
			when dig10=2 then set ans=concat(ans, ' Two Billion');
			when dig10=3 then set ans=concat(ans, ' Three Billion');
			when dig10=4 then set ans=concat(ans, ' Four Billion');
			when dig10=5 then set ans=concat(ans, ' Five Billion');
			when dig10=6 then set ans=concat(ans, ' Six Billion');
			when dig10=7 then set ans=concat(ans, ' Seven Billion');
			when dig10=8 then set ans=concat(ans, ' Eight Billion');
			when dig10=9 then set ans=concat(ans, ' Nine Billion');
			else set ans = ans;
		end case;
	end if;

	if dig9 > 0 then
		case
			when dig9=1 then set ans=concat(ans, ' One Hundred');
			when dig9=2 then set ans=concat(ans, ' Two Hundred');
			when dig9=3 then set ans=concat(ans, ' Three Hundred');
			when dig9=4 then set ans=concat(ans, ' Four Hundred');
			when dig9=5 then set ans=concat(ans, ' Five Hundred');
			when dig9=6 then set ans=concat(ans, ' Six Hundred');
			when dig9=7 then set ans=concat(ans, ' Seven Hundred');
			when dig9=8 then set ans=concat(ans, ' Eight Hundred');
			when dig9=9 then set ans=concat(ans, ' Nine Hundred');
			else set ans = ans;
		end case;
	end if;

	if dig8 > 0 then
		case
			when dig8=2 then set ans=concat(ans, ' Twenty');
			when dig8=3 then set ans=concat(ans, ' Thirty');
			when dig8=4 then set ans=concat(ans, ' Fourty');
			when dig8=5 then set ans=concat(ans, ' Fifty');
			when dig8=6 then set ans=concat(ans, ' Sixty');
			when dig8=7 then set ans=concat(ans, ' Seventy');
			when dig8=8 then set ans=concat(ans, ' Eighty');
			when dig8=9 then set ans=concat(ans, ' Ninety');
			else set ans=ans;
		end case;
	end if;
	
	if dig8 = 1 then
		case
			when (dig8*10 + dig7) = 10 then set ans=concat(ans, ' Ten Million');
			when (dig8*10 + dig7) = 11 then set ans=concat(ans, ' Eleven Million');
			when (dig8*10 + dig7) = 12 then set ans=concat(ans, ' Twelve Million');
			when (dig8*10 + dig7) = 13 then set ans=concat(ans, ' Thirteen Million');
			when (dig8*10 + dig7) = 14 then set ans=concat(ans, ' Fourteen Million');
			when (dig8*10 + dig7) = 15 then set ans=concat(ans, ' Fifteen Million');
			when (dig8*10 + dig7) = 16 then set ans=concat(ans, ' Sixteen Million');
			when (dig8*10 + dig7) = 17 then set ans=concat(ans, ' Seventeen Million');
			when (dig8*10 + dig7) = 18 then set ans=concat(ans, ' Eighteen Million');
			when (dig8*10 + dig7) = 19 then set ans=concat(ans, ' Nineteen Million');
			else set ans=ans;
		end case;
	end if;

	if dig7 > 0 then
		case
			when dig7=1 then set ans=concat(ans, ' One Million');
			when dig7=2 then set ans=concat(ans, ' Two Million');
			when dig7=3 then set ans=concat(ans, ' Three Million');
			when dig7=4 then set ans=concat(ans, ' Four Million');
			when dig7=5 then set ans=concat(ans, ' Five Million');
			when dig7=6 then set ans=concat(ans, ' Six Million');
			when dig7=7 then set ans=concat(ans, ' Seven Million');
			when dig7=8 then set ans=concat(ans, ' Eight Million');
			when dig7=9 then set ans=concat(ans, ' Nine Million');
			else set ans = ans;
		end case;
	end if;

	if (dig9 > 0 AND dig8 = 0 AND dig7 = 0) OR (dig8 > 1 AND dig7 = 0) then
		set ans=concat(ans, ' Million');
	end if;

	if dig6 > 0 then
		case
			when dig6=1 then set ans=concat(ans, ' One Hundred');
			when dig6=2 then set ans=concat(ans, ' Two Hundred');
			when dig6=3 then set ans=concat(ans, ' Three Hundred');
			when dig6=4 then set ans=concat(ans, ' Four Hundred');
			when dig6=5 then set ans=concat(ans, ' Five Hundred');
			when dig6=6 then set ans=concat(ans, ' Six Hundred');
			when dig6=7 then set ans=concat(ans, ' Seven Hundred');
			when dig6=8 then set ans=concat(ans, ' Eight Hundred');
			when dig6=9 then set ans=concat(ans, ' Nine Hundred');
			else set ans = ans;
		end case;
	end if;

	if dig5 > 0 then
		case
			when dig5=2 then set ans=concat(ans, ' Twenty');
			when dig5=3 then set ans=concat(ans, ' Thirty');
			when dig5=4 then set ans=concat(ans, ' Fourty');
			when dig5=5 then set ans=concat(ans, ' Fifty');
			when dig5=6 then set ans=concat(ans, ' Sixty');
			when dig5=7 then set ans=concat(ans, ' Seventy');
			when dig5=8 then set ans=concat(ans, ' Eighty');
			when dig5=9 then set ans=concat(ans, ' Ninety');
			else set ans=ans;
		end case;
	end if;

	if dig5 = 1 then
		case
			when (dig5*10 + dig4) = 10 then set ans=concat(ans, ' Ten Thousand');
			when (dig5*10 + dig4) = 11 then set ans=concat(ans, ' Eleven Thousand');
			when (dig5*10 + dig4) = 12 then set ans=concat(ans, ' Twelve Thousand');
			when (dig5*10 + dig4) = 13 then set ans=concat(ans, ' Thirteen Thousand');
			when (dig5*10 + dig4) = 14 then set ans=concat(ans, ' Fourteen Thousand');
			when (dig5*10 + dig4) = 15 then set ans=concat(ans, ' Fifteen Thousand');
			when (dig5*10 + dig4) = 16 then set ans=concat(ans, ' Sixteen Thousand');
			when (dig5*10 + dig4) = 17 then set ans=concat(ans, ' Seventeen Thousand');
			when (dig5*10 + dig4) = 18 then set ans=concat(ans, ' Eighteen Thousand');
			when (dig5*10 + dig4) = 19 then set ans=concat(ans, ' Nineteen Thousand');
			else set ans=ans;
		end case;
	end if;

	if dig4 > 0 then
		case
			when dig4=1 then set ans=concat(ans, ' One Thousand');
			when dig4=2 then set ans=concat(ans, ' Two Thousand');
			when dig4=3 then set ans=concat(ans, ' Three Thousand');
			when dig4=4 then set ans=concat(ans, ' Four Thousand');
			when dig4=5 then set ans=concat(ans, ' Five Thousand');
			when dig4=6 then set ans=concat(ans, ' Six Thousand');
			when dig4=7 then set ans=concat(ans, ' Seven Thousand');
			when dig4=8 then set ans=concat(ans, ' Eight Thousand');
			when dig4=9 then set ans=concat(ans, ' Nine Thousand');
			else set ans = ans;
		end case;
	end if;

	if (dig6 > 0 AND dig5 = 0 AND dig4 = 0) OR (dig5 > 1 AND dig4 = 0) then
		set ans=concat(ans, ' Thousand');
	end if;

    if dig3 > 0 then
		case
			when dig3=1 then set ans=concat(ans, ' One Hundred');
			when dig3=2 then set ans=concat(ans, ' Two Hundred');
			when dig3=3 then set ans=concat(ans, ' Three Hundred');
			when dig3=4 then set ans=concat(ans, ' Four Hundred');
			when dig3=5 then set ans=concat(ans, ' Five Hundred');
			when dig3=6 then set ans=concat(ans, ' Six Hundred');
			when dig3=7 then set ans=concat(ans, ' Seven Hundred');
			when dig3=8 then set ans=concat(ans, ' Eight Hundred');
			when dig3=9 then set ans=concat(ans, ' Nine Hundred');
			else set ans = ans;
		end case;
	end if;

	if dig2 > 0 then
		case
			when dig2=2 then set ans=concat(ans, ' Twenty');
			when dig2=3 then set ans=concat(ans, ' Thirty');
			when dig2=4 then set ans=concat(ans, ' Fourty');
			when dig2=5 then set ans=concat(ans, ' Fifty');
			when dig2=6 then set ans=concat(ans, ' Sixty');
			when dig2=7 then set ans=concat(ans, ' Seventy');
			when dig2=8 then set ans=concat(ans, ' Eighty');
			when dig2=9 then set ans=concat(ans, ' Ninety');
			else set ans=ans;
		end case;
	end if;

	if dig2 = 1 then
		case
			when (dig2*10 + dig1) = 10 then set ans=concat(ans, ' Ten');
			when (dig2*10 + dig1) = 11 then set ans=concat(ans, ' Eleven');
			when (dig2*10 + dig1) = 12 then set ans=concat(ans, ' Twelve');
			when (dig2*10 + dig1) = 13 then set ans=concat(ans, ' Thirteen');
			when (dig2*10 + dig1) = 14 then set ans=concat(ans, ' Fourteen');
			when (dig2*10 + dig1) = 15 then set ans=concat(ans, ' Fifteen');
			when (dig2*10 + dig1) = 16 then set ans=concat(ans, ' Sixteen');
			when (dig2*10 + dig1) = 17 then set ans=concat(ans, ' Seventeen');
			when (dig2*10 + dig1) = 18 then set ans=concat(ans, ' Eighteen');
			when (dig2*10 + dig1) = 19 then set ans=concat(ans, ' Nineteen');
			else set ans=ans;
		end case;
	end if;

	if dig1 > 0 then
		case
			when dig1=1 then set ans=concat(ans, ' One');
			when dig1=2 then set ans=concat(ans, ' Two');
			when dig1=3 then set ans=concat(ans, ' Three');
			when dig1=4 then set ans=concat(ans, ' Four');
			when dig1=5 then set ans=concat(ans, ' Five');
			when dig1=6 then set ans=concat(ans, ' Six');
			when dig1=7 then set ans=concat(ans, ' Seven');
			when dig1=8 then set ans=concat(ans, ' Eight');
			when dig1=9 then set ans=concat(ans, ' Nine');
			else set ans=ans;
		end case;
	end if;
	
	if substr(p_amount, -2) = '00' then
		set degDecimal = '';
	else
		set degDecimal = concat(' and ', substr(p_amount, -2), '/100');
	end if;

	return concat(trim(ans), degDecimal);
END