CREATE TABLE EPIM_REF_CODES (
	RV_DOMAIN			varchar(100)	not null comment 'Combination of table name and column name, separated by dot (.).  This field pertains to the column being checked for its corresponding possible values and definition.',
	RV_LOW_VALUE		varchar(240)	not null comment 'This field contains the value of a domain record.',
    RV_HIGH_VALUE 		varchar(240)	comment 'This field pertains to grouping of certain domain records.',
    RV_MEANING			varchar(100)	comment 'Definition or meaning of a particular value of a specific RV_DOMAIN.',
    primary key (RV_DOMAIN, RV_LOW_VALUE)
);