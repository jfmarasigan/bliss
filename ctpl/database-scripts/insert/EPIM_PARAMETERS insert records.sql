-- CTPL_ISS_CD
insert into EPIM_PARAMETERS (param_type, param_name, remarks, user_id, last_update)
values ('V', 'CTPL_ISS_CD', 'Parameterized dedicated branch for CTPL policies.', LEFT(current_user(),LOCATE('@',current_user()) - 1), sysdate());

-- CTPL_INTM_NO
insert into EPIM_PARAMETERS (param_type, param_name, remarks, user_id, last_update)
values ('V', 'CTPL_INTM_NO', 'Parameterized dedicated intermediary/agent for CTPL policies.', LEFT(current_user(),LOCATE('@',current_user()) - 1), sysdate());

-- CTPL_VAT_TAG
insert into EPIM_PARAMETERS (param_type, param_name, remarks, user_id, last_update)
values ('V', 'CTPL_VAT_TAG', 'Parameterized vat registration type of the insured: Vatable, VAT Exempt or Zero Rated', LEFT(current_user(),LOCATE('@',current_user()) - 1), sysdate());

-- CTPL_PAYTERM
insert into EPIM_PARAMETERS (param_type, param_name, remarks, user_id, last_update)
values ('V', 'CTPL_PAYTERM', 'Parameterized dedicated payment term for CTPL policies.', LEFT(current_user(),LOCATE('@',current_user()) - 1), sysdate());

-- CTPL_CASHIER_CD
insert into EPIM_PARAMETERS (param_type, param_name, remarks, user_id, last_update)
values ('N', 'CTPL_CASHIER_CD', 'Indicates the client-assigned cashier code for CTPL official receipt.', LEFT(current_user(),LOCATE('@',current_user()) - 1), sysdate());

-- COC_COMPANY_CD
insert into EPIM_PARAMETERS (param_type, param_name, remarks, user_id, last_update)
values ('V', 'COC_COMPANY_CD', 'Parameterized dedicated for the three digit company code as prefix.', LEFT(current_user(),LOCATE('@',current_user()) - 1), sysdate());

-- CTPL_USER
insert into EPIM_PARAMETERS (param_type, param_name, remarks, user_id, last_update)
values ('V', 'CTPL_USER', 'Indicates the client-assigned user for CTPL.', LEFT(current_user(),LOCATE('@',current_user()) - 1), sysdate());

-- CTPL_ASSD_TYPE
insert into EPIM_PARAMETERS (param_type, param_name, remarks, user_id, last_update)
values ('V', 'CTPL_ASSD_TYPE', 'Indicates the client-assigned assured type for CTPL.', LEFT(current_user(),LOCATE('@',current_user()) - 1), sysdate());

-- CTPL_SUMMARY_DTLS_TEXT
insert into EPIM_PARAMETERS (param_type, param_name, remarks, user_id, last_update)
values ('V', 'CTPL_SUMMARY_DTLS_TEXT', 'Indicates the text to be displayed in the Summary Details screen.', LEFT(current_user(),LOCATE('@',current_user()) - 1), sysdate());

-- CTPL_OR_PREF
insert into EPIM_PARAMETERS (param_type, param_name, remarks, user_id, last_update)
values ('V', 'CTPL_OR_PREF', 'Parameterized dedicated for the prefix of CTPL OR.', LEFT(current_user(),LOCATE('@',current_user()) - 1), sysdate());

-- CTPL_PRODUCT_NAME
insert into EPIM_PARAMETERS (param_type, param_name, param_value_v, remarks, user_id, last_update)
values ('V', 'CTPL_PRODUCT_NAME', 'CTPL Policy', 'Parameterized dedicated for the Product Name of CTPL.', LEFT(current_user(),LOCATE('@',current_user()) - 1), sysdate());

-- CTPL_PERIL_TSI
insert into EPIM_PARAMETERS (param_type, param_name, param_value_n, remarks, user_id, last_update)
values ('N', 'CTPL_PERIL_TSI', 100000, 'Indicates the default TSI for CTPL peril', LEFT(current_user(),LOCATE('@',current_user()) - 1), sysdate());

-- BRANCH_TIN
insert into EPIM_PARAMETERS (param_type, param_name, param_value_v, remarks, user_id, last_update)
values ('V', 'BRANCH_TIN', '123-456-789-000', 'Indicates the insurance company’s branch TIN.', LEFT(current_user(),LOCATE('@',current_user()) - 1), sysdate());

-- CTPL_SIGNATORY
insert into EPIM_PARAMETERS (param_type, param_name, param_value_v, remarks, user_id, last_update)
values ('V', 'CTPL_SIGNATORY', 'BEBETTE VENTURA', 'Indicates the insurance company’s signatory for CTPL Policies.', LEFT(current_user(),LOCATE('@',current_user()) - 1), sysdate());

-- CTPL_SIGNATORY_DES
insert into EPIM_PARAMETERS (param_type, param_name, param_value_v, remarks, user_id, last_update)
values ('V', 'CTPL_SIGNATORY_DES', 'PRESIDENT', 'Indicates the designation of the insurance company’s signatory for CTPL Policies.', LEFT(current_user(),LOCATE('@',current_user()) - 1), sysdate());

-- CTPL_SIGNATORY_SIGN
insert into EPIM_PARAMETERS (param_type, param_name, param_value_v, remarks, user_id, last_update)
values ('V', 'CTPL_SIGNATORY_SIGN', 'C:\IMAGE.JPEG', 'Indicates the location of the e-Sign image file for the insurance company’s signatory for CTPL Policies.', LEFT(current_user(),LOCATE('@',current_user()) - 1), sysdate());

-- COMP_LOGO
insert into EPIM_PARAMETERS (param_type, param_name, param_value_v, remarks, user_id, last_update)
values ('V', 'COMP_LOGO', 'C:\LOGO.JPEG', 'Indicates the location of the company logo image.', LEFT(current_user(),LOCATE('@',current_user()) - 1), sysdate());

-- COMP_NAME
insert into EPIM_PARAMETERS (param_type, param_name, param_value_v, remarks, user_id, last_update)
values ('V', 'COMP_NAME', 'CPInsurance', 'Company Name', LEFT(current_user(),LOCATE('@',current_user()) - 1), sysdate());

-- COMP_ADD
insert into EPIM_PARAMETERS (param_type, param_name, param_value_v, remarks, user_id, last_update)
values ('V', 'COMP_ADD', 'PENTHOUSE, HENRYS BLDG., 80 ORTIGAS AVE., GREENHILLS SAN JUAN 1502', 'Company Address', LEFT(current_user(),LOCATE('@',current_user()) - 1), sysdate());

-- COMP_TEL
insert into EPIM_PARAMETERS (param_type, param_name, param_value_v, remarks, user_id, last_update)
values ('V', 'COMP_TEL', 'TEL. NO: 727 1621', 'Company Contact Number', LEFT(current_user(),LOCATE('@',current_user()) - 1), sysdate());

-- COMP_EMAIL
insert into EPIM_PARAMETERS (param_type, param_name, param_value_v, remarks, user_id, last_update)
values ('V', 'COMP_EMAIL', 'info@cpi.com.ph', 'Insurance Company Email address', LEFT(current_user(),LOCATE('@',current_user()) - 1), sysdate());

-- COMP_WEBSITE
insert into EPIM_PARAMETERS (param_type, param_name, param_value_v, remarks, user_id, last_update)
values ('V', 'COMP_WEBSITE', 'www.cpi.com.ph', 'Insurance Company website', LEFT(current_user(),LOCATE('@',current_user()) - 1), sysdate());

-- CTPL_AGENT_CD
insert into EPIM_PARAMETERS (param_type, param_name, param_value_v, remarks, user_id, last_update)
values ('V', 'CTPL_AGENT_CD', '123', 'CTPL policies’ agent code', LEFT(current_user(),LOCATE('@',current_user()) - 1), sysdate());

-- CTPL_AGENT_NAME
insert into EPIM_PARAMETERS (param_type, param_name, param_value_v, remarks, user_id, last_update)
values ('V', 'CTPL_AGENT_NAME', 'JM RAZON', 'CTPL policies’ agent name', LEFT(current_user(),LOCATE('@',current_user()) - 1), sysdate());

-- CTPL_USER_ID
insert into EPIM_PARAMETERS (param_type, param_name, param_value_v, remarks, user_id, last_update)
values ('V', 'CTPL_USER_ID', 'GCMIRALLES', 'System User ID', LEFT(current_user(),LOCATE('@',current_user()) - 1), sysdate());

-- CTPL_TSI_AMT
insert into EPIM_PARAMETERS (param_type, param_name, param_value_n, remarks, user_id, last_update)
values ('N', 'CTPL_TSI_AMT', 100000, 'Sum Insured for CTPL cover', LEFT(current_user(),LOCATE('@',current_user()) - 1), sysdate());
