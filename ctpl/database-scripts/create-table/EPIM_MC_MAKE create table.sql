CREATE TABLE EPIM_MC_MAKE (
    CAR_COMPANY_CD 		bigint(6) 		not null comment 'It is the code used to identify the specific Car Company name.',
	MAKE_CD				bigint(12) 		not null comment 'It is the code used to identify the Make of the vehicle.',
    MOT_TYPE			int(2)			not null comment 'It is the code used to identify the specific Motor Type.',
    MAKE				varchar(50)		not null comment 'Model/car make of the vehicle or conveyance.',
    NO_OF_PASS			int(3)			comment 'Number of passengers.',
    TYPE_OF_BODY		varchar(30)		comment 'Describes the vehicle''s type of body or built.',
    USER_ID				varchar(8) 		not null comment 'User who created or last updated the record.',
    LAST_UPDATE			datetime		not null comment 'Date when the record is last updated. This is system generated.',
    REMARKS				varchar(4000) 	comment 'Any information pertinent to the record.',
    primary key (CAR_COMPANY_CD, MAKE_CD),
    foreign key (CAR_COMPANY_CD) references EPIM_MC_CAR_COMPANY(CAR_COMPANY_CD)
);