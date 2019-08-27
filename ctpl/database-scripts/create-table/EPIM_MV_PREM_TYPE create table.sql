CREATE TABLE EPIM_MV_PREM_TYPE (
	REG_TYPE			varchar(1)		not null comment 'Identifier whether the registration is NEW application or RENEWAL. Valid values: N - NEW, R - RENEWAL',
	MV_TYPE_CD			varchar(2) 		not null comment 'It is the code used to identify the type of vehicle.',
    MV_PREM_TYPE_CD 	varchar(2) 		not null comment 'Description of Type of vehicle insured.',
    MV_PREM_TYPE_DESC	varchar(250)	not null comment 'Description of Premium Type of vehicle insured.',
    PREM_AMT			double(12, 2) 	not null comment 'Premium amount of the CTPL cover.',
    USER_ID				varchar(8) 		not null comment 'User who created or last updated the record.',
    LAST_UPDATE			datetime		not null comment 'Date when the record is last updated. This is system generated.',
    REMARKS				varchar(4000) 	comment 'Any information pertinent to the record.',
    primary key (REG_TYPE, MV_TYPE_CD, MV_PREM_TYPE_CD),
    foreign key (MV_TYPE_CD) references EPIM_MV_TYPE(MV_TYPE_CD)
);