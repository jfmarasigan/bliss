CREATE TABLE EPIT_CTPL_TRANS (
	TRAN_ID				bigint(12)		not null auto_increment comment	'Identifier of every export transaction.',
	POLICY_ID			bigint(12)		not null comment 'A system generated ID which uniquely identifies CTPL policy records.',
	PAYMENT_STAT		varchar(250)	comment	'Identifier whether the payment transaction has been transmitted.',
	COCAF_AUTH_STAT		varchar(250)	comment	'Identifier whether the transaction has been authenticated by COCAF.',
    GEN_REPORT_STAT		varchar(250)	comment 'Identifier whether the reports (Policy schedule, COC and OR) has been successfully generated.',
    EMAIL_REPORT_STAT	varchar(250)	comment 'Identifier whether the reports (Policy schedule, COC and OR) has been successfully emailed.',
	SYSTEM_STAT			varchar(250)	comment	'Identifier whether the transaction has been successfully transferred to the system (GENIISYS).',
	POLICY_NO			varchar(40)		comment	'Unique identification of the transaction (syntax includes: line, subline, branch, year and sequence).',
	BILL_NO				varchar(20) 	comment 'Bill number processed in the system (GENIISYS/Local System).',
    OR_NO				varchar(14)		comment	'Official Receipt Number for the paid premium.',
    PAYT_REF_NO 		varchar(250) 	comment 'Unique identifier assigned to bill payment transaction.',
    PAYT_AMT			double(12, 2) 	comment 'Amount paid to bill payment transaction.',
    DATE_OF_PAYT		datetime		comment 'Date of Payment to bill payment transaction.',
    PAYT_METHOD			varchar(10) 	comment 'Payment Method used in the payment transaction.',
	DATE_INSERTED		datetime		comment	'Date when the records are inserted in the system (GENIISYS).',
	LAST_UPDATE			datetime		not null comment 'Date when the records are updated.',
    primary key (TRAN_ID)
);