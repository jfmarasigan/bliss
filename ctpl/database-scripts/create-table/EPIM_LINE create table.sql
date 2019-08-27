CREATE TABLE EPIM_LINE (
	LINE_CD				varchar(2) 		not null comment 'Line code used for each line of business.',
    LINE_NAME			varchar(20)		not null comment 'Defined name for each line of business.',
    USER_ID				varchar(8) 		not null comment 'User who created or last updated the record.',
    LAST_UPDATE			datetime		not null comment 'Date when the record is last updated. This is system generated.',
    REMARKS				varchar(4000)	comment 'Any information pertinent to the record.',
	primary key (LINE_CD)
);