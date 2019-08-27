CREATE TABLE EPIM_PERIL (
	LINE_CD				varchar(2) 		not null comment 'Line code used for each line of business.',
    PERIL_CD			int(5)	 		not null comment 'Code used to identify the peril to be included in the policy cover.',
    PERIL_NAME			varchar(20)		not null comment 'Defined subline name for each product.',
    USER_ID				varchar(8) 		not null comment 'User who created or last updated the record.',
    LAST_UPDATE			datetime		not null comment 'Date when the record is last updated. This is system generated.',
    REMARKS				varchar(4000)	comment 'Any information pertinent to the record.',
	primary key (LINE_CD, PERIL_CD),
    foreign key (LINE_CD) references EPIM_LINE(LINE_CD)
);