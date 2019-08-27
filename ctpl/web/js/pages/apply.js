var ctplUrl = 'https://api.eproductsph.net/ctpl';

$(document).ready(function () {
    initialize();

    function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1);
        var sURLVariables = sPageURL.split('&');
        var sParameterName;

        for (var i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    };

    function initialize() {
        $('#selPolicyType').focus();

        $('#vehicleDetailsContent, #registrationDetailsContent, #personalDetailsContent, ' +
            '#cwoa-div, #cwa-div, #summaryDetailsContent').hide();

        $('#dpInceptionDate').datepicker({
            autoclose: true
        });

        $('#dpBirthdate').datepicker({
            autoclose: true,
            endDate: new Date()
        });

        loadPolicyMvType();
        loadYearModel();
        loadCarCompany();

        if (getUrlParameter('requestId') != undefined) {
            retrieveFormData();
        }
    }

    async function timeout(ms) {
        return new Promise(resolve => {
            setTimeout(resolve, ms);
        });
    }

    function retrieveFormData() {
        var policyId = getUrlParameter('requestId').substr(3, 12).replace(/^0+/, '');

        $.ajax({
            type: 'GET',
            url: ctplUrl + '/get-policy-details?policyId=' + policyId,
            beforeSend: showNotice('Retrieving your data. Please wait...'),
            success: function (response) {
                retrievePolicyDtls(response);
            },
            error: function (jqXHR) {
                hideNotice();
                showMessage('There is an error encountered while retrieving your data.', 'E');
            }
        });
    }

    async function retrievePolicyDtls(response) {
        var newApp = $('#rdoNewApplication');
        var renewApp = $('#rdoRenewal');

        response.registrationType == 'N' ? newApp.trigger('click') : renewApp.trigger('click');

        await timeout(500);
        $('#selPolicyType').val(response.policyType);
        $('#selMvType').val(response.mvType).trigger('change');
        await timeout(500);

        $('#selMvPremType').val(response.mvPremType).trigger('change');
        $('#dpInceptionDate').val(response.inceptionDate)
            .datepicker('update', response.inceptionDate).trigger('change');
        $('#btnPolicyDetailsNext').trigger('click');
        retrieveVehicleDtls(response);
    }

    async function retrieveVehicleDtls(response) {
        $('#selYearModel').val(response.yearModel);
        $('#selCarCompany').val(response.carCompanyCd).trigger('change');
        await timeout(500);

        $('#selMake').val(response.makeCd).trigger('change');
        await timeout(500);

        $('#selVariant').val(response.engineCd);
        $('#txtColor').val(response.color);
        $('#btnVehicleDetailsNext').trigger('click');
        retrieveRegistrationDtls(response);
    }

    function retrieveRegistrationDtls(response) {
        $('#txtPlateNo').val(response.plateNo);
        $('#txtSerialNo').val(response.serialNo);
        $('#txtEngineNo').val(response.motorNo);
        $('#txtMvFileNo').val(response.mvFileNo);
        $('#btnRegistrationDetailsNext').trigger('click');
        retrievePersonalDtls(response);
    }

    function retrievePersonalDtls(response) {
        response.corporateTag == 'I' ? $('#selType').val('1') :
            (response.firstName == null ? $('#selType').val('2') : $('#selType').val('3'));
        $('#selType').trigger('change');

        if ($('#selType').val() == '1') {
            $('#txtIndividualFirstName').val(response.firstName);
            $('#txtIndividualMiddleInitial').val(response.middleInitial);
            $('#txtIndividualLastName').val(response.lastName);
            $('#dpBirthdate').val(response.dateOfBirth).datepicker('update', response.dateOfBirth);
            $('#selGender').val(response.gender);
            $('#txtIndividualEmailAddress').val(response.emailAddress);
            $('#txtIndividualAddress').val(response.address);
            $('#txtIndividualZipCode').val(response.zipCd);
            $('#txtIndividualPhoneNo').val(response.phoneNo);
            $('#txtIndividualTin').val(response.tinNo);
        } else if ($('#selType').val() == '2') {
            $('#txtCwoaCorporateName').val(response.corporateName);
            $('#txtCwoaEmailAddress').val(response.emailAddress);
            $('#txtCwoaAddress').val(response.address);
            $('#txtCwoaZipCode').val(response.zipCd);
            $('#txtCwoaPhoneNo').val(response.phoneNo);
            $('#txtCwoaTin').val(response.tinNo);
        } else if ($('#selType').val() == '3') {
            $('#txtCwaCorporateName').val(response.corporateName);
            $('#txtCwaFirstName').val(response.firstName);
            $('#txtCwaMiddleInitial').val(response.middleInitial);
            $('#txtCwaLastName').val(response.lastName);
            $('#txtCwaEmailAddress').val(response.emailAddress);
            $('#txtCwaAddress').val(response.address);
            $('#txtCwaZipCode').val(response.zipCd);
            $('#txtCwaPhoneNo').val(response.phoneNo);
            $('#txtCwaTin').val(response.tinNo);
        }

        $('#btnPersonalDetailsNext').trigger('click');
        retrieveBillDtls();
    }

    function retrieveBillDtls() {
        var sBillDtls = JSON.parse(sessionStorage.getItem('ctplBillDtls'));

        if (sBillDtls !== null) {
            $('#txtBillFirstName').val(sBillDtls.firstName);
            $('#txtBillMiddleName').val(sBillDtls.middleName);
            $('#txtBillLastName').val(sBillDtls.lastName);
            $('#txtBillEmailAddress').val(sBillDtls.email);
            $('#txtBillAddress').val(sBillDtls.address);
            $('#txtBillPhoneNo').val(sBillDtls.phoneNo);
            $('#txtBillZipCode').val(sBillDtls.zipCd);
            sessionStorage.removeItem('ctplBillDtls');
        }
    }

    function loadPolicyMvType() {
        $.ajax({
            type: 'GET',
            url: ctplUrl + '/policy-details/get-policy-and-mv-type',
            beforeSend: function () {
                $('#selPolicyType').empty().append($('<option>', {
                    value: '',
                    text: 'FETCHING DATA ...'
                }));

                $('#selMvType').empty().append($('<option>', {
                    value: '',
                    text: 'FETCHING DATA ...'
                }));
            },
            success: function (response) {
                $('#selPolicyType').empty().append($('<option>', {
                    value: '',
                    text: 'SELECT'
                }));

                $('#selMvType').empty().append($('<option>', {
                    value: '',
                    text: 'SELECT'
                }));

                $.each(response, function (key, value) {
                    if (key == 'policyType') {
                        $.each(value, function (index, value) {
                            $('#selPolicyType').append($('<option>', {
                                value: value.SUBLINE_CD,
                                text: value.SUBLINE_NAME.toUpperCase()
                            }));
                        });
                    } else if (key == 'mvType') {
                        $.each(value, function (index, value) {
                            $('#selMvType').append($('<option>', {
                                value: value.MV_TYPE_CD,
                                text: value.MV_TYPE_DESC.toUpperCase()
                            }));
                        });
                    }
                });
            },
            error: function (jqXHR) {
                showMessage('There is an error encountered while getting Policy MV Type.', 'E');
            }
        });
    }

    function loadYearModel() {
        for (i = new Date().getFullYear(); i > 1900; i--) {
            $('#selYearModel').append($('<option>', {
                value: i,
                text: i
            }));
        }
    }

    function loadCarCompany() {
        $.ajax({
            type: 'GET',
            url: ctplUrl + '/vehicle-details/get-car-company-list',
            success: function (response) {
                $.each(response, function (index, value) {
                    $('#selCarCompany').append($('<option>', {
                        value: value.CAR_COMPANY_CD,
                        text: value.CAR_COMPANY.toUpperCase()
                    }));
                });
            },
            error: function (jqXHR) {
                showMessage('There is an error encountered while getting Car Company.', 'E');
            }
        });
    }

    function loadMvPremType() {
        if ($('#selMvType').val() == '') {
            $('#selMvPremType').empty().append($('<option>', {
                value: '',
                text: 'Select MV Type First'
            }));
        } else {
            $.ajax({
                type: 'GET',
                url: ctplUrl + '/policy-details/get-mv-prem-type',
                data: {
                    regType: $('#rdoNewApplication').is(':checked') ? 'N' : 'R',
                    mvType: $('#selMvType').val()
                },
                beforeSend: function () {
                    $('#selMvPremType').empty().append($('<option>', {
                        value: '',
                        text: 'FETCHING DATA ...'
                    }));
                },
                success: function (response) {
                    $('#selMvPremType').empty().append($('<option>', {
                        value: '',
                        text: 'SELECT'
                    }));

                    $.each(response, function (key, value) {
                        $('#selMvPremType').append($('<option>', {
                            value: value.MV_PREM_TYPE_CD,
                            text: value.MV_PREM_TYPE_DESC.toUpperCase(),
                            prem: value.PREM_AMT
                        }));
                    });
                },
                error: function (jqXHR) {
                    showMessage('There is an error encountered while getting MV Premium Type.', 'E');
                }
            });
        }

        $('#policyDetailsContent .amount').html('&#8369;0.00');
    }

    $('#selMvType').change(function () {
        loadMvPremType();
    });

    $('#selMvPremType').change(function () {
        if ($(this).val() == '') {
            $('#policyDetailsContent .amount').html('&#8369;0.00');
        } else {
            $('#policyDetailsContent .amount').html('&#8369;' + formatCurrency($('option:selected', this).attr('prem')));
        }
    });

    function loadVariant() {
        if ($('#selMake').val() == '') {
            $('#selVariant').empty().append($('<option>', {
                value: '',
                text: 'SELECT MAKE FIRST'
            }));
        } else {
            $.ajax({
                type: 'GET',
                url: ctplUrl + '/vehicle-details/get-engine-series-list',
                data: {
                    carCompanyCd: $('#selCarCompany').val(),
                    makeCd: $('#selMake').val()
                },
                beforeSend: function () {
                    $('#selVariant').empty().append($('<option>', {
                        value: '',
                        text: 'FETCHING DATA ...'
                    }));
                },
                success: function (response) {
                    $('#selVariant').empty().append($('<option>', {
                        value: '',
                        text: 'SELECT'
                    }));

                    $.each(response, function (key, value) {
                        $('#selVariant').append($('<option>', {
                            value: value.SERIES_CD,
                            text: value.ENGINE_SERIES.toUpperCase()
                        }));
                    });
                },
                error: function (jqXHR) {
                    showMessage('There is an error encountered while getting Variant/Engine Series.', 'E');
                }
            });
        }
    }

    $('#selCarCompany').change(function () {
        if ($(this).val() == '') {
            $('#selMake').empty().append($('<option>', {
                value: '',
                text: 'SELECT CAR COMPANY FIRST'
            }));
        } else {
            $.ajax({
                type: 'GET',
                url: ctplUrl + '/vehicle-details/get-make',
                data: {
                    carCompanyCd: $(this).val()
                },
                beforeSend: function () {
                    $('#selMake').empty().append($('<option>', {
                        value: '',
                        text: 'FETCHING DATA ...'
                    }));
                },
                success: function (response) {
                    $('#selMake').empty().append($('<option>', {
                        value: '',
                        text: 'SELECT'
                    }));

                    $.each(response, function (key, value) {
                        $('#selMake').append($('<option>', {
                            value: value.MAKE_CD,
                            text: value.MAKE.toUpperCase()
                        }));
                    });
                },
                error: function (jqXHR) {
                    showMessage('There is an error encountered while getting Make.', 'E');
                }
            });
        }

        $('#selMake').val('');
        loadVariant();
    });

    $('#selMake').change(function () {
        loadVariant();
    });

    function fillSummaryContent() {
        $('#tbIndividual, #tbCwoa, #tbCwa').hide();
        $('#txtBillFirstName').val('');
        $('#txtBillMiddleName').val('');
        $('#txtBillLastName').val('');
        $('#txtBillEmailAddress').val('');
        $('#txtBillAddress').val('');
        $('#txtBillPhoneNo').val('');
        $('#txtBillZipCode').val('');

        if ($('#selType').val() == 1) {
            var fname = $('#txtIndividualFirstName').val() + ' ';
            var minitial = $('#txtIndividualMiddleInitial').val() != '' ? $('#txtIndividualMiddleInitial').val() + '. ' : '';
            var lname = $('#txtIndividualLastName').val();

            $('#tdName').text(fname + minitial + lname);
            $('#tdBirthdate').text($('#dpBirthdate').val());
            $('#tdGender').text($('#selGender option:selected').text());
            $('#tdIndividualAddress').text($('#txtIndividualAddress').val() + ', ' + $('#txtIndividualZipCode').val());
            $('#tdIndividualEmailAddress').text($('#txtIndividualEmailAddress').val());
            $('#tdIndividualPhoneNo').text($('#txtIndividualPhoneNo').val());
            $('#tdIndividualTin').text($('#txtIndividualTin').val());

            $('#tbIndividual').show();

            $('#txtBillFirstName').val($('#txtIndividualFirstName').val());
            $('#txtBillMiddleName').val($('#txtIndividualMiddleInitial').val());
            $('#txtBillLastName').val($('#txtIndividualLastName').val());
            $('#txtBillEmailAddress').val($('#txtIndividualEmailAddress').val());
            $('#txtBillAddress').val($('#txtIndividualAddress').val());
            $('#txtBillPhoneNo').val($('#txtIndividualPhoneNo').val());
            $('#txtBillZipCode').val($('#txtIndividualZipCode').val());
        } else if ($('#selType').val() == 2) {
            $('#tdCwoaCorporateName').text($('#txtCwoaCorporateName').val());
            $('#tdCwoaAddress').text($('#txtCwoaAddress').val() + ', ' + $('#txtCwoaZipCode').val());
            $('#tdCwoaEmailAddress').text($('#txtCwoaEmailAddress').val());
            $('#tdCwoaPhoneNo').text($('#txtCwoaPhoneNo').val());
            $('#tdCwoaTin').text($('#txtCwoaTin').val());

            $('#tbCwoa').show();
        } else if ($('#selType').val() == 3) {
            var fname = $('#txtCwaFirstName').val() + ' ';
            var minitial = $('#txtCwaMiddleInitial').val() != '' ? $('#txtCwaMiddleInitial').val() + '. ' : '';
            var lname = $('#txtCwaLastName').val();

            $('#tdCwaCorporateName').text($('#txtCwaCorporateName').val());
            $('#tdAssignee').text(fname + minitial + lname);
            $('#tdCwaAddress').text($('#txtCwaAddress').val() + ', ' + $('#txtCwaZipCode').val());
            $('#tdCwaEmailAddress').text($('#txtCwaEmailAddress').val());
            $('#tdCwaPhoneNo').text($('#txtCwaPhoneNo').val());
            $('#tdCwaTin').text($('#txtCwaTin').val());

            $('#tbCwa').show();
        }

        $('#tdYearModel').text($('#selYearModel').val());
        $('#tdColor').text($('#txtColor').val());
        $('#tdVehicleMaker').text($('#selCarCompany option:selected').text() + ' / ' + $('#selMake option:selected').text());
        $('#tdSeries').text($('#selVariant option:selected').text());
        $('#tdMvFileNo').text($('#txtMvFileNo').val());
        $('#tdPlateNo').text($('#txtPlateNo').val());
        $('#tdSerial').text($('#txtSerialNo').val());
        $('#tdMotorNo').text($('#txtEngineNo').val());

        $('#tdRegistrationType').text($('#rdoNewApplication').is(':checked') ? 'NEW APPLICATION' : 'RENEWAL');
        $('#tdPolicyType').text($('#selPolicyType option:selected').text());
        $('#tdMvType').text($('#selMvType option:selected').text());
        $('#tdMvPremType').text($('#selMvPremType option:selected').text());

        $('#tdPremAmount').text(formatCurrency($('option:selected', $('#selMvPremType')).attr('prem')));

        var taxAmt = 0;
        $.ajax({
            type: 'GET',
            async: false,
            url: ctplUrl + '/vehicle-details/get-taxes',
            success: function (response) {
                $.each(response, function (index, value) {
                    if (value.TAX_TYPE == 'R') {
                        taxAmt += ($('option:selected', $('#selMvPremType')).attr('prem') * value.TAX_RATE) / 100;
                    } else {
                        taxAmt += value.TAX_AMOUNT;
                    }
                });
            },
            error: function (jqXHR) {
                showMessage('There is an error encountered while getting Tax amounts.', 'E');
            }
        });

        $('#tdTaxAmount').text(formatCurrency(parseFloat(taxAmt).toFixed(2)));
        let totalAmountDue = parseFloat($('#tdPremAmount').text().replace(',', '')) + parseFloat($('#tdTaxAmount').text().replace(',', ''));
        $('#tdTotalAmountDue').text(formatCurrency(totalAmountDue.toFixed(2)));
    }

    function showContent(step) {
        $('#policyDetailsStep, #vehicleDetailsStep, #registrationDetailsStep, ' +
            '#personalDetailsStep, #summaryDetailsStep').removeClass('active');

        $('#policyDetailsContent, #vehicleDetailsContent, #registrationDetailsContent, ' +
            '#personalDetailsContent, #summaryDetailsContent').hide(400, 'linear');

        if (step == 1) {
            $('#policyDetailsStep').addClass('active');
            $('#selMobile').val('1');
            $('#policyDetailsContent').show(400, 'linear');
        } else if (step == 2) {
            $('#vehicleDetailsStep').addClass('active');
            $('#selMobile').val('2');
            $('#vehicleDetailsContent').show(400, 'linear');
        } else if (step == 3) {
            $('#registrationDetailsStep').addClass('active');
            $('#selMobile').val('3');
            $('#registrationDetailsContent').show(400, 'linear');
        } else if (step == 4) {
            $('#personalDetailsStep').addClass('active');
            $('#selMobile').val('4');
            $('#personalDetailsContent').show(400, 'linear');
        } else if (step == 5) {
            $('#summaryDetailsStep').addClass('active');
            $('#selMobile').val('5');
            $('#summaryDetailsContent').show(400, 'linear');
        }
    }

    $('#policyDetailsStep').click(function () {
        if (!$(this).hasClass('active'))
            showContent(1);
    });

    $('#vehicleDetailsStep').click(function () {
        if (!$(this).hasClass('disabled') && !$(this).hasClass('active'))
            showContent(2);
    });

    $('#registrationDetailsStep').click(function () {
        if (!$(this).hasClass('disabled') && !$(this).hasClass('active'))
            showContent(3);
    });

    $('#personalDetailsStep').click(function () {
        if (!$(this).hasClass('disabled') && !$(this).hasClass('active'))
            showContent(4);
    });

    $('#summaryDetailsStep').click(function () {
        if (!$(this).hasClass('disabled') && !$(this).hasClass('active')) {
            fillSummaryContent();
            showContent(5);
        }
    });

    $('#selMobile').change(function () {
        if ($(this).val() == 1) {
            showContent(1);
        } else if ($(this).val() == 2) {
            showContent(2);
        } else if ($(this).val() == 3) {
            showContent(3);
        } else if ($(this).val() == 4) {
            showContent(4);
        } else if ($(this).val() == 5) {
            fillSummaryContent();
            showContent(5);
        }
    });

    $('#dpInceptionDate').change(function () {
        if (this.value == '') {
            $('#dpExpiryDate').val('');
        } else {
            var parts = this.value.split('/');
            var duration = $('#rdoNewApplication').prop('checked') ? 3 : 1;
            $('#dpExpiryDate').val(parts[0] + '/' + parts[1] + '/' + (parseInt(parts[2]) + duration));
        }
    });

    function disableNextForms(form) {
        if (form == 1) {
            $('#vehicleDetailsStep, #registrationDetailsStep, ' +
                '#personalDetailsStep, #summaryDetailsStep').addClass('disabled');
            $('#selMobile option[value="2"], #selMobile option[value="3"], ' +
                '#selMobile option[value="4"], #selMobile option[value="5"]').attr('disabled', 'disabled');
        } else if (form == 2) {
            $('#registrationDetailsStep, #personalDetailsStep, ' +
                '#summaryDetailsStep').addClass('disabled');
            $('#selMobile option[value="3"], #selMobile option[value="4"], ' +
                '#selMobile option[value="5"]').attr('disabled', 'disabled');
        } else if (form == 3) {
            $('#personalDetailsStep, #summaryDetailsStep').addClass('disabled');
            $('#selMobile option[value="4"], #selMobile option[value="5"]').attr('disabled', 'disabled');
        } else if (form == 4) {
            $('#summaryDetailsStep').addClass('disabled');
            $('#selMobile option[value="5"]').attr('disabled', 'disabled');
        }
    }

    $('#rdoNewApplication, #rdoRenewal').click(function () {
        $('#dpInceptionDate')
            .val('')
            .datepicker('remove')
            .datepicker({
                autoclose: true
            });
        $('#dpExpiryDate').val('');
        loadMvPremType();
        disableNextForms(1);
    });

    $('#policyDetailsContent select, #policyDetailsContent input').each(function () {
        $(this).change(function () {
            if ($(this).hasClass('required') && $(this).val() == '') {
                disableNextForms(1);
                $(this).addClass('error-field');
            } else {
                $(this).removeClass('error-field');
            }
        });
    });

    $('#btnPolicyDetailsNext').click(function () {
        if (withEmptyRequiredFields()) {
            showMessage('Please fill all the required fields.', 'E');
        } else {
            $('#vehicleDetailsStep').removeClass('disabled');
            $('#selMobile option[value="2"]').removeAttr('disabled');
            $('#selMobile').val('2');
            showContent(2);
        }
    });

    $('#vehicleDetailsContent select, #vehicleDetailsContent input').each(function () {
        $(this).change(function () {
            if ($(this).hasClass('required') && $(this).val() == '') {
                disableNextForms(2);
                $(this).addClass('error-field');
            } else {
                $(this).removeClass('error-field');
            }
        });
    });

    $('#btnVehicleDetailsNext').click(function () {
        if (withEmptyRequiredFields()) {
            showMessage('Please fill all the required fields.', 'E');
        } else {
            $('#registrationDetailsStep').removeClass('disabled');
            $('#selMobile option[value="3"]').removeAttr('disabled');
            $('#selMobile').val('3');
            showContent(3);
        }
    });

    $('#registrationDetailsContent input').each(function () {
        $(this).change(function () {
            if ($(this).hasClass('required') && $(this).val() == '') {
                disableNextForms(3);
                $(this).addClass('error-field');
            } else {
                $(this).removeClass('error-field');
            }
        });
    });

    $('#btnRegistrationDetailsNext').click(function () {
        if (withEmptyRequiredFields()) {
            showMessage('Please fill all the required fields.', 'E');
        } else {
            $('#personalDetailsStep').removeClass('disabled');
            $('#selMobile option[value="4"]').removeAttr('disabled');
            $('#selMobile').val('4');
            showContent(4);
        }
    });

    $('#personalDetailsContent select, #personalDetailsContent input').each(function () {
        $(this).change(function () {
            if ($(this).hasClass('required') && $(this).val() == '') {
                disableNextForms(4);
                $(this).addClass('error-field');
            } else {
                $(this).removeClass('error-field');
            }
        });
    });

    $('#btnPersonalDetailsNext').click(function () {
        if (withEmptyRequiredFields()) {
            showMessage('Please fill all the required fields.', 'E');
        } else {
            $('#summaryDetailsStep').removeClass('disabled');
            $('#selMobile option[value="5"]').removeAttr('disabled');
            $('#selMobile').val('5');
            showNotice('Summarizing your application.<br>Please Wait...');
            setTimeout(function () {
                fillSummaryContent();
                showContent(5);
                hideNotice();
            }, 200);
        }
    });

    $('#selType').change(function () {
        $('#individual-div').hide(400, 'linear');
        $('#cwoa-div').hide(400, 'linear');
        $('#cwa-div').hide(400, 'linear');

        if (this.value == 1) {
            $('#individual-div').show(400, 'linear');
        } else if (this.value == 2) {
            $('#cwoa-div').show(400, 'linear');
        } else {
            $('#cwa-div').show(400, 'linear');
        }

        $('#individual-div input, #cwoa-div input, #cwa-div input').each(function () {
            $(this).val('');
            $(this).removeClass('error-field');
        });

        $('#selGender').val('M');
        disableNextForms(4);
    });

    $('#btnConfirm').click(function () {
        if (withEmptyRequiredFields()) {
            showMessage('Please fill all the required fields.', 'E');
        } else {
            var ctplDetails = {
                'vehicle': {
                    'regType': $('#rdoNewApplication').is(':checked') ? 'N' : 'R',
                    'modelYear': $('#selYearModel').val(),
                    'carCompanyCd': $('#selCarCompany').val(),
                    'makeCd': $('#selMake').val(),
                    'seriesCd': $('#selVariant').val(),
                    'plateNo': $('#txtPlateNo').val(),
                    'serialNo': $('#txtSerialNo').val(),
                    'motorNo': $('#txtEngineNo').val(),
                    'mvFileNo': $('#txtMvFileNo').val(),
                    'mvTypeCd': $('#selMvType').val(),
                    'mvPremTypeCd': $('#selMvPremType').val(),
                    'color': $('#txtColor').val(),
                    'assignee': $('#selType').val() == 3 ? ($('#txtCwaFirstName').val() + ' '
                        + ($('#txtCwaMiddleInitial').val() != '' ? ($('#txtCwaMiddleInitial').val() + ', ')
                            : '')
                        + $('#txtCwaLastName').val())
                        : null
                },
                'policy': {
                    'sublineCd': $('#selPolicyType').val(),
                    'inceptionDate': $('#dpInceptionDate').val(),
                    'expiryDate': $('#dpExpiryDate').val(),
                    'firstName': $('#selType').val() == 1 ? $('#txtIndividualFirstName').val() : null,
                    'lastName': $('#selType').val() == 1 ? $('#txtIndividualLastName').val() : null,
                    'middleInitial': $('#selType').val() == 1 ? $('#txtIndividualMiddleInitial').val() : null,
                    'dob': $('#dpBirthdate').val(),
                    'gender': $('#selType').val() == 1 ? $('#selGender').val() : '',
                    'emailAdd': $('#selType').val() == 1 ? $('#txtIndividualEmailAddress').val()
                        : ($('#selType').val() == 2 ? $('#txtCwoaEmailAddress').val()
                            : $('#txtCwaEmailAddress').val()),
                    'address': $('#selType').val() == 1 ? $('#txtIndividualAddress').val()
                        : ($('#selType').val() == 2 ? $('#txtCwoaAddress').val()
                            : $('#txtCwaAddress').val()),
                    'zipCode': $('#selType').val() == 1 ? $('#txtIndividualZipCode').val()
                        : ($('#selType').val() == 2 ? $('#txtCwoaZipCode').val()
                            : $('#txtCwaZipCode').val()),
                    'phoneNo': $('#selType').val() == 1 ? $('#txtIndividualPhoneNo').val()
                        : ($('#selType').val() == 2 ? $('#txtCwoaPhoneNo').val()
                            : $('#txtCwaPhoneNo').val()),
                    'tinNo': $('#selType').val() == 1 ? $('#txtIndividualTin').val()
                        : ($('#selType').val() == 2 ? $('#txtCwoaTin').val()
                            : $('#txtCwaTin').val()),
                    'corporateTag': $('#selType').val() == 1 ? 'I' : 'C',
                    'corporateName': $('#selType').val() == 2 ? $('#txtCwoaCorporateName').val()
                        : $('#txtCwaCorporateName').val(),
                    'premAmt': $('#tdPremAmount').text().replace(',', ''),
                    'taxAmt': $('#tdTaxAmount').text().replace(',', '')
                }
            };

            var payment = {
                'fname': $('#txtBillFirstName').val(),
                'lname': $('#txtBillLastName').val(),
                'mname': $('#txtBillMiddleName').val(),
                'address': $('#txtBillAddress').val(),
                'city': '',
                'state': '',
                'zip': $('#txtBillZipCode').val(),
                'email': $('#txtBillEmailAddress').val(),
                'phoneNo': $('#txtBillPhoneNo').val(),
                'mobileNo': '',
                'amount': $('#tdTotalAmountDue').text().replace(',', '')
            };

            $.ajax({
                type: 'POST',
                url: ctplUrl + '/save-ectpl',
                data: JSON.stringify(ctplDetails),
                beforeSend: showNotice('Processing your application...'),
                success: function (response) {
                    hideNotice();
                    payment.requestId = response.paymentRequestId;

                    $.ajax({
                        type: 'GET',
                        url: ctplUrl + '/get-payment-request-string',
                        data: payment,
                        beforeSend: showNotice('Processing your application...'),
                        success: function (response) {
                            hideNotice();

                            var ctplBillDtls = {
                                'firstName': $('#txtBillFirstName').val(),
                                'middleName': $('#txtBillMiddleName').val(),
                                'lastName': $('#txtBillLastName').val(),
                                'email': $('#txtBillEmailAddress').val(),
                                'address': $('#txtBillAddress').val(),
                                'phoneNo': $('#txtBillPhoneNo').val(),
                                'zipCd': $('#txtBillZipCode').val()
                            };

                            sessionStorage.setItem('ctplBillDtls', JSON.stringify(ctplBillDtls));

                            $('#paynamics-form input[name="paymentrequest"]').val(response);
                            $('#paynamics-form input[type="submit"]').trigger('click');
                        },
                        error: function (jqXHR) {
                            hideNotice();
                            showMessage('There is an error encountered while processing your application.', 'E');
                        }
                    });
                },
                error: function (jqXHR) {
                    hideNotice();
                    showMessage('There is an error encountered while processing your application.', 'E');
                }
            });
        }
    });
});