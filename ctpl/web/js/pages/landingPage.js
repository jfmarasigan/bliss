var ctplUrl = 'https://api.eproductsph.net/ctpl';

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

$(document).ready(function () {
    $('.success, .error, #btnExit').hide();

    $('#btnExit').click(function () {
        window.location.replace("../../index.html");
    });

    let cocData = JSON.stringify({
        "requestId": getUrlParameter('requestId'),
        "responseId": getUrlParameter('responseId')
    });

    $.ajax({
        type: 'POST',
        url: ctplUrl + '/process-cocaf-and-payment',
        data: cocData,
        contentType: 'application/json',
        beforeSend: function () {
            $('#process-dtl').html('Processing COCAF verification and Payment.<br>Please Wait...');
        },
        success: function (response) {
            let reportData = JSON.stringify({
                "policyId": response.policyId,
                "tranId": response.tranId
            });
            if (response.paytStat === 'Approved') {
                $.ajax({
                    type: 'POST',
                    url: ctplUrl + '/generate-report',
                    data: reportData,
                    beforeSend: function () {
                        $('#process-dtl').html('Processing reports.<br>Please Wait...');
                    },
                    success: function (response) {
                        if (response.errorMessage !== undefined) {
                            $('#process-dtl').html(response.cause.errorMessage);
                            $('.progress').hide();
                            $('.error, #btnExit').show();
                        } else {
                            $('#process-dtl').html('Successfully processed your application.<br>Reports are sent to <b>' +
                                JSON.parse(JSON.parse(response).emailResponse.payload).accepted[0] + '</b>');
                            $('.progress').hide();
                            $('.success, #btnExit').show();
                        }
                    },
                    error: function (jqXHR) {
                        $('#process-dtl').html('There is an error encountered while generating reports.');
                        $('.progress').hide();
                        $('.error, #btnExit').show();
                    }
                });
            } else {
                $('#process-dtl').html('A problem has occurred while authenticating your vehicle information and/or settling your payment.');
                $('.progress').hide();
                $('.error, #btnExit').show();
            }
        },
        error: function (jqXHR) {
            $('#process-dtl').html('There is an error encountered while processing COCAF AND Payment.');
            $('.progress').hide();
            $('.error, #btnExit').show();
        }
    });
});