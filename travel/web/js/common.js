$(window).on('scroll', function () {
    if ($(window).scrollTop()) {
        $('nav, #goToTop').addClass('scroll');
    } else {
        $('nav, #goToTop').removeClass('scroll');
    }
});

new WOW().init();

function formatCurrency(num) {
    return parseFloat(num).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
}

function showConfirmMessage(message, btn1Label, btn2Label, btn1Func, btn2Func) {
    $('.modal-title').html('Confirmation Message');
    $('.modal-body p').html(message);
    $('.modal-footer').html(
        '<button id="btn1" type="button" class="btn btn-default">' + btn1Label + '</button>' +
        '<button id="btn2" type="button" class="btn btn-default">' + btn2Label + '</button>'
    );

    $('#btn1').click(function () {
        $('#myModal').modal('hide');

        setTimeout(function () {
            btn1Func();
        }, 300);
    });

    if (btn2Func == '') {
        $('#btn2').click(function () {
            $('#myModal').modal('hide');
        });
    } else {
        $('#btn2').click(function () {
            $('#myModal').modal('hide');

            setTimeout(function () {
                btn2Func();
            }, 300);
        });
    }

    setTimeout(function () {
        $('#myModal').modal('show');
    }, 300);
}

function showWaitingMessage(message, messageType, func) {
    var messType;

    messageType = messageType || '';
    if (messageType.toUpperCase() == 'I' || messageType == '') {
        messType = 'Information Message';
    } else if (messageType.toUpperCase() == 'E') {
        messType = 'Error Message';
    } else if (messageType.toUpperCase() == 'S') {
        messType = 'Success Message';
    } else {
        // FOR CUSTOM MESSAGE TYPE
        messType = messageType;
    }

    $('.modal-title').html(messType);
    $('.modal-body p').html(message);
    $('.modal-footer').html('<button id="btn1" type="button" class="btn btn-default">Close</button>');

    $('#btn1').click(function () {
        $('#myModal').modal('hide');

        setTimeout(function () {
            func();
        }, 300);
    });

    setTimeout(function () {
        $('#myModal').modal('show');
    }, 300);
}

function showMessage(message, messageType) {
    var messType;

    messageType = messageType || '';
    if (messageType.toUpperCase() == 'I' || messageType == '') {
        messType = 'Information Message';
    } else if (messageType.toUpperCase() == 'E') {
        messType = 'Error Message';
    } else if (messageType.toUpperCase() == 'S') {
        messType = 'Success Message';
    } else {
        // FOR CUSTOM MESSAGE TYPE
        messType = messageType;
    }

    $('.modal-title').html(messType);
    $('.modal-body p').html(message);
    $('.modal-footer').html('<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>');

    setTimeout(function () {
        $('#myModal').modal('show');
    }, 300);
}

function showNotice(message) {
    $("#noticeOverlay").css("display", "block");
    $("#notice").css("display", "block");
    $("#noticeLoadingImg").show();
    $("#noticeMessage").text(message);
}

function hideNotice() {
    $("#noticeOverlay").css("display", "none");
    $("#notice").css("display", "none");
}

function withEmptyRequiredFields() {
    var emptyField = false;

    $('select:visible, input:visible, textarea:visible').each(function () {
        if ($(this).hasClass('required') && $(this).val() == '') {
            $(this).addClass('error-field');
            emptyField = true;
        } else {
            $(this).removeClass('error-field');
        }
    });

    return emptyField;
}

function formatText(text) {
    return text.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

$(document).ready(function () {
    $('.preloader').fadeOut('slow');

    $('.numbersWithDecimal').on('keypress keyup blur', function (event) {
        $(this).val($(this).val().replace(/[^0-9\.]/g, ''));
        if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
            event.preventDefault();
        }
    });

    $('.numbersWithoutDecimal').on('keypress keyup blur', function (event) {
        $(this).val($(this).val().replace(/[^\d].+/, ""));
        if ((event.which < 48 || event.which > 57)) {
            event.preventDefault();
        }
    });

    $('.email').change(function () {
        var email = $(this).val();
        var emailReg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (!(email).match(emailReg)) {
            $(this).val('');
            $(this).addClass('error-field');
            showMessage('Please provide a valid email address.', 'E');
        }
    });

    $('.formatText').keyup(function () {
        $(this).val($(this).val().replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }));
    });

    $('.capsAllText').on('input', function () {
        $(this).val($(this).val().toUpperCase());
    });

    $('.tin').change(function () {
        var tin = $(this).val();
        var tinReg1 = /^(?:\d{3}-\d{3}-\d{3})$/;
        var tinReg2 = /^(?:\d{3}-\d{3}-\d{3}-\d{3})$/;

        if (!((tin).match(tinReg1) || (tin).match(tinReg2))) {
            $(this).val('');
            $(this).addClass('error-field');
            showMessage('Please provide a valid TIN.', 'E');
        }
    });

    $("#goToTop").click(function () {
        $("html, body").animate({ scrollTop: 0 }, 300);
    });
});