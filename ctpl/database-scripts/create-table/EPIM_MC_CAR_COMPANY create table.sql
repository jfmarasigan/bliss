CREATE TABLE EPIM_MC_CAR_COMPANY (
	CAR_COMPANY_CD		bigint(6) 		not null comment 'It is the code used to identify the Car Company name of the vehicle.',
    CAR_COMPANY 		varchar(50) 	not null comment 'It is the name of the manufacturer of the car insured.',
    USER_ID				varchar(8) 		not null comment 'User who created or last updated the record.',
    LAST_UPDATE			datetime 		not null comment 'Date when the record is last updated. This is system generated.',
    REMARKS				varchar(4000) 	comment 'Any information pertinent to the record.',
    primary key (CAR_COMPANY_CD)
);