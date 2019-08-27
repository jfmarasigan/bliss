CREATE DATABASE IF NOT EXISTS `ctpl`;

DROP TABLE IF EXISTS `EPIM_PARAMETERS`;

CREATE TABLE `EPIM_PARAMETERS` (
  `PARAM_TYPE`    varchar(1)    NOT NULL COMMENT 'Identifies the data type of the parameter.',
  `PARAM_NAME`    varchar(50)   NOT NULL COMMENT 'Refers to the name of the parameter.',
  `PARAM_VALUE_N` double(16,2)  DEFAULT NULL COMMENT 'This is only required when the Parameter Type field is set to Numeric. It sets the value of the parameter.',
  `PARAM_VALUE_V` varchar(200)  DEFAULT NULL COMMENT 'This is only required when the Parameter Type field is set to Character. It sets the value of the parameter.',
  `PARAM_VALUE_D` datetime      DEFAULT NULL COMMENT 'This is only required when the Parameter Type field is set to Date. It sets the value of the parameter',
  `PARAM_LENGTH`  int(4)        DEFAULT NULL COMMENT 'Parameter Length. Sets how long or how many characters fields Numeric Value or Character Value can have.',
  `REMARKS`       varchar(4000) DEFAULT NULL COMMENT 'Indicates additional information about the parameter.',
  `USER_ID`       varchar(50)   NOT NULL COMMENT 'User who created or last updated the record.',
  `LAST_UPDATE`   datetime      NOT NULL COMMENT 'Date when the record is last updated.',
  PRIMARY KEY (`PARAM_TYPE`,`PARAM_NAME`)
)
