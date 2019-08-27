CREATE TABLE EPIM_MV_TYPE (
	MV_TYPE_CD			varchar(2) 		not null comment 'It is the code used to identify the type of vehicle.',
    MV_TYPE_DESC 		varchar(50) 	not null comment 'Description of Type of vehicle insured.',
    USER_ID				varchar(8) 		not null comment 'User who created or last updated the record.',
    LAST_UPDATE			datetime		not null comment 'Date when the record is last updated. This is system generated.',
    REMARKS				varchar(4000) 	comment 'Any information pertinent to the record.',
    primary key (MV_TYPE_CD, MV_TYPE_DESC)
);