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

$(document).ready(function () {
    $('.success, .error, #btnExit').hide();

    $('#btnExit').click(function () {
        window.location.replace("../index.html");
    });

    let reportData = JSON.stringify({
        "policyId": getUrlParameter('requestId').substr(2, 12).replace(/^0+/, '')
    });

    $.ajax({
        type: 'POST',
        url: travelUrl + '/generate-report',
        data: reportData,
        beforeSend: function () {
            $('#process-dtl').html('Processing reports.<br>Please Wait...');
        },
        success: function (response) {
            if (response.errorMessage !== undefined) {
                $('#process-dtl').html('There is an error encountered while generating reports.');
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
});