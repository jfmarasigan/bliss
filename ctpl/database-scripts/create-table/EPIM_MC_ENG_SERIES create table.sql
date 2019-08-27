CREATE DATABASE IF NOT EXISTS `ctpl`;

DROP TABLE IF EXISTS `EPIM_MC_ENG_SERIES`;

CREATE TABLE `EPIM_MC_ENG_SERIES` (
  `CAR_COMPANY_CD` 	bigint(6) 		NOT NULL COMMENT 'It is the code used to identify the specific Car Company name.',
  `MAKE_CD` 		bigint(12) 		NOT NULL COMMENT 'It is the code used to identify the Make of the vehicle.',
  `SERIES_CD` 		bigint(12) 		NOT NULL COMMENT 'It is the code used to identify the Engine Series of the vehicle.',
  `ENGINE_SERIES` 	varchar(50) 	NOT NULL COMMENT 'Engine series name of the vehicle',
  `USER_ID` 		varchar(8) 		NOT NULL COMMENT 'User who created or last updated the record.',
  `LAST_UPDATE` 	datetime 		NOT NULL COMMENT 'Date when the record is last updated. This is system generated.',
  `REMARKS` 		varchar(4000) 	DEFAULT NULL COMMENT 'Any information pertinent to the record.',
  PRIMARY KEY (`CAR_COMPANY_CD`,`MAKE_CD`,`SERIES_CD`),
  FOREIGN KEY (`CAR_COMPANY_CD`, `MAKE_CD`) REFERENCES `EPIM_MC_MAKE` (`CAR_COMPANY_CD`, `MAKE_CD`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
