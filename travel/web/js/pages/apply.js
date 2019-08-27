var travelUrl = 'https://api.eproductsph.net/travel';

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

function showContent(form) {
    if (changeTag == 1 && lastForm != form) {
        if (lastForm == 1) {
            $('#travel-dtls').show('fast');
        } else if (lastForm == 2) {
            if ($('#plan-dtls').is(":hidden")) {
                showForm(2);
            }
        } else if (lastForm == 3) {
            $('#my-dtls').show('fast');
        } else if (lastForm == 4) {
            $('#bill-dtls').show('fast');
        }

        showConfirmMessage('Do you want to save the changes you have made?', 'Yes', 'No',
            function () {
                saveForm(function () {
                    showForm(form);
                });
            }, function () {
                revertChanges();
                showForm(form);
                changeTag = 0;
            });
    } else {
        showForm(form);
    }
}

function saveForm(afterSave) {
    if (withEmptyRequiredFields()) {
        showMessage('Please fill all the required fields.', 'E');
    } else {
        if (changeTag == 0 && (lastForm == 4 && billChangeTag == 0)) {
            showMessage('No changes made.', 'I');
        } else {
            if (lastForm == 1) {
                saveTravelForm();
                fillTravelSummary();

                if (reloadPlan == true) {
                    loadPlanSelection();

                    if (myDtls.user != undefined) {
                        if (travelDtls.planType == 'I') {
                            $('#rdo-passenger-dtl').addClass('disabled');
                            $('.summary-number:contains("3")').css('background', '#4181C2');
                            $('#bill-dtls-btn').removeClass('disabled');
                            $('#rdo-user-dtl').addClass('selected');
                            $('#rdo-passenger-dtl').removeClass('selected');
                            $('#user-form').show();
                            $('#passenger-form').hide();
                        } else {
                            if (travelDtls.planType == 'G') {
                                $('#pass-remaining').hide();
                            }

                            $('#rdo-passenger-dtl').removeClass('disabled');
                            $('.summary-number:contains("3")').css('background', '#FFF');
                        }
                    }

                    $('#pass-limit').html(0);
                    $('.passenger-list-box:not(".add-btn")').remove();
                    relayoutPassengerDiv();
                    $('#my-dtls-passenger-summary').hide();
                    myDtls.psngrArr = [];

                    $('#summary-confirm-dtl').hide();
                    reloadPlan = false;
                }
            } else if (lastForm == 2) {
                savePlanForm();
                fillPlanSummary();

                if ($('#rdo-passenger-dtl').hasClass('disabled') && Object.keys(billDtls).length != 0) {
                    $('#summary-confirm-dtl').show();
                }

                if (travelDtls.planType != 'I') {
                    var newLimit = planDtls.enrolleeLimit - $('.passenger-list-box:not(".add-btn, .empty")').length;

                    if (newLimit >= 0) {
                        $('#pass-delete-count').html(0);
                        $('#pass-count-to-delete').hide();
                        $('#pass-limit').html(newLimit);
                        travelDtls.planType == 'G' ? $('#pass-remaining').hide() : $('#pass-remaining').show();
                    } else {
                        $('#pass-delete-count').html(Math.abs(newLimit));
                        $('#pass-count-to-delete').show();
                        $('#pass-limit').html(0);
                        $('#pass-remaining').hide();
                        $('.passenger-list-box.add-btn').hide();
                        $('#summary-confirm-dtl').hide();
                        $('.summary-number:contains("3")').css('background', '#FFF');
                        redirectToPassengerForm = true;
                    }

                    if (travelDtls.planType === 'G') {
                        recomputePlanAmounts();
                    }
                }
            } else if (lastForm == 3) {
                if (lastSubForm == 1) {
                    saveMyUserForm();
                    fillMyUserSummary();

                    $('#txt-bill-first-name').val(myDtls.user.firstName);
                    $('#txt-bill-middle-initial').val(myDtls.user.middleInitial);
                    $('#txt-bill-last-name').val(myDtls.user.lastName);
                    $('#txt-bill-phone-no').val(myDtls.user.phoneNo);
                    $('#txt-bill-email').val(myDtls.user.email);
                    $('#txt-bill-unit-no').val(myDtls.user.unitNo);
                    $('#txt-bill-street-name').val(myDtls.user.streetName);
                    $('#txt-bill-province').val(myDtls.user.province);
                    $('#txt-bill-province').attr('provinceCd', myDtls.user.provinceCd);

                    loadBillCity(myDtls.user.provinceCd);
                    autocomplete(document.getElementById('txt-bill-city'), billCityList, 'cityCd', 'cityDesc');
                    $('#txt-bill-city').val(myDtls.user.city);
                    $('#txt-bill-city').attr('cityCd', myDtls.user.cityCd);
                    $('#txt-bill-city').attr('disabled', false);

                    loadBillBarangay(myDtls.user.cityCd);
                    autocomplete(document.getElementById('txt-bill-barangay'), billBarangayList, 'brgyCd', 'brgyDesc');
                    $('#txt-bill-barangay').val(myDtls.user.barangay);
                    $('#txt-bill-barangay').attr('brgyCd', myDtls.user.barangayCd);
                    $('#txt-bill-barangay').attr('disabled', false);

                    $('#txt-bill-zip-code').val(myDtls.user.zipCode);
                    billChangeTag = 1;
                } else if (lastSubForm == 2) {
                    saveMyPassengerForm();
                    fillMyPassengerSummary();
                }
            } else if (lastForm == 4) {
                saveBillForm();
                fillBillSummary();
                billChangeTag = 0;
            }

            afterSave();
            changeTag = 0;
        }
    }
}

function revertChanges() {
    $('select, input, textarea').removeClass('error-field');

    if (lastForm == 1) {
        resetTravelForm();
    } else if (lastForm == 2) {
        resetPlanForm();
    } else if (lastForm == 3) {
        if (lastSubForm == 1) {
            resetMyUserForm();
        }
    } else if (lastForm == 4) {
        resetBillForm();
    }
}

function showForm(form, subForm) {
    subForm = subForm || '';

    if (form == 1) {
        if (lastForm != 1) {
            travelPrompt = false;
        }

        $('#travel-dtls').slideToggle('fast');
        $('#plan-dtls, #my-dtls, #bill-dtls').hide('fast');
        lastForm = 1;
    } else if (form == 2) {
        $('#plan-dtls-btn').removeClass('disabled');
        $('#plan-dtls').slideToggle('fast');
        $('#travel-dtls, #my-dtls, #bill-dtls').hide('fast');

        var planBodyMaxHeight = 0;
        $('.plan-body').each(function () {
            if (planBodyMaxHeight < $(this).height()) {
                planBodyMaxHeight = $(this).height();
            }
        });

        if (adjustPlanHeight) {
            $('.plan-body').css('height', planBodyMaxHeight + 60);
            adjustPlanHeight = false;
        }

        setTimeout(function () {
            resCarouselSize();
        }, 300);

        lastForm = 2;
    } else if (form == 3) {
        $('#my-dtls-btn').removeClass('disabled');

        if (!fromForm) {
            $('#my-dtls').slideToggle('fast');
            $('#travel-dtls, #plan-dtls, #bill-dtls').hide('fast');
        }

        if (subForm == 1 || (subForm == '' && lastSubForm == 1)) {
            $('#rdo-user-dtl').addClass('selected');
            $('#user-form').show();
            $('#rdo-passenger-dtl').removeClass('selected');
            $('#passenger-form').hide();
            lastSubForm = 1;
            fromForm = false;
        } else if (subForm == 2) {
            $('#rdo-user-dtl').removeClass('selected');
            $('#user-form').hide();
            $('#rdo-passenger-dtl').removeClass('disabled');
            $('#rdo-passenger-dtl').addClass('selected');
            $('.passenger-logo').removeClass('current');
            $('.passenger-logo').removeClass('selected');
            $('.passenger-list-box').removeClass('delete');
            $('.select-passenger').html('');
            $('.delete-passenger').show();
            $('.update-passenger').show();
            $('#passenger-list-btns').hide();
            $('#passenger-info').hide();
            $('#passenger-form').show();

            if ($('#pass-limit').text() == 0 && $('.passenger-list-box:not(".add-btn, .empty")').length > 0) {
                $('.passenger-list-box.add-btn').hide();
            } else {
                $('.passenger-list-box.add-btn').show();
            }

            relayoutPassengerDiv();
            lastSubForm = 2;
            fromForm = false;
        }

        lastForm = 3;
    } else if (form == 4) {
        $('#bill-dtls-btn').removeClass('disabled');
        $('#bill-dtls').slideToggle('fast');
        $('#travel-dtls, #plan-dtls, #my-dtls').hide('fast');
        lastForm = 4;
    }

    $("html, body").animate({ scrollTop: 0 }, 300);
}

var changeTag = 0;
var billChangeTag = 0;
var fromForm = false;
var lastForm = 1;
var lastSubForm = 1;
var adjustPlanHeight = false;
var reloadPlan = false;
var travelPrompt = false;
var redirectToPassengerForm = false;
var agencyCd = null;
var empNo = null;

var inceptDate = new Date();
inceptDate.setDate(inceptDate.getDate() + 1);

var expiryDate = new Date();
expiryDate.setDate(expiryDate.getDate() + 2);

var passengerDependentFieldsMsg = 'Changing Travel Details information (Trip Type, Plan Type, ' +
    'Destination, Departure Date and Return Date) will reset the Plan Selection and Passenger Details.';

var groupToNonGroup = 'Changing Plan Type from Group to Non-Group will disable Passenger button in ' +
    'My Details and will enable the Bill Information after save.';

var nonGroupToGroupMsg = 'Changing Plan Type from Non-Group to Group will enable Passenger button ' +
    'in My Details and will require you to add atleast one after you select a Plan.';

// TRAVEL DETAILS
$(document).ready(function () {
    $('select, input, textarea').change(function () {
        if ($(this).hasClass('required') && $(this).val() == '') {
            $(this).addClass('error-field');
        } else {
            $(this).removeClass('error-field');
        }

        changeTag = 1;
    });

    initTripTypes();
    initPlanTypes();
    initInceptDate();
    initExpiryDate();

    $('#travel-dtls').hide();

    $('#travel-dtls-btn').click(function () {
        showContent(1);
    });

    $('#sel-plan-type').change(function () {
        if ($(this).val() == '') {
            $('#sel-destination').empty().append($('<option>', {
                value: '',
                text: 'Select Plan Type First',
                selected: true
            }));
        } else {
            if ($('.passenger-list-box:not(".add-btn, .empty")').length > 0 && !travelPrompt) {
                travelPrompt = true;
                showMessage(passengerDependentFieldsMsg, 'I');
            } else if (!$('#rdo-passenger-dtl').hasClass('disabled')
                && $('#bill-dtls-btn').hasClass('disabled')
                && travelDtls.planType != 'I' && $(this).val() == 'I') {
                showMessage(groupToNonGroup, 'I');
            } else if (!$('#bill-dtls-btn').hasClass('disabled')
                && $('#rdo-passenger-dtl').hasClass('disabled')
                && travelDtls.planType == 'I' && $(this).val() != 'I') {
                showMessage(nonGroupToGroupMsg, 'I');
            }

            initDestinations();
        }

        reloadPlan = true;
    });

    $('#sel-destination').change(function () {
        if ($('.passenger-list-box:not(".add-btn, .empty")').length > 0 && !travelPrompt) {
            travelPrompt = true;
            showMessage(passengerDependentFieldsMsg, 'I');
        }

        reloadPlan = true;
    });

    $('#dp-incept-date').change(function () {
        if ($('.trip-type.selected').attr('value').toUpperCase() == 'S') {
            if ($(this).val() == '') {
                initExpiryDate();
            } else {
                var newInceptDate = new Date($('#dp-incept-date').val());

                if ($('.passenger-list-box:not(".add-btn, .empty")').length > 0 && !travelPrompt) {
                    travelPrompt = true;
                    showMessage(passengerDependentFieldsMsg, 'I');
                }

                newInceptDate.setDate(newInceptDate.getDate() + 1)
                $('#dp-expiry-date').data('datepicker').setStartDate(newInceptDate);
            }

            reloadPlan = true;
        } else if ($('.trip-type.selected').attr('value').toUpperCase() == 'A') {
            if ($(this).val() == '') {
                $('#dp-expiry-date').val('');
            } else {
                var parts = $('#dp-incept-date').val().split('/');
                $('#dp-expiry-date').val(parts[0] + '/' + parts[1] + '/' + (parseInt(parts[2]) + 1));
            }
        }
    });

    $('#dp-expiry-date').change(function () {
        if ($(this).val() == '') {
            if ($('#dp-incept-date').val() == '') {
                initInceptDate();
            } else {
                var oldInceptDate = new Date($('#dp-incept-date').val());
                initInceptDate();
                $('#dp-incept-date').datepicker('update', oldInceptDate);
            }
        } else {
            var newExpiryDate = new Date($(this).val());

            if ($('.passenger-list-box:not(".add-btn, .empty")').length > 0 && !travelPrompt) {
                travelPrompt = true;
                showMessage(passengerDependentFieldsMsg, 'I');
            }

            newExpiryDate.setDate(newExpiryDate.getDate() - 1)
            $('#dp-incept-date').data('datepicker').setEndDate(newExpiryDate);
        }

        reloadPlan = true;
    });

    $('#travel-save-btn').click(function () {
        saveForm(function () {
            showForm(2);
        });
    });
});

function initTripTypes() {
    $.ajax({
        type: 'GET',
        url: travelUrl + '/travel-details/get-trip-type',
        async: false,
        success: function (response) {
            var counter = 0;

            $.each(response, function (index, value) {
                counter = counter + 1;

                if (counter == 1) {
                    $('#trip-types-div').append(
                        '<div class="radio-btn trip-type selected" ' +
                        'value="' + value.tripType + '">' + value.tripDesc.toUpperCase() + '</div>'
                    );
                } else {
                    $('#trip-types-div').append(
                        '<div class="radio-btn trip-type" ' +
                        'value="' + value.tripType + '">' + value.tripDesc.toUpperCase() + '</div>'
                    );
                }
            });

            $('.trip-type').click(function () {
                if (!$(this).hasClass('selected')) {
                    if ($('.passenger-list-box:not(".add-btn, .empty")').length > 0 && !travelPrompt) {
                        var thisValue = $(this).attr('value');
                        travelPrompt = true;
                        showWaitingMessage(passengerDependentFieldsMsg, 'I',
                            function () {
                                $('.trip-type').toggleClass('selected');
                                initPlanTypes();

                                if (thisValue.toUpperCase() == 'S') {
                                    setDates(1);
                                } else if (thisValue.toUpperCase() == 'A') {
                                    setDates(2);
                                }
                            });
                    } else {
                        $('.trip-type').toggleClass('selected');
                        initPlanTypes();

                        if ($(this).attr('value').toUpperCase() == 'S') {
                            setDates(1);
                        } else if ($(this).attr('value').toUpperCase() == 'A') {
                            setDates(2);
                        }
                    }

                    changeTag = 1;
                    reloadPlan = true;
                }
            });
        },
        error: function (jqXHR) {
            showMessage('There is an error encountered while getting Trip Types.', 'E');
        }
    });
}

function initPlanTypes() {
    $.ajax({
        type: 'GET',
        url: travelUrl + '/travel-details/get-plan-type',
        async: false,
        data: {
            tripType: $('.trip-type.selected').attr('value')
        },
        beforeSend: function () {
            $('#sel-plan-type').empty().append($('<option>', {
                value: '',
                text: 'FETCHING DATA ...'
            }));
        },
        success: function (response) {
            $('#sel-plan-type').empty().append($('<option>', {
                value: '',
                text: 'SELECT',
                selected: true
            }));

            $.each(response, function (index, value) {
                $('#sel-plan-type').append($('<option>', {
                    value: value.planType,
                    text: value.planDesc.toUpperCase()
                }));
            });

            $('#sel-destination').empty().append($('<option>', {
                value: '',
                text: 'SELECT PLAN TYPE FIRST',
                selected: true
            }));
        },
        error: function (jqXHR) {
            showMessage('There is an error encountered while getting Plan Types.', 'E');
        }
    });
}

function initDestinations() {
    $.ajax({
        type: 'GET',
        url: travelUrl + '/travel-details/get-destination',
        async: false,
        data: {
            tripType: $('.trip-type.selected').attr('value'),
            planType: $('#sel-plan-type').val()
        },
        beforeSend: function () {
            $('#sel-destination').empty().append($('<option>', {
                value: '',
                text: 'FETCHING DATA ...'
            }));
        },
        success: function (response) {
            $('#sel-destination').empty().append($('<option>', {
                value: '',
                text: 'SELECT',
                selected: true
            }));

            $.each(response, function (index, value) {
                $('#sel-destination').append($('<option>', {
                    value: value.destinationValue,
                    text: value.destinationDesc.toUpperCase()
                }));
            });
        },
        error: function (jqXHR) {
            showMessage('There is an error encountered while getting Destinations.', 'E');
        }
    });
}

function initInceptDate() {
    $('#dp-incept-date')
        .val('')
        .datepicker('remove').datepicker({
            autoclose: true,
            startDate: inceptDate
        });
}

function initExpiryDate() {
    $('#dp-expiry-date')
        .val('')
        .datepicker('remove')
        .datepicker({
            autoclose: true,
            startDate: expiryDate
        });
}

function setDates(tripType) {
    initInceptDate();
    initExpiryDate();
    $('#dp-incept-date').addClass('error-field');

    if (tripType == 1) {
        $('#lbl-depart').text('Departure Date *');
        $('#lbl-return').text('Return Date *');
        $('#dp-expiry-date').prop("readonly", false);
        $('#dp-expiry-date').addClass('required');
        $('#dp-expiry-date').addClass('error-field');
    } else if (tripType == 2) {
        $('#lbl-depart').text('Effectivity Date *');
        $('#lbl-return').text('Expiry Date');
        $('#dp-expiry-date').prop("readonly", true);
        $('#dp-expiry-date').removeClass('required');
        $('#dp-expiry-date').removeClass('error-field');
        $('#dp-expiry-date').datepicker('remove');
    }
}

var travelDtls = {};

function saveTravelForm() {
    travelDtls.tripType = $('.trip-type.selected').attr('value');
    travelDtls.tripTypeDesc = $('.trip-type.selected').text();
    travelDtls.planType = $('#sel-plan-type').val();
    travelDtls.planTypeDesc = $("#sel-plan-type option:selected").html();
    travelDtls.destination = $('#sel-destination').val();
    travelDtls.destinationDesc = $("#sel-destination option:selected").html();
    travelDtls.inceptDate = $('#dp-incept-date').val();
    travelDtls.expiryDate = $('#dp-expiry-date').val();
    travelDtls.itinerary = $('#txt-itinerary').val();
}

function fillTravelSummary() {
    $('.summary-number:contains("1")').css('background', '#4181C2');
    $('#travel-dtls-summary').html(
        travelDtls.tripTypeDesc + ' | ' + travelDtls.planTypeDesc + ' PLAN<br>' +
        'DESTINATION: ' + travelDtls.destinationDesc + '<br>' +
        'PERIOD OF COVERAGE: ' + travelDtls.inceptDate + ' to ' + travelDtls.expiryDate
    );
}

function resetTravelForm() {
    $('#dp-incept-date').val(travelDtls.inceptDate);
    $('#dp-incept-date').datepicker('update', travelDtls.inceptDate);
    $('#dp-expiry-date').val(travelDtls.expiryDate);
    $('#dp-expiry-date').datepicker('update', travelDtls.expiryDate);
    $('#txt-itinerary').val(travelDtls.itinerary);

    $('.trip-type').each(function () {
        $(this).removeClass('selected');
        if ($(this).attr('value') == travelDtls.tripType) {
            $(this).addClass('selected');

            initPlanTypes();
            $('#sel-plan-type').val(travelDtls.planType);

            initDestinations();
            $('#sel-destination').val(travelDtls.destination);

            if ($(this).attr('value').toUpperCase() == 'S') {
                $('#lbl-depart').text('Departure Date *');
                $('#lbl-return').text('Return Date *');
                $('#dp-expiry-date').prop("readonly", false);
            } else {
                $('#lbl-depart').text('Effectivity Date *');
                $('#lbl-return').text('Expiry Date');
                $('#dp-expiry-date').prop("readonly", true);
                $('#dp-expiry-date').datepicker('remove');
            }
        }
    });
}

// PLAN SELECTION
$(document).ready(function () {
    $('#plan-dtls').hide();

    $('#plan-dtls-btn').click(function () {
        if (!$(this).hasClass('disabled')) {
            showContent(2);
        }
    });

    $('#txt-promo-code').keyup(function () {
        $(this).val($(this).val().toUpperCase());
    });

    $('#plan-save-btn').click(function () {
        if ($('.plan.selected').length > 0) {
            if ($('#txt-promo-code').val() == '') {
                $('#txt-promo-code').attr('promo-name', '');
                $('#txt-promo-code').attr('promo-type', '');
                $('#txt-promo-code').attr('discount-rate', '');
                $('#txt-promo-code').attr('discount-amt', '');

                saveForm(function () {
                    redirectToPassengerForm ? showForm(3, 2) : showForm(3, 1);
                    redirectToPassengerForm = false;
                });
            } else {
                if (validPromoCode()) {
                    saveForm(function () {
                        redirectToPassengerForm ? showForm(3, 2) : showForm(3, 1);
                        redirectToPassengerForm = false;
                    });
                } else {
                    $('#txt-promo-code').val('');
                    showMessage('Invalid Promo Code.', 'I');
                }
            }
        } else {
            showMessage('Please choose a plan first.', 'I');
        }
    });
});

function recomputePlanAmounts() {
    planDtls.premAmt = planDtls.planPremAmt * (myDtls.psngrArr.length + 1);
    planDtls.totalPrem = parseFloat(planDtls.premAmt);

    $.ajax({
        type: 'GET',
        url: travelUrl + '/plan-selection/get-travel-taxes',
        async: false,
        success: function (response) {
            $.each(response, function (rIndex, value) {
                $.each(planDtls.taxes, function (pIndex, tax) {
                    if (value.taxCd == tax.taxCd && value.taxType.toUpperCase() == 'R') {
                        planDtls.taxes[pIndex].taxAmount = (planDtls.premAmt * value.taxRate) / 100;
                        planDtls.totalPrem += planDtls.taxes[pIndex].taxAmount;
                    } else if (value.taxCd != 3 && value.taxCd == tax.taxCd && value.taxType.toUpperCase() == 'A') {
                        planDtls.taxes[pIndex].taxAmount = value.taxAmount * (myDtls.psngrArr.length + 1);
                        planDtls.totalPrem += planDtls.taxes[pIndex].taxAmount;
                    } else if (value.taxCd == 3 && value.taxCd == tax.taxCd) {
                        planDtls.totalPrem += value.taxAmount;
                    }
                });
            });
        }
    });

    if (planDtls.promoType.toUpperCase() == 'R') {
        planDtls.discountRateAmt = (planDtls.premAmt * parseFloat(planDtls.discountRate)) / 100;
        planDtls.totalPrem = planDtls.totalPrem - planDtls.discountRateAmt;
    } else if (planDtls.promoType.toUpperCase() == 'A') {
        planDtls.totalPrem = planDtls.totalPrem - parseFloat(planDtls.discountAmt);
    }

    fillPlanSummary();
}

function loadPlanSelection() {
    $.ajax({
        type: 'GET',
        url: travelUrl + '/plan-selection/get-travel-plans',
        async: false,
        data: {
            tripType: travelDtls.tripType,
            planType: travelDtls.planType,
            destination: travelDtls.destination,
            startDate: travelDtls.inceptDate,
            endDate: travelDtls.expiryDate
        },
        success: function (response) {
            $('#plan-choices').html('');

            $.each(response, function (index, plan) {
                var planDiv = '<div class="item">' +
                    '<div class="plan">' +
                    '<div class="plan-header">' +
                    '<input class="plan-code" type="hidden" value="' + plan.planCd + '">' +
                    '<input class="plan-no" type="hidden" value="' + plan.planNo + '">' +
                    '<input class="plan-desc" type="hidden" value="' + plan.planDesc + '">' +
                    '<input class="plan-dtl" type="hidden" value="' + plan.planDtl + '">' +
                    '<input class="plan-prem-amt" type="hidden" value="' + plan.premAmt + '">' +
                    '<input class="plan-limit-of-enrollee" type="hidden" value="' + (plan.allowableNoOfEnrollee - 1) + '">' +
                    '<div class="plan-taxes">';

                $.each(plan.taxes, function (index, tax) {
                    planDiv += '<input class="plan-tax-cd" type="hidden" value="' + tax.taxCd + '">' +
                        '<input class="plan-tax-desc" type="hidden" value="' + tax.taxDesc.toUpperCase() + '">' +
                        '<input class="plan-tax-amount" type="hidden" value="' + tax.amount + '">';
                });

                planDiv += '</div>' +
                    '<div class="plan-title">' + plan.planDesc + '</div>' +
                    '<div class="plan-amount">&#8369; ' + formatCurrency(plan.premAmt) + '</div>' +
                    '</div>' +
                    '<div class="plan-body">';

                var counter = 0;
                $.each(plan.perils, function (index, peril) {
                    counter += 1;

                    if (counter <= 4) {
                        if (counter > 1) {
                            planDiv += '<div class="plan-separator"></div>';
                        }

                        planDiv += '<div class="plan-desc">' +
                            '<div class="plan-desc-title">' + formatText(peril.perilName) + '</div>' +
                            '<div class="plan-amount">' + formatCurrency(peril.tsiAmt) + '</div>' +
                            '</div>';
                    } else {
                        planDiv += '<div class="plan-desc hidden">' +
                            '<div class="plan-desc-title">' + formatText(peril.perilName) + '</div>' +
                            '<div class="plan-amount">' + formatCurrency(peril.tsiAmt) + '</div>' +
                            '</div>';
                    }
                });

                planDiv += '<div class="plan-buttons">' +
                    '<div class="plan-see-more">View More</div>' +
                    '<div class="plan-choose"></div>' +
                    '</div></div></div></div>';

                $('#plan-choices').append(planDiv);
            });

            $('.plan-see-more').unbind().click(function () {
                var planTitle = $(this).parents('.plan-body').siblings('.plan-header').children('.plan-title').text();
                var planAmount = $(this).parents('.plan-body').siblings('.plan-header').children('.plan-amount').text();
                var messType = planTitle + ' - ' + planAmount;
                var messBody = $(this).parents('.plan-body').siblings('.plan-header').children('.plan-dtl').val().replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br>$2');

                showMessage(messBody, messType);
            });

            $('.plan-choose').unbind().click(function () {
                if (!$(this).parents('.plan').hasClass('selected')) {
                    var passengerCount = $('.passenger-list-box:not(".add-btn, .empty")').length;
                    var planLimit = $(this).parents('.plan').find('.plan-header .plan-limit-of-enrollee').val();

                    if (passengerCount > planLimit) {
                        var planDesc = $(this).parents('.plan').find('.plan-header .plan-desc').val();
                        var passengerCountDifference = passengerCount - planLimit;

                        showMessage(planDesc + ' Plan has ' + planLimit + ' passenger limit ' +
                            'which is less than to your current passenger count. Saving this plan will ' +
                            'redirect you to My Details (Passenger Form) to delete ' +
                            passengerCountDifference + ' of your passenger(s).', 'I');
                    }

                    $('.plan').removeClass('selected');
                    $('.plan-choose').html('');
                    $(this).parents('.plan').addClass('selected');
                    $(this).html('<i class="fa fa-check"></i>');
                    changeTag = 1;
                }
            });

            $('#txt-promo-code').val('');
            $('.summary-number:contains("2")').css('background', '#FFF');
            $('#plan-dtls-summary').html('- No details yet');
            adjustPlanHeight = true;
            planDtls = {};
        },
        error: function (jqXHR) {
            showMessage('There is an error encountered while getting Plans.', 'E');
        }
    });
}

function validPromoCode() {
    var valid = false;

    $.ajax({
        type: 'GET',
        url: travelUrl + '/plan-selection/get-travel-valid-promo',
        async: false,
        data: {
            planCd: $('.plan.selected .plan-header .plan-code').val(),
            planNo: $('.plan.selected .plan-header .plan-no').val(),
            promoCode: $('#txt-promo-code').val()
        },
        success: function (response) {
            $.each(response, function (index, value) {
                valid = true;
                $('#txt-promo-code')
                    .attr('promo-name', value.promoName)
                    .attr('promo-type', value.promoType)
                    .attr('discount-rate', value.discountRate)
                    .attr('discount-amt', value.discountAmt);
            });
        },
        error: function (jqXHR) {
            showMessage('There is an error encountered while validating Promo Code.', 'E');
        }
    });

    return valid;
}

var planDtls = {};

function savePlanForm() {
    planDtls.planCd = $('.plan.selected .plan-header .plan-code').val();
    planDtls.planNo = $('.plan.selected .plan-header .plan-no').val();
    planDtls.enrolleeLimit = $('.plan.selected .plan-header .plan-limit-of-enrollee').val();

    planDtls.packageDesc = $('.plan.selected .plan-header .plan-desc').val();
    planDtls.planPremAmt = $('.plan.selected .plan-header .plan-prem-amt').val();   // FOR RECOMPUTATION
    planDtls.premAmt = $('.plan.selected .plan-header .plan-prem-amt').val();
    planDtls.totalPrem = parseFloat(planDtls.premAmt);

    planDtls.taxes = [];
    planDtls.tax = {};

    $('.plan.selected .plan-header .plan-taxes .plan-tax-cd, ' +
        '.plan.selected .plan-header .plan-taxes .plan-tax-desc, ' +
        '.plan.selected .plan-header .plan-taxes .plan-tax-amount').each(function () {
            if ($(this).hasClass('plan-tax-cd')) {
                planDtls.tax.taxCd = $(this).val();
            } else if ($(this).hasClass('plan-tax-desc')) {
                planDtls.tax.taxDesc = $(this).val();
            } else if ($(this).hasClass('plan-tax-amount')) {
                planDtls.tax.taxAmount = parseFloat($(this).val()).toFixed(2);
                planDtls.totalPrem += parseFloat(planDtls.tax.taxAmount);
                planDtls.taxes.push(planDtls.tax);
                planDtls.tax = {};
            }
        });

    planDtls.promoCd = $('#txt-promo-code').val();
    planDtls.promoName = $('#txt-promo-code').attr('promo-name');
    planDtls.promoType = $('#txt-promo-code').attr('promo-type');
    planDtls.discountRate = $('#txt-promo-code').attr('discount-rate') || 0;
    planDtls.discountAmt = $('#txt-promo-code').attr('discount-amt') || 0;

    if (planDtls.promoType.toUpperCase() == 'R') {
        planDtls.discountRateAmt = (planDtls.premAmt * parseFloat(planDtls.discountRate)) / 100;
        planDtls.totalPrem = planDtls.totalPrem - planDtls.discountRateAmt;
    } else if (planDtls.promoType.toUpperCase() == 'A') {
        planDtls.totalPrem = planDtls.totalPrem - parseFloat(planDtls.discountAmt);
    }

    planDtls.totalPrem = parseFloat(planDtls.totalPrem).toFixed(2);
}

function fillPlanSummary() {
    var taxes = '';

    $.each(planDtls.taxes, function (index, tax) {
        taxes += tax.taxDesc + ': &#8369; ' + formatCurrency(tax.taxAmount) + '<br>';
    });

    var promoCode = '';

    if (planDtls.promoCd != '') {
        promoCode = 'PROMO NAME: ' + planDtls.promoName.toUpperCase() + '<br>PROMO DISCOUNT: &#8369; ';

        if (planDtls.promoType.toUpperCase() == 'R') {
            promoCode += formatCurrency(planDtls.discountRateAmt) + '<br>';
        } else if (planDtls.promoType.toUpperCase() == 'A') {
            promoCode += formatCurrency(planDtls.discountAmt) + '<br>';
        }
    }

    $('.summary-number:contains("2")').css('background', '#4181C2');
    $('#plan-dtls-summary').html(
        'PACKAGE: ' + planDtls.packageDesc + '<br>' +
        'TOTAL PREMIUM: <b>&#8369; ' + formatCurrency(planDtls.totalPrem) + '</b><br>' +
        'NET PREMIUM: &#8369; ' + formatCurrency(planDtls.premAmt) + '<br>' + promoCode + taxes
    );
}

function resetPlanForm() {
    if (Object.keys(planDtls).length == 0) {
        $('.plan').removeClass('selected');
        $('.plan-choose').html('');
        $('#txt-promo-code').val('');
    } else {
        $('.plan').removeClass('selected');
        $('.plan-choose').html('');

        $('.plan').each(function () {
            if ($(this).find('.plan-code').val() == planDtls.planCd && $(this).find('.plan-no').val() == planDtls.planNo) {
                $(this).addClass('selected');
                $(this).find('.plan-choose').html('<i class="fa fa-check"></i>');
            }
        });

        $('#txt-promo-code').val(planDtls.promoCd);
    }
}

// MY DETAILS
$(document).ready(function () {
    $('#my-dtls').hide();

    $('#my-dtls-btn').click(function () {
        if (!$(this).hasClass('disabled')) {
            showContent(3);
        }
    });

    $('#rdo-user-dtl').click(function () {
        if (!$(this).hasClass('selected')) {
            if (changeTag == 0) {
                fromForm = true;
                showForm(3, 1);
            } else {
                showConfirmMessage('Do you want to save the changes you have made?', 'Yes', 'No',
                    function () {
                        saveForm(function () {
                            fromForm = true;
                            showForm(3, 1);
                        });
                    }, function () {
                        fromForm = true;
                        showForm(3, 1);
                        changeTag = 0;
                    });
            }
        }
    });

    $('#rdo-passenger-dtl').click(function () {
        if (!$(this).hasClass('selected') && !$(this).hasClass('disabled')) {
            fromForm = true;
            showForm(3, 2);
        }
    });
});

// MY DETAILS (USER)
$(document).ready(function () {
    loadProvince();
    autocomplete(document.getElementById('txt-user-province'), provinceList, 'provinceCd', 'provinceDesc');
    loadNationality();

    $('#dp-user-birthdate').datepicker({
        autoclose: true,
        endDate: new Date()
    });

    $('#rdo-user-male, #rdo-user-female').click(function () {
        if (!$(this).hasClass('selected')) {
            $('#rdo-user-male, #rdo-user-female').toggleClass('selected');
        }
    });

    var prevProvince;
    $('#txt-user-province').change(function () {
        var found = false;
        $.each(provinceList, function (index, value) {
            if ($('#txt-user-province').val().toUpperCase() === value.provinceDesc.toUpperCase()) {
                found = true;

                if (prevProvince !== value.provinceDesc.toUpperCase()) {
                    $('#txt-user-province').val(value.provinceDesc);
                    $('#txt-user-province').attr('provinceCd', value.provinceCd);
                    $('#txt-user-city').attr('disabled', false);
                    $('#txt-user-city').addClass('required');
                    loadUserCity(value.provinceCd);
                    autocomplete(document.getElementById('txt-user-city'), userCityList, 'cityCd', 'cityDesc');
                    prevProvince = value.provinceDesc.toUpperCase();
                }
            }
        });

        if (!found) {
            $('#txt-user-city, #txt-user-barangay').attr('disabled', true);
            $('#txt-user-city, #txt-user-barangay').removeClass('required');
            $('#txt-user-province').val('');
            prevProvince = '';
        }

        $('#txt-user-city, #txt-user-barangay, #txt-user-zip-code').val('');
        $('#txt-user-city, #txt-user-barangay').removeClass('error-field');
    });

    var prevCity;
    $('#txt-user-city').change(function () {
        var found = false;
        $.each(userCityList, function (index, value) {
            if ($('#txt-user-city').val().toUpperCase() == value.cityDesc.toUpperCase()) {
                found = true;

                if (prevCity !== value.cityDesc.toUpperCase()) {
                    $('#txt-user-city').val(value.cityDesc);
                    $('#txt-user-city').attr('cityCd', value.cityCd);
                    $('#txt-user-barangay').attr('disabled', false);
                    $('#txt-user-barangay').addClass('required');
                    loadUserBarangay(value.cityCd);
                    autocomplete(document.getElementById('txt-user-barangay'), userBarangayList, 'brgyCd', 'brgyDesc');
                    prevCity = value.cityDesc.toUpperCase();
                }
            }
        });

        if (!found) {
            $('#txt-user-barangay').attr('disabled', true);
            $('#txt-user-barangay').removeClass('required');
            $('#txt-user-city').val('');
            prevCity = '';
        }

        $('#txt-user-barangay, #txt-user-zip-code').val('');
        $('#txt-user-barangay').removeClass('error-field');
    });

    $('#txt-user-barangay').change(function () {
        var found = false;
        $.each(userBarangayList, function (index, value) {
            if ($('#txt-user-barangay').val().toUpperCase() == value.brgyDesc.toUpperCase()) {
                $('#txt-user-barangay').val(value.brgyDesc);
                $('#txt-user-barangay').attr('brgyCd', value.brgyCd);
                $('#txt-user-zip-code').val(value.zipCd);
                found = true;
            }
        });

        if (!found) {
            $('#txt-user-barangay, #txt-user-zip-code').val('');
        }
    });

    $('#user-dtls-save-btn').click(function () {
        if ($('#txt-user-beneficiary').val() != '' && $('#txt-user-beneficiary-phone-no').val() == '') {
            showMessage("Please Enter Beneficiary's Phone No.", 'I');
        } else if ($('#txt-user-beneficiary').val() == '' && $('#txt-user-beneficiary-phone-no').val() != '') {
            showMessage("Please Enter Beneficiary's Name.", 'I');
        } else {
            saveForm(function () {
                if (travelDtls.planType == 'I') {
                    $('.summary-number:contains("3")').css('background', '#4181C2');
                    changeTag = 1;
                    showForm(4);
                } else {
                    fromForm = true;
                    showForm(3, 2);
                }
            });
        }
    });
});

var provinceList;

function loadProvince(provinceCd, term) {
    $.ajax({
        type: 'GET',
        url: travelUrl + '/user-details/get-province',
        async: false,
        data: {
            provinceCd: provinceCd,
            term: term
        },
        success: function (response) {
            $.each(response, function (index, value) {
                response[index].provinceDesc = value.provinceDesc.toUpperCase();
            });

            provinceList = response;
        }
    });
}

var userCityList;

function loadUserCity(provinceCd, term) {
    $.ajax({
        type: 'GET',
        url: travelUrl + '/user-details/get-city',
        async: false,
        data: {
            provinceCd: provinceCd,
            term: term
        },
        success: function (response) {
            $.each(response, function (index, value) {
                response[index].cityDesc = value.cityDesc.toUpperCase();
            });

            userCityList = response;
        }
    });
}

var userBarangayList;

function loadUserBarangay(cityCd, term) {
    $.ajax({
        type: 'GET',
        url: travelUrl + '/user-details/get-barangay',
        async: false,
        data: {
            cityCd: cityCd,
            term: term
        },
        success: function (response) {
            $.each(response, function (index, value) {
                response[index].brgyDesc = value.brgyDesc.toUpperCase();
            });

            userBarangayList = response;
        }
    });
}

function loadNationality() {
    $.ajax({
        type: 'GET',
        url: travelUrl + '/user-details/get-nationality',
        async: false,
        success: function (response) {
            $('#sel-user-nationality, #sel-psngr-nationality').empty().append($('<option>', {
                value: '',
                text: 'SELECT',
                selected: true
            }));

            $.each(response, function (index, value) {
                $('#sel-user-nationality, #sel-psngr-nationality').append($('<option>', {
                    value: value.nationalityCode,
                    text: value.nationalityDesc.toUpperCase()
                }));
            });
        },
        error: function (jqXHR) {
            showMessage('There is an error encountered while getting Nationality.', 'E');
        }
    });
}

var myDtls = {};

function saveMyUserForm() {
    myDtls.user = {};

    myDtls.user.firstName = $('#txt-user-first-name').val();
    myDtls.user.middleInitial = $('#txt-user-middle-initial').val();
    myDtls.user.lastName = $('#txt-user-last-name').val();
    myDtls.user.birthdate = $('#dp-user-birthdate').val();

    if ($('#rdo-user-male').hasClass('selected')) {
        myDtls.user.gender = 'M';
    } else {
        myDtls.user.gender = 'F';
    }

    myDtls.user.nationality = $('#sel-user-nationality').val();
    myDtls.user.nationalityDesc = $("#sel-user-nationality option:selected").html();
    myDtls.user.tin = $('#txt-tin').val();
    myDtls.user.phoneNo = $('#txt-user-phone-no').val();
    myDtls.user.email = $('#txt-user-email').val();
    myDtls.user.unitNo = $('#txt-user-unit-no').val();
    myDtls.user.streetName = $('#txt-user-street-name').val();
    myDtls.user.province = $('#txt-user-province').val();
    myDtls.user.provinceCd = $('#txt-user-province').attr('provinceCd');
    myDtls.user.city = $('#txt-user-city').val();
    myDtls.user.cityCd = $('#txt-user-city').attr('cityCd');
    myDtls.user.barangay = $('#txt-user-barangay').val();
    myDtls.user.barangayCd = $('#txt-user-barangay').attr('brgyCd');
    myDtls.user.zipCode = $('#txt-user-zip-code').val();
    myDtls.user.beneficiary = $('#txt-user-beneficiary').val();
    myDtls.user.beneficiaryPhoneNo = $('#txt-user-beneficiary-phone-no').val();
}

function fillMyUserSummary() {
    var firstName = myDtls.user.firstName + ' ';
    var middleInitial = myDtls.user.middleInitial == '' ? '' : myDtls.user.middleInitial + '. ';
    var lastName = myDtls.user.lastName;

    var fullName = firstName + middleInitial + lastName;
    var birthdate = myDtls.user.birthdate;
    var gender = myDtls.user.gender == 'M' ? 'MALE' : 'FEMALE';
    var nationality = myDtls.user.nationalityDesc;
    var phoneNo = myDtls.user.phoneNo;
    var email = myDtls.user.email;
    var tin = myDtls.user.tin;

    var unitNo = myDtls.user.unitNo;
    var streetName = myDtls.user.streetName;
    var barangay = myDtls.user.barangay;
    var city = myDtls.user.city;
    var province = myDtls.user.province;
    var zipCode = myDtls.user.zipCode;

    var beneficiary = myDtls.user.beneficiary;
    var beneficiaryPhoneNo = myDtls.user.beneficiaryPhoneNo;

    $('#my-dtls-user-summary').html(
        fullName + '<br>' +
        birthdate + ' | ' + gender + ' | ' + nationality + '<br>' +
        phoneNo + ' | ' + email + '<br>' +
        'TIN: ' + tin + '<br><br>' +

        "INSURED'S ADDRESS:<br>" +
        unitNo + ', ' + streetName + '<br>' +
        barangay + ', ' + city + '<br>' +
        province + ', ' + zipCode +

        (beneficiary == '' ? '' : '<br><br>' + 'BENEFICIARY:<br>' + beneficiary +
            (beneficiaryPhoneNo == '' ? '' : ' | ' + beneficiaryPhoneNo))
    );
}

function resetMyUserForm() {
    if (myDtls.user == undefined) {
        $('#txt-user-first-name').val('');
        $('#txt-user-middle-initial').val('');
        $('#txt-user-last-name').val('');
        $('#dp-user-birthdate').val('');
        $('#dp-user-birthdate').datepicker('remove');
        $('#dp-user-birthdate').datepicker({
            autoclose: true,
            endDate: new Date()
        });
        $('#rdo-user-male').addClass('selected');
        $('#rdo-user-female').removeClass('selected');
        $('#sel-user-nationality').val('');
        $('#txt-tin').val('');
        $('#txt-user-phone-no').val('');
        $('#txt-user-email').val('');
        $('#txt-user-unit-no').val('');
        $('#txt-user-street-name').val('');
        $('#txt-user-province').val('');
        $('#txt-user-province').attr('provinceCd', '');
        $('#txt-user-city').val('');
        $('#txt-user-city').attr('cityCd', '');
        $('#txt-user-city').attr('disabled', true);
        $('#txt-user-barangay').val('');
        $('#txt-user-barangay').attr('brgyCd', '');
        $('#txt-user-barangay').attr('disabled', true);
        $('#txt-user-zip-code').val('');
        $('#txt-user-beneficiary').val('');
        $('#txt-user-beneficiary-phone-no').val('');
    } else {
        $('#txt-user-first-name').val(myDtls.user.firstName);
        $('#txt-user-middle-initial').val(myDtls.user.middleInitial);
        $('#txt-user-last-name').val(myDtls.user.lastName);
        $('#dp-user-birthdate').val(myDtls.user.birthdate);
        $('#dp-user-birthdate').datepicker('update', myDtls.user.birthdate);

        if (myDtls.user.gender == 'M') {
            $('#rdo-user-male').addClass('selected');
            $('#rdo-user-female').removeClass('selected');
        } else {
            $('#rdo-user-male').removeClass('selected');
            $('#rdo-user-female').addClass('selected');
        }

        $('#sel-user-nationality').val(myDtls.user.nationality);
        $('#txt-tin').val(myDtls.user.tin);
        $('#txt-user-phone-no').val(myDtls.user.phoneNo);
        $('#txt-user-email').val(myDtls.user.email);
        $('#txt-user-unit-no').val(myDtls.user.unitNo);
        $('#txt-user-street-name').val(myDtls.user.streetName);
        $('#txt-user-province').val(myDtls.user.province);
        $('#txt-user-province').attr('provinceCd', myDtls.user.provinceCd);

        loadUserCity(myDtls.user.provinceCd);
        autocomplete(document.getElementById('txt-user-city'), userCityList, 'cityCd', 'cityDesc');
        $('#txt-user-city').val(myDtls.user.city);
        $('#txt-user-city').attr('cityCd', myDtls.user.cityCd);
        $('#txt-user-city').attr('disabled', false);

        loadUserBarangay(myDtls.user.cityCd);
        autocomplete(document.getElementById('txt-user-barangay'), userBarangayList, 'brgyCd', 'brgyDesc');
        $('#txt-user-barangay').val(myDtls.user.barangay);
        $('#txt-user-barangay').attr('brgyCd', myDtls.user.barangayCd);
        $('#txt-user-barangay').attr('disabled', false);

        $('#txt-user-zip-code').val(myDtls.user.zipCode);
        $('#txt-user-beneficiary').val(myDtls.user.beneficiary);
        $('#txt-user-beneficiary-phone-no').val(myDtls.user.beneficiaryPhoneNo);
    }
}

// MY DETAILS (PASSENGER)
$(document).ready(function () {
    $(window).resize(function () {
        relayoutPassengerDiv();
    });

    $('#pass-count-to-delete').hide();
    $('#passenger-list-btns').hide();

    $('#add-passenger').click(function () {
        if ($('#pass-limit').text() == 0) {
            if (Object.keys(planDtls).length == 0) {
                showMessage('Please choose a plan first.', 'I');
            }
        } else {
            var firstPassenger = $('.passenger-list-box:not(".add-btn"):first-child .passenger-name');

            if (firstPassenger.length > 0 && firstPassenger.text() == '') {
                showMessage('You are not allowed to add another passenger. New passenger exists.', 'I');
            } else {
                if (changeTag == 0) {
                    addPassenger();
                } else {
                    showConfirmMessage('Do you want to save the changes you have made?', 'Yes', 'No',
                        function () {
                            saveForm(function () {
                                addPassenger();
                            });

                            changeTag = 1;
                        }, addPassenger);
                }
            }
        }
    });

    $('#rdo-select-all').click(function () {
        $('.passenger-list-box:not(".add-btn, .empty")').addClass('delete');
        $('.passenger-list-box:not(".add-btn") .passenger-logo').addClass('selected');
        $('.select-passenger').html('<i class="fa fa-check"></i>');
    });

    $('#rdo-deselect-all').click(function () {
        $('.passenger-list-box').removeClass('delete');
        $('.passenger-logo').removeClass('selected');
        $('.select-passenger').html('');
        $('.delete-passenger').show();
        $('.update-passenger').show();
        $('#passenger-list-btns').hide();
        $('.passenger-list-box.add-btn').show();

        if ($('#pass-limit').text() == 0) {
            $('.passenger-list-box.add-btn').hide();
        }

        relayoutPassengerDiv();
    });

    $('#rdo-delete').click(function () {
        var message;

        if (($('.passenger-logo').length - 1) == $('.delete').length) {
            if ($('#confirm-btn').is(":hidden")) {
                message = 'Are you sure you want delete all the passengers?';
            } else {
                message = 'Deleting all the passengers will remove the confirm button in Summary. You are required to add atleast 1 passenger. Proceed?';
            }
        } else {
            message = 'Are you sure you want delete all the selected passengers?';
        }

        showConfirmMessage(message, 'Yes', 'No',
            function () {
                $('#pass-limit').html(parseInt($('#pass-limit').text()) + $('.delete').length);
                $('.delete').remove();
                $('.passenger-list-box.add-btn').show();
                $('#passenger-list-btns').hide();
                relayoutPassengerDiv();
                saveAllPassengerToJson();
                fillMyPassengerSummary();
            }, '');
    });

    $('#rdo-psngr-male').click(function () {
        $(this).addClass('selected');
        $('#rdo-psngr-female').removeClass('selected');
        $('.passenger-logo.current img').attr('src', '../images/male-logo.png');
    });

    $('#rdo-psngr-female').click(function () {
        $(this).addClass('selected');
        $('#rdo-psngr-male').removeClass('selected');
        $('.passenger-logo.current img').attr('src', '../images/female-logo.png');
    });

    $('#passenger-dtls-save-btn').click(function () {
        if ($('#txt-psngr-beneficiary').val() != '' && $('#txt-psngr-beneficiary-phone-no').val() == '') {
            showMessage("Please Enter Beneficiary's Phone No.", 'I');
        } else if ($('#txt-psngr-beneficiary').val() == '' && $('#txt-psngr-beneficiary-phone-no').val() != '') {
            showMessage("Please Enter Beneficiary's Name.", 'I');
        } else {
            saveForm(function () {
                if ($('#bill-dtls-btn').hasClass('disabled')) {
                    showConfirmMessage('Billing Information is now enabled.', 'Proceed to Billing', 'Add More Passenger',
                        function () {
                            showForm(4);
                        }, '');

                    $('#bill-dtls-btn').removeClass('disabled');
                } else {
                    showMessage('Successfully Saved.', 'S');
                }
            });
        }
    });
});

function addPassenger() {
    $('#pass-limit').html($('#pass-limit').text() - 1);

    if ($('#pass-limit').text() == 0) {
        $('.passenger-list-box.add-btn').hide();
    }

    $('.passenger-logo').removeClass('current');

    $('#passenger-list').prepend(
        '<div class="passenger-list-box">' +
        '<div class="passenger-logo current">' +
        '<img src="../images/male-logo.png">' +
        '<div class="select-passenger" title="Select"></div>' +
        '<div class="update-passenger" title="Update Profile"><i class="fa fa-pencil"></i></div>' +
        '<div class="delete-passenger" title="Delete Profile"><i class="fa fa-trash"></i></div>' +
        '<div class="passenger-dtls">' +
        '<input type="hidden" class="first-name">' +
        '<input type="hidden" class="middle-initial">' +
        '<input type="hidden" class="last-name">' +
        '<input type="hidden" class="birthdate">' +
        '<input type="hidden" class="gender" value="M">' +
        '<input type="hidden" class="nationality" value="">' +
        '<input type="hidden" class="nationalityDesc" value="">' +
        '<input type="hidden" class="beneficiary">' +
        '<input type="hidden" class="beneficiary-phone-no">' +
        '</div>' +
        '</div>' +
        '<div class="passenger-name"></div>' +
        '</div>'
    );

    addSelectAction();
    addUpdateAction();
    addDeleteAction();

    relayoutPassengerDiv();
    resetPassengerFields();
    $('#passenger-info').show();
    $('.passenger-logo.current .update-passenger').hide();
    $('.passenger-logo:not(.current) .update-passenger').show();
    changeTag = 1;
}

function addSelectAction() {
    var withSelectedDiv = false;

    $('.select-passenger').unbind().click(function () {
        $('.passenger-logo').removeClass('current');
        $(this).parent().toggleClass('selected');
        $(this).parents('.passenger-list-box').toggleClass('delete');

        if ($(this).parent().hasClass('selected')) {
            $(this).html('<i class="fa fa-check"></i>');
        } else {
            $(this).html('');
        }

        withSelectedDiv = false;
        if ($('.passenger-logo.selected').length > 0) {
            withSelectedDiv = true;
        }

        if (withSelectedDiv) {
            $('.delete-passenger').hide();
            $('.update-passenger').hide();
            $('#passenger-list-btns').show();
            $('.passenger-list-box.add-btn').hide();
        } else {
            $('.delete-passenger').show();
            $('.update-passenger').show();
            $('#passenger-list-btns').hide();
            $('.passenger-list-box.add-btn').show();

            if ($('#pass-limit').text() == 0) {
                $('.passenger-list-box.add-btn').hide();
            }
        }

        relayoutPassengerDiv();
        $('#passenger-info').hide();
        changeTag = 0;
    });
}

function showPassengerInfo(e) {
    $('.passenger-logo').removeClass('current');
    e.parent().addClass('current');
    $('#passenger-info').show();


    e.siblings('.passenger-dtls').children('input').each(function () {
        if ($(this).attr('class') == 'first-name') {
            $('#txt-psngr-first-name').val($(this).val());
        } else if ($(this).attr('class') == 'middle-initial') {
            $('#txt-psngr-middle-initial').val($(this).val());
        } else if ($(this).attr('class') == 'last-name') {
            $('#txt-psngr-last-name').val($(this).val());
        } else if ($(this).attr('class') == 'birthdate') {
            $('#dp-psngr-birthdate')
                .val($(this).val())
                .datepicker('remove')
                .datepicker({
                    autoclose: true,
                    endDate: new Date()
                });

            if ($(this).val() != '') {
                $('#dp-psngr-birthdate').datepicker('update', $(this).val());
            }
        } else if ($(this).attr('class') == 'gender') {
            $('#rdo-psngr-male').removeClass('selected');
            $('#rdo-psngr-female').removeClass('selected');

            if ($(this).val() == 'M') {
                $('#rdo-psngr-male').addClass('selected');
            } else {
                $('#rdo-psngr-female').addClass('selected');
            }
        } else if ($(this).attr('class') == 'nationality') {
            $('#sel-psngr-nationality').val($(this).val());
        } else if ($(this).attr('class') == 'beneficiary') {
            $('#txt-psngr-beneficiary').val($(this).val());
        } else if ($(this).attr('class') == 'beneficiary-phone-no') {
            $('#txt-psngr-beneficiary-phone-no').val($(this).val());
        }
    });
}

function addUpdateAction() {
    $('.update-passenger').unbind().click(function () {
        var thisElement = $(this);

        if (changeTag == 0) {
            showPassengerInfo(thisElement);
            $('.passenger-logo.current .update-passenger').hide();
            $('.passenger-logo:not(.current) .update-passenger').show();
            $('select, input, textarea').removeClass('error-field');
            changeTag = 0;
        } else {
            showConfirmMessage('Do you want to save the changes you have made?', 'Yes', 'No',
                function () {
                    saveForm(function () {
                        showPassengerInfo(thisElement);
                        $('.passenger-logo.current .update-passenger').hide();
                        $('.passenger-logo:not(.current) .update-passenger').show();
                    });
                }, function () {
                    showPassengerInfo(thisElement);
                    $('.passenger-logo.current .update-passenger').hide();
                    $('.passenger-logo:not(.current) .update-passenger').show();
                    $('select, input, textarea').removeClass('error-field');
                    changeTag = 0;
                });
        }
    });
}

function addDeleteAction() {
    $('.delete-passenger').unbind().click(function () {
        var firstName = $(this).parent().find('.passenger-dtls input.first-name').val();
        var middleInitial = $(this).parent().find('.passenger-dtls input.middle-initial').val();
        var lastName = $(this).parent().find('.passenger-dtls input.last-name').val();
        var fullName = firstName + ' ' + (middleInitial != '' ? middleInitial + '. ' : '') + lastName;
        var birthdate = $(this).parent().find('.passenger-dtls input.birthdate').val();
        var gender;

        if ($(this).parent().find('.passenger-dtls input.gender').val() == 'M') {
            gender = 'MALE';
        } else {
            gender = 'FEMALE';
        }

        var nationality = $(this).parent().find('.passenger-dtls input.nationalityDesc').val();
        var beneficiary = $(this).parent().find('.passenger-dtls input.beneficiary').val();

        var message;
        if (firstName == '') {
            message = 'Are you sure you want to delete this new passenger?';
        } else {
            message = 'Are you sure you want to delete this passenger?<br><br>' +
                '<b>Name:</b> ' + fullName + '<br>' +
                '<b>Date of Birth:</b> ' + birthdate + '<br>' +
                '<b>Gender:</b> ' + gender + '<br>' +
                '<b>Nationality:</b> ' + nationality + '<br>' +
                '<b>Beneficiary:</b> ' + (beneficiary == '' ? 'No Beneficiary' : beneficiary);
        }

        $(this).parents('.passenger-list-box').addClass('this-delete');

        var thisDivLogo = $(this).parents('.passenger-list-box').find('.passenger-logo');
        showConfirmMessage(message, 'Yes', 'No',
            function () {
                if ($('#pass-delete-count').is(":visible")) {
                    $('#pass-delete-count').html(parseInt($('#pass-delete-count').text()) - 1);
                } else {
                    $('#pass-limit').html(parseInt($('#pass-limit').text()) + 1);
                }

                if ($('#pass-limit').text() > 0) {
                    $('.passenger-list-box.add-btn').show();
                }

                if ($('#pass-delete-count').text() == 0) {
                    travelDtls.planType == 'G' ? $('#pass-remaining').hide() : $('#pass-remaining').show();
                    $('#pass-count-to-delete').hide();
                }

                if (thisDivLogo.hasClass('current')) {
                    $('#passenger-info').hide();
                    changeTag = 0;
                }

                $('.this-delete').remove();
                relayoutPassengerDiv();
                saveAllPassengerToJson();
                fillMyPassengerSummary();
            }, function () {
                $('.this-delete').removeClass('this-delete');
            });
    });
}

function resetPassengerFields() {
    $('select, input').removeClass('error-field');
    $('#txt-psngr-first-name').val('');
    $('#txt-psngr-middle-initial').val('');
    $('#txt-psngr-last-name').val('');
    $('#dp-psngr-birthdate')
        .val('')
        .datepicker('remove')
        .datepicker({
            autoclose: true,
            endDate: new Date()
        });
    $('#rdo-psngr-male').addClass('selected');
    $('#rdo-psngr-female').removeClass('selected');
    $('#sel-psngr-nationality').val('');
    $('#txt-psngr-beneficiary').val('');
    $('#txt-psngr-beneficiary-phone-no').val('');
}

function relayoutPassengerDiv() {
    $('.passenger-list-box.empty').remove();

    var flexSize = $('.passenger-list-box').css('flex-basis').replace('%', '');

    if (!$('.passenger-list-box:first-child').hasClass('add-btn')) {
        while (($('.passenger-list-box.add-btn').is(":hidden") ?
            $("#passenger-list > div").length - 1 :
            $("#passenger-list > div").length) % parseInt(100 / flexSize) != 0) {
            $('#passenger-list').append('<div class="passenger-list-box empty"></div>');
        }
    } else {
        $('#passenger-info').hide();
    }
}

function saveCurrentPassenger() {
    $('.passenger-logo.current .first-name').val($('#txt-psngr-first-name').val());
    $('.passenger-logo.current .middle-initial').val($('#txt-psngr-middle-initial').val());
    $('.passenger-logo.current .last-name').val($('#txt-psngr-last-name').val());
    $('.passenger-logo.current .birthdate').val($('#dp-psngr-birthdate').val());

    if ($('#rdo-psngr-male').hasClass('selected')) {
        $('.passenger-logo.current .gender').val('M');
    } else {
        $('.passenger-logo.current .gender').val('F');
    }

    $('.passenger-logo.current .nationality').val($('#sel-psngr-nationality').val());
    $('.passenger-logo.current .nationalityDesc').val($('#sel-psngr-nationality option:selected').html());
    $('.passenger-logo.current .beneficiary').val($('#txt-psngr-beneficiary').val());
    $('.passenger-logo.current .beneficiary-phone-no').val($('#txt-psngr-beneficiary-phone-no').val());

    $('.passenger-logo.current')
        .siblings('.passenger-name')
        .html($('.passenger-logo.current .first-name').val());
}

function saveAllPassengerToJson() {
    myDtls.psngrArr = [];
    myDtls.psngrJson = {};

    var counter = 0;

    $('.passenger-logo .first-name, ' +
        '.passenger-logo .middle-initial, ' +
        '.passenger-logo .last-name, ' +
        '.passenger-logo .birthdate, ' +
        '.passenger-logo .gender, ' +
        '.passenger-logo .nationality, ' +
        '.passenger-logo .nationalityDesc, ' +
        '.passenger-logo .beneficiary, ' +
        '.passenger-logo .beneficiary-phone-no').each(function () {
            if ($(this).hasClass('first-name') && $(this).val() == '') {
                counter = 1;
            } else if ($(this).hasClass('beneficiary') && counter == 1) {
                counter = 0;
            } else if (counter == 0) {
                if ($(this).hasClass('first-name')) {
                    myDtls.psngrJson.firstName = $(this).val();
                } else if ($(this).hasClass('middle-initial')) {
                    myDtls.psngrJson.middleInitial = $(this).val();
                } else if ($(this).hasClass('last-name')) {
                    myDtls.psngrJson.lastName = $(this).val();
                } else if ($(this).hasClass('birthdate')) {
                    myDtls.psngrJson.birthdate = $(this).val();
                } else if ($(this).hasClass('gender')) {
                    myDtls.psngrJson.gender = $(this).val();
                } else if ($(this).hasClass('nationality')) {
                    myDtls.psngrJson.nationality = $(this).val();
                } else if ($(this).hasClass('nationalityDesc')) {
                    myDtls.psngrJson.nationalityDesc = $(this).val();
                } else if ($(this).hasClass('beneficiary')) {
                    myDtls.psngrJson.beneficiary = $(this).val();
                } else if ($(this).hasClass('beneficiary-phone-no')) {
                    myDtls.psngrJson.beneficiaryPhoneNo = $(this).val();
                    myDtls.psngrArr.push(myDtls.psngrJson);
                    myDtls.psngrJson = {};
                }
            }
        });

    if (travelDtls.planType == 'G') {
        recomputePlanAmounts();
    }
}

function saveMyPassengerForm() {
    saveCurrentPassenger();
    saveAllPassengerToJson();
}

function fillMyPassengerSummary() {
    $('#my-dtls-passenger-summary').show();
    $('#my-dtls-passenger-summary-info').html('');

    if (myDtls.psngrArr.length == 0) {
        $('.summary-number:contains("3")').css('background', '#FFF');
        $('#my-dtls-passenger-summary').hide();
        $('#summary-confirm-dtl').hide();
    } else if ($('#pass-delete-count').text() == 0) {
        $('.summary-number:contains("3")').css('background', '#4181C2');
        $('#my-dtls-passenger-summary').show();

        if (Object.keys(billDtls).length != 0) {
            $('#summary-confirm-dtl').show();
        }
    }

    for (var i = 0; i < myDtls.psngrArr.length; i++) {
        if (i > 0) {
            $('#my-dtls-passenger-summary-info').append('<br><br><div class="form-separator"></div>');
        }

        var firstName = myDtls.psngrArr[i].firstName + ' ';
        var middleInitial = myDtls.psngrArr[i].middleInitial == '' ? '' : myDtls.psngrArr[i].middleInitial + '. ';
        var lastName = myDtls.psngrArr[i].lastName;

        var fullName = firstName + middleInitial + lastName;
        var birthdate = myDtls.psngrArr[i].birthdate;
        var gender = myDtls.psngrArr[i].gender == 'M' ? 'MALE' : 'FEMALE';
        var nationality = myDtls.psngrArr[i].nationalityDesc;
        var beneficiary = myDtls.psngrArr[i].beneficiary;
        var beneficiaryPhoneNo = myDtls.psngrArr[i].beneficiaryPhoneNo;

        $('#my-dtls-passenger-summary-info').append(
            fullName + '<br>' +
            birthdate + ' | ' + gender + ' | ' + nationality +
            (beneficiary == '' ? '' : '<br><br>' + 'BENEFICIARY:<br>' + beneficiary +
                (beneficiaryPhoneNo == '' ? '' : ' | ' + beneficiaryPhoneNo))
        );

        if (i == myDtls.psngrArr.length - 1) {
            $('#my-dtls-passenger-summary-info').append('<br>');
        }
    }
}

// BILL INFORMATION
$(document).ready(function () {
    autocomplete(document.getElementById('txt-bill-province'), provinceList, 'provinceCd', 'provinceDesc');

    $('#bill-dtls').hide();

    $('#bill-dtls-btn').click(function () {
        if (!$(this).hasClass('disabled')) {
            showContent(4);
        }
    });

    $('#txt-bill-province').change(function () {
        var found = false;
        $.each(provinceList, function (index, value) {
            if ($('#txt-bill-province').val().toUpperCase() == value.provinceDesc.toUpperCase()) {
                $('#txt-bill-province').val(value.provinceDesc);
                $('#txt-bill-province').attr('provinceCd', value.provinceCd);
                $('#txt-bill-city').attr('disabled', false);
                $('#txt-bill-city').addClass('required');
                loadBillCity(value.provinceCd);
                autocomplete(document.getElementById('txt-bill-city'), billCityList, 'cityCd', 'cityDesc');
                found = true;
            }
        });

        if (!found) {
            $('#txt-bill-city, #txt-bill-barangay').attr('disabled', true);
            $('#txt-bill-city, #txt-bill-barangay').removeClass('required');
            $('#txt-bill-province').val('');
        }

        $('#txt-bill-city, #txt-bill-barangay, #txt-bill-zip-code').val('');
        $('#txt-bill-city, #txt-bill-barangay').removeClass('error-field');
    });

    $('#txt-bill-city').change(function () {
        var found = false;
        $.each(billCityList, function (index, value) {
            if ($('#txt-bill-city').val().toUpperCase() == value.cityDesc.toUpperCase()) {
                $('#txt-bill-city').val(value.cityDesc);
                $('#txt-bill-city').attr('cityCd', value.cityCd);
                $('#txt-bill-barangay').attr('disabled', false);
                $('#txt-bill-barangay').addClass('required');
                loadBillBarangay(value.cityCd);
                autocomplete(document.getElementById('txt-bill-barangay'), billBarangayList, 'brgyCd', 'brgyDesc');
                found = true;
            }
        });

        if (!found) {
            $('#txt-bill-barangay').attr('disabled', true);
            $('#txt-bill-barangay').removeClass('required');
            $('#txt-bill-city').val('');
        }

        $('#txt-bill-barangay, #txt-bill-zip-code').val('');
        $('#txt-bill-barangay').removeClass('error-field');
    });

    $('#txt-bill-barangay').change(function () {
        var found = false;
        $.each(billBarangayList, function (index, value) {
            if ($('#txt-bill-barangay').val().toUpperCase() == value.brgyDesc.toUpperCase()) {
                $('#txt-bill-barangay').val(value.brgyDesc);
                $('#txt-bill-barangay').attr('brgyCd', value.brgyCd);
                $('#txt-bill-zip-code').val(value.zipCd);
                found = true;
            }
        });

        if (!found) {
            $('#txt-bill-barangay, #txt-bill-zip-code').val('');
        }
    });

    $('#bill-save-btn').click(function () {
        saveForm(function () {
            if (Object.keys(planDtls).length != 0
                && $('#rdo-passenger-dtl').hasClass('disabled')
                || (!$('#rdo-passenger-dtl').hasClass('disabled')
                    && $('.passenger-list-box:not(".add-btn, .empty")').length > 0)) {
                $('#summary-confirm-dtl').show();
                $("html, body").animate({ scrollTop: $(document).height() - $(window).height() });
            }
        });
    });
});

var billCityList;

function loadBillCity(provinceCd, term) {
    $.ajax({
        type: 'GET',
        url: travelUrl + '/user-details/get-city',
        async: false,
        data: {
            provinceCd: provinceCd,
            term: term
        },
        success: function (response) {
            $.each(response, function (index, value) {
                response[index].cityDesc = value.cityDesc.toUpperCase();
            });

            billCityList = response;
        }
    });
}

var billBarangayList;

function loadBillBarangay(cityCd, term) {
    $.ajax({
        type: 'GET',
        url: travelUrl + '/user-details/get-barangay',
        async: false,
        data: {
            cityCd: cityCd,
            term: term
        },
        success: function (response) {
            $.each(response, function (index, value) {
                response[index].brgyDesc = value.brgyDesc.toUpperCase();
            });

            billBarangayList = response;
        }
    });
}

var billDtls = {};

function saveBillForm() {
    billDtls.firstName = $('#txt-bill-first-name').val();
    billDtls.middleInitial = $('#txt-bill-middle-initial').val();
    billDtls.lastName = $('#txt-bill-last-name').val();
    billDtls.phoneNo = $('#txt-bill-phone-no').val();
    billDtls.email = $('#txt-bill-email').val();
    billDtls.unitNo = $('#txt-bill-unit-no').val();
    billDtls.streetName = $('#txt-bill-street-name').val();
    billDtls.province = $('#txt-bill-province').val();
    billDtls.provinceCd = $('#txt-bill-province').attr('provinceCd');
    billDtls.city = $('#txt-bill-city').val();
    billDtls.cityCd = $('#txt-bill-city').attr('cityCd');
    billDtls.barangay = $('#txt-bill-barangay').val();
    billDtls.barangayCd = $('#txt-bill-barangay').attr('brgyCd');
    billDtls.zipCode = $('#txt-bill-zip-code').val();
}

function fillBillSummary() {
    var firstName = billDtls.firstName.toUpperCase() + ' ';
    var middleInitial = billDtls.middleInitial == '' ? '' : billDtls.middleInitial.toUpperCase() + '. ';
    var lastName = billDtls.lastName.toUpperCase();

    var fullName = firstName + middleInitial + lastName;
    var phoneNo = billDtls.phoneNo;
    var email = billDtls.email;

    var unitNo = billDtls.unitNo;
    var streetName = billDtls.streetName;
    var barangay = billDtls.barangay;
    var city = billDtls.city;
    var province = billDtls.province;
    var zipCode = billDtls.zipCode;

    $('.summary-number:contains("4")').css('background', '#4181C2');
    $('#bill-dtls-summary').html(
        fullName + '<br>' +
        phoneNo + ' | ' + email + '<br><br>' +

        unitNo + ', ' + streetName + '<br>' +
        barangay + ', ' + city + '<br>' +
        province + ', ' + zipCode + '<br><br>'
    );
}

function resetBillForm() {
    if (Object.keys(billDtls).length == 0) {
        $('#txt-bill-first-name').val(myDtls.user.firstName);
        $('#txt-bill-middle-initial').val(myDtls.user.middleInitial);
        $('#txt-bill-last-name').val(myDtls.user.lastName);

        $('#txt-bill-phone-no').val(myDtls.user.phoneNo);
        $('#txt-bill-email').val(myDtls.user.email);
        $('#txt-bill-unit-no').val(myDtls.user.unitNo);
        $('#txt-bill-street-name').val(myDtls.user.streetName);
        $('#txt-bill-province').val(myDtls.user.province);
        $('#txt-bill-province').attr('provinceCd', myDtls.user.provinceCd);

        loadBillCity(myDtls.user.provinceCd);
        $('#txt-bill-city').val(myDtls.user.city);
        $('#txt-bill-city').attr('cityCd', myDtls.user.cityCd);
        $('#txt-bill-city').attr('disabled', false);

        loadBillBarangay(myDtls.user.cityCd);
        $('#txt-bill-barangay').val(myDtls.user.barangay);
        $('#txt-bill-barangay').attr('brgyCd', myDtls.user.barangayCd);
        $('#txt-bill-barangay').attr('disabled', false);

        $('#txt-bill-zip-code').val(myDtls.user.zipCode);
    } else {
        $('#txt-bill-first-name').val(billDtls.firstName);
        $('#txt-bill-middle-initial').val(billDtls.middleInitial);
        $('#txt-bill-last-name').val(billDtls.lastName);
        $('#txt-bill-phone-no').val(billDtls.phoneNo);
        $('#txt-bill-email').val(billDtls.email);
        $('#txt-bill-unit-no').val(billDtls.unitNo);
        $('#txt-bill-street-name').val(billDtls.streetName);
        $('#txt-bill-province').val(billDtls.province);
        $('#txt-bill-province').attr('provinceCd', billDtls.provinceCd);

        loadBillCity(billDtls.provinceCd);
        $('#txt-bill-city').val(billDtls.city);
        $('#txt-bill-city').attr('cityCd', billDtls.cityCd);
        $('#txt-bill-city').attr('disabled', false);

        loadBillBarangay(billDtls.cityCd);
        $('#txt-bill-barangay').val(billDtls.barangay);
        $('#txt-bill-barangay').attr('brgyCd', billDtls.barangayCd);
        $('#txt-bill-barangay').attr('disabled', false);

        $('#txt-bill-zip-code').val(billDtls.zipCode);
    }

    autocomplete(document.getElementById('txt-bill-city'), billCityList, 'cityCd', 'cityDesc');
    autocomplete(document.getElementById('txt-bill-barangay'), billBarangayList, 'brgyCd', 'brgyDesc');
}

// SUMMARY
$(document).ready(function () {
    $('#my-dtls-passenger-summary').hide();
    $('#summary-confirm-dtl').hide();

    $('#confirm-btn').click(function () {
        showNotice('Processing your application...');
        setTimeout(function () {
            try {
                var policy = {
                    'inceptionDate': travelDtls.inceptDate,
                    'expiryDate': travelDtls.expiryDate,
                    'firstName': myDtls.user.firstName,
                    'lastName': myDtls.user.lastName,
                    'middleInitial': myDtls.user.middleInitial,
                    'dob': myDtls.user.birthdate,
                    'gender': myDtls.user.gender,
                    'emailAdd': myDtls.user.email,
                    'houseNo': myDtls.user.unitNo,
                    'streetName': myDtls.user.streetName,
                    'provinceCd': myDtls.user.provinceCd,
                    'cityCd': myDtls.user.cityCd,
                    'brgyCd': myDtls.user.barangayCd,
                    'zipCd': myDtls.user.zipCode,
                    'phoneNo': myDtls.user.phoneNo,
                    'tinNo': myDtls.user.tin,
                    'nationality': myDtls.user.nationality,
                    'noOfPersons': myDtls.psngrArr.length + 1,
                    'itineraryDtl': travelDtls.itinerary,
                    'planCd': planDtls.planCd,
                    'planNo': planDtls.planNo,
                    'promoCd': planDtls.promoCd,
                    'premAmt': parseFloat(planDtls.premAmt),
                    'taxAmt': parseFloat(planDtls.totalPrem) - parseFloat(planDtls.premAmt),
                    'agencyCd': agencyCd,
                    'empNo': empNo
                };

                var enrollee = [];
                enrollee[0] = {
                    'firstName': myDtls.user.firstName,
                    'lastName': myDtls.user.lastName,
                    'middleInitial': myDtls.user.middleInitial,
                    'dob': myDtls.user.birthdate,
                    'gender': myDtls.user.gender,
                    'nationality': myDtls.user.nationality,
                    'beneficiaryName': myDtls.user.beneficiary,
                    'beneficiaryPhoneNo': myDtls.user.beneficiaryPhoneNo
                };

                $.each(myDtls.psngrArr, function (index, value) {
                    enrollee[index + 1] = {};
                    enrollee[index + 1].firstName = value.firstName;
                    enrollee[index + 1].lastName = value.lastName;
                    enrollee[index + 1].middleInitial = value.middleInitial;
                    enrollee[index + 1].dob = value.birthdate;
                    enrollee[index + 1].gender = value.gender;
                    enrollee[index + 1].nationality = value.nationality;
                    enrollee[index + 1].beneficiaryName = value.beneficiary;
                    enrollee[index + 1].beneficiaryPhoneNo = value.beneficiaryPhoneNo;
                });

                var ctplDetails = {};
                ctplDetails.policy = policy;
                ctplDetails.enrollees = enrollee;

                var payment = {
                    'fname': $('#txt-bill-first-name').val(),
                    'lname': $('#txt-bill-last-name').val(),
                    'mname': $('#txt-bill-middle-initial').val(),
                    'address': $('#txt-bill-unit-no').val() + ', ' +
                        $('#txt-bill-street-name').val() + ', ' +
                        $('#txt-bill-province').val() + ', ' +
                        $('#txt-bill-city').val() + ', ' +
                        $('#txt-bill-barangay').val() + ', ' +
                        $('#txt-bill-zip-code').val(),
                    'city': $('#txt-bill-city').val(),
                    'state': '',
                    'zip': $('#txt-bill-zip-code').val(),
                    'email': $('#txt-bill-email').val(),
                    'phoneNo': $('#txt-bill-phone-no').val(),
                    'mobileNo': '',
                    'amount': planDtls.totalPrem
                };

                $.ajax({
                    type: 'POST',
                    url: travelUrl + '/save-travel',
                    async: false,
                    data: JSON.stringify(ctplDetails),
                    success: function (response) {
                        payment.requestId = response.paymentRequestId;

                        $.ajax({
                            type: 'GET',
                            url: travelUrl + '/create-payment-request',
                            data: payment,
                            success: function (response) {
                                var travelBillDtls = {
                                    'firstName': $('#txt-bill-first-name').val(),
                                    'middleInitial': $('#txt-bill-middle-initial').val(),
                                    'lastName': $('#txt-bill-last-name').val(),
                                    'phoneNo': $('#txt-bill-phone-no').val(),
                                    'email': $('#txt-bill-email').val(),
                                    'houseNo': $('#txt-bill-unit-no').val(),
                                    'streetName': $('#txt-bill-street-name').val(),
                                    'province': $('#txt-bill-province').val(),
                                    'city': $('#txt-bill-city').val(),
                                    'barangay': $('#txt-bill-barangay').val()
                                };

                                sessionStorage.setItem('travelBillDtls', JSON.stringify(travelBillDtls));

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
                        showMessage('There is an error encountered while saving your application.', 'E');
                    }
                });
            } catch (e) {
                hideNotice();
                showMessage('There is an error encountered.', 'E');
            }
        }, 200);
    });
});

$(document).ready(function () {
    if (getUrlParameter('requestId') != undefined) {
        retrieveFormData();
    }

    function retrieveFormData() {
        var policyId = getUrlParameter('requestId').substr(3, 11).replace(/^0+/, '');

        $.ajax({
            type: 'GET',
            url: travelUrl + '/get-policy-details?policyId=' + policyId,
            beforeSend: showNotice('Retrieving your data. Please wait...'),
            success: function (response) {
                login(response);
            },
            error: function (jqXHR) {
                hideNotice();
                showMessage('There is an error encountered while retrieving your data.', 'E');
            }
        });
    }

    async function timeout(ms) {
        return new Promise(resolve => {
            setTimeout(resolve, ms);
        });
    }

    function login(response) {
        if (response.agencyCd !== null) {
            $('#btn-agent').trigger('click');
            $('#txt-agency-code').val(response.agencyCd);
            $('#txt-employee-no').val(response.empNo);
            $('#btn-agent-login').trigger('click');
        } else {
            $('#btn-user').trigger('click');
        }

        retrieveTravelDtls(response);
    }

    async function retrieveTravelDtls(response) {
        $('.trip-type').each(function() {
            if ($(this).attr('value') === response.tripType) {
                $(this).trigger('click');
                return false;
            }
        });

        $('#sel-plan-type').val(response.planType).trigger('change');
        await timeout(500);

        $('#sel-destination').val(response.destination)
        $('#dp-incept-date').val(response.inceptDate)
            .datepicker('update', response.inceptDate).trigger('change');

        if (response.tripType === 'S') {
            $('#dp-expiry-date').val(response.expiryDate)
                .datepicker('update', response.expiryDate);
        }

        $('#txt-itinerary').val(response.itinerary);
        $('#travel-save-btn').trigger('click');
        await timeout(500);

        retrievePlanDtls(response);
    }

    function retrievePlanDtls(response) {
        $('.plan').each(function() {
            if (   $(this).find('.plan-code').val() === response.planCd.toString()
                && $(this).find('.plan-no').val() === response.planNo.toString()) {
                $(this).find('.plan-choose').trigger('click');
                return false;
            }
        });

        $('#txt-promo-code').val(response.promoCd);
        $('#plan-save-btn').trigger('click');
        retrieveMyDtls(response);
    }

    async function retrieveMyDtls(response) {
        $('#txt-user-first-name').val(response.firstName);
        $('#txt-user-middle-initial').val(response.middleInitial);
        $('#txt-user-last-name').val(response.lastName);
        $('#dp-user-birthdate').val(response.birthDate).datepicker('update', response.birthDate);
        response.gender === 'M' ? $('#rdo-user-male').trigger('click') : $('#rdo-user-female').trigger('click');
        $('#sel-user-nationality').val(response.nationality);
        $('#txt-tin').val(response.tinNo);
        $('#txt-user-phone-no').val(response.phoneNo);
        $('#txt-user-email').val(response.email);
        $('#txt-user-unit-no').val(response.houseNo);
        $('#txt-user-street-name').val(response.streetName);
        $('#txt-user-province').val(response.province).trigger('change');
        await timeout(500);

        $('#txt-user-city').val(response.city).trigger('change');
        await timeout(500);

        $('#txt-user-barangay').val(response.barangay).trigger('change');
        $('#txt-user-beneficiary').val(response.beneficiaryName);
        $('#txt-user-beneficiary-phone-no').val(response.beneficiaryPhoneNo);
        $('#user-dtls-save-btn').trigger('click');

        if (response.planType !== 'I') {
            retrievePassengerDtls(response);
        } else {
            retrieveBillingDtls();
        }
    }

    async function retrievePassengerDtls(response) {
        var checkProceedToBilling = true;

        for (var i = response.passengers.length - 1; i >= 0; i--) {
            $('#add-passenger').trigger('click');
            $('#txt-psngr-first-name').val(response.passengers[i].firstName);
            $('#txt-psngr-middle-initial').val(response.passengers[i].middleInitial);
            $('#txt-psngr-last-name').val(response.passengers[i].lastName);
            $('#dp-psngr-birthdate').val(response.passengers[i].birthDate).datepicker('update', response.passengers[i].birthDate);
            response.passengers[i].gender === 'M' ? $('#rdo-psngr-male').trigger('click') : $('#rdo-psngr-female').trigger('click');
            $('#sel-psngr-nationality').val(response.passengers[i].nationality);
            $('#txt-psngr-beneficiary').val(response.passengers[i].beneficiaryName);
            $('#txt-psngr-beneficiary-phone-no').val(response.passengers[i].beneficiaryPhoneNo);
            $('#passenger-dtls-save-btn').trigger('click');
            await timeout(500);

            if (checkProceedToBilling) {
                if (response.passengers.length === 1) {
                    $('#btn1').trigger('click');
                } else {
                    $('#btn2').trigger('click');
                }

                checkProceedToBilling = false;
            } else {
                $('.modal-footer button').trigger('click');

                if (i === 0) {
                    $('#bill-dtls-btn').trigger('click');
                    retrieveBillingDtls();
                }
            }
        }
    }

    async function retrieveBillingDtls() {
        var sBillDtls = JSON.parse(sessionStorage.getItem('travelBillDtls'));

        if (sBillDtls !== null) {
            $('#txt-bill-first-name').val(sBillDtls.firstName);
            $('#txt-bill-middle-initial').val(sBillDtls.middleInitial);
            $('#txt-bill-last-name').val(sBillDtls.lastName);
            $('#txt-bill-phone-no').val(sBillDtls.phoneNo);
            $('#txt-bill-email').val(sBillDtls.email);
            $('#txt-bill-unit-no').val(sBillDtls.houseNo);
            $('#txt-bill-street-name').val(sBillDtls.streetName);

            $('#txt-bill-province').val(sBillDtls.province).trigger('change');
            await timeout(500);

            $('#txt-bill-city').val(sBillDtls.city).trigger('change');
            await timeout(500);

            $('#txt-bill-barangay').val(sBillDtls.barangay).trigger('change');
            $('#bill-save-btn').trigger('click');
            sessionStorage.removeItem('travelBillDtls');
            hideNotice();
        } else {
            $('#bill-save-btn').trigger('click');
            hideNotice();
        }
    }
});