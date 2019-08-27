CREATE TABLE EPIM_TAXES (
	LINE_CD				varchar(2) 		not null comment 'Line code used for each line of business.',
    TAX_CD				int(2)	 		not null comment 'A code which uniquely identifies each tax record.',
    TAX_DESC			varchar(50)		not null comment 'Corresponds to the Tax Description.',
    TAX_RATE			double precision (12, 2) comment 'Tax rate that will be used in the computation of taxes. This field can only be populated if the tax type of the tax record is Fixed Rate.',
    TAX_AMOUNT			double precision (12, 2) comment 'Tax amount applied for tax records of fixed amount type. This amount is in local currency and can only be populated if tax type is Fixed Amount.',
    TAX_TYPE			varchar(1)		not null comment 'Tax type of the record which identifies how the tax can be computed. The possible values are: R - Fixed Rate, A - Fixed Amount ',
    USER_ID				varchar(8) 		not null comment 'User who created or last updated the record.',
    LAST_UPDATE			datetime		not null comment 'Date when the record is last updated. This is system generated.',
    REMARKS				varchar(4000)	comment 'Any information pertinent to the record.',
	primary key (LINE_CD, TAX_CD),
    foreign key (LINE_CD) references EPIM_LINE (LINE_CD)
);