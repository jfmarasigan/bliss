CREATE TABLE EPIM_COCAF_USERS (
	COCAF_USER			varchar(30) 	not null comment 'COCAF username of the user.',
    COCAF_PWD			varchar(10)		not null comment 'COCAF password of the user.',
    LAST_USER_ID		varchar(8) 		not null comment 'User who created or last updated the record.',
    LAST_UPDATE			datetime		not null comment 'Date when the record is last updated. This is system generated.',
    primary key (COCAF_USER)
);