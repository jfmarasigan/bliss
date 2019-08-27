var travelUrl = 'https://api.eproductsph.net/travel';

function showLoginModal() {
    $('.modal-header button').hide();
    $('.modal-title').html('<b>Are you an agent or a client?</b>');

    var loginBody =
        'Kindly select which user are you.' +
        '<div id="loginOptions">' +
            '<div id="btn-agent" class="login-user-option">' +
                '<img src="../images/agent-logo.png" style="height: 70%; width: 70%; margin: 10px 10px 2px 0;">' +
                '<p>AGENT</p>' +
            '</div>' +
            '<div style="width: 2px; background: #000;"></div>' +
            '<div id="btn-user" class="login-user-option">' +
                '<img src="../images/client-logo.png" style="height: 70%; width: 70%; margin: 10px 0 2px;">' +
                '<p>CLIENT</p>' +
            '</div>' +
        '</div>';

    $('.modal-body p').html(loginBody);

    $('#btn-agent').click(function () {
        $('.modal-footer').html(
            '<div style="padding: 2px 0 10px; font-size: 20px; color: #428BCA; font-weight: bold; border-bottom: 2px solid #E5E5E5;">' +
                'Travel Agent Credentials' +
            '</div>' +
            '<div style="display: flex; margin-top: 20px;">' +
                '<img src="../images/agent-login-logo.png" style="width: 20%; margin: 0 5% 0 10%;">' +
                '<div class="form-fields" style="width: 54%;">' +
                    '<input id="txt-agency-code" type="text" class="form-control" placeholder="Enter your Agency Code" style="margin: 20px 0 10px;">' +
                    '<input id="txt-employee-no" type="text" class="form-control" placeholder="Enter your Employee No." style="margin-bottom: 10px;">' +
                '</div>' +
            '</div>' +
            '<div class="form-button">' +
                '<button id="btn-agent-login" style="margin: 0 11% 10px;">LOGIN</button>' +
            '</div>'
        );

        $('#btn-agent-login').unbind().click(function() {
            var wEmptyField = false;

            if ($('#txt-agency-code').val() == '') {
                wEmptyField = true;
                $('#txt-agency-code').addClass('error-field');
            } else {
                $('#txt-agency-code').removeClass('error-field');
            }

            if ($('#txt-employee-no').val() == '') {
                wEmptyField = true;
                $('#txt-employee-no').addClass('error-field');
            } else {
                $('#txt-employee-no').removeClass('error-field');
            }

            if (!wEmptyField) {
                $.ajax({
                    type: 'GET',
                    url: travelUrl + '/get-travel-valid-agency',
                    async: false,
                    data: {
                        agencyCd: $('#txt-agency-code').val()
                    },
                    success: function (response) {
                        if (response == '') {
                            showWaitingMessage('Invalid Agency Code.', 'I',
                                function () {
                                    showLoginModal();
                                    $('.modal-footer').html('');
                                });
                        } else {
                            agencyCd = $('#txt-agency-code').val();
                            empNo = $('#txt-employee-no').val();
                            $('#myModal').modal('hide');
                            $('#travel-dtls').slideToggle('fast');
                        }
                    },
                    error: function (jqXHR) {
                        showWaitingMessage('There is an error encountered while validating Agency Code.', 'E',
                            function () {
                                showLoginModal();
                                $('.modal-footer').html('');
                            });
                    }
                });
            }
        });
    });

    $('#btn-user').click(function () {
        $('#myModal').modal('hide');
        $('#travel-dtls').slideToggle('fast');
        $('.modal-header button').show();
    });

    setTimeout(function () {
        $('#myModal').modal('show');
    }, 300);
}

// PREVENT F12 and CTRL+SHIFT+I
// $(document).keydown(function (event) {
//     if (event.keyCode == 123 || (event.ctrlKey && event.shiftKey && event.keyCode == 73)) {
//         return false;
//     }
// });

// PREVENT MOUSE RIGHT CLICK EVENT
$(document).on("contextmenu", function (e) {
    e.preventDefault();
});

$(document).ready(function () {
    showLoginModal();
});