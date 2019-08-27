CREATE TABLE EPIM_CTPL_FAQ (
	FAQ_CD			varchar(8)		not null comment 'A code which uniquely identifies each Frequently Asked Questions (FAQ).',
	FAQ_QUESTION	varchar(250)	not null comment 'Question in the FAQ.',
	FAQ_ANSWER		text			not null comment 'Answer in the FAQ.',
    CREATE_USER		varchar(8)		not null comment 'User who added or created the record.',
    CREATE_DATE		datetime		not null comment 'Date when the record was added or created.',
	USER_ID			varchar(8) 		not null comment 'User who created or last updated the record.',
    LAST_UPDATE		datetime		not null comment 'Date when the record is last updated. This is system generated.',
    REMARKS			varchar(4000)   comment 'Any information pertinent to the record.',
    primary key (FAQ_CD)
);