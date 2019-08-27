CREATE TABLE EPIM_SUBLINE (
	LINE_CD				varchar(2) 		not null comment 'Line code used for each line of business.',
    SUBLINE_CD			varchar(7) 		not null comment 'Subline code used to identify the type of product.',
    SUBLINE_NAME		varchar(30)		not null comment 'Defined subline name for each product.',
    USER_ID				varchar(8) 		not null comment 'User who created or last updated the record.',
    LAST_UPDATE			datetime		not null comment 'Date when the record is last updated. This is system generated.',
    REMARKS				varchar(4000)	comment 'Any information pertinent to the record.',
	primary key (LINE_CD, SUBLINE_CD),
    foreign key (LINE_CD) references EPIM_LINE(LINE_CD)
);