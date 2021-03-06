var travelUrl = 'https://api.eproductsph.net/travel';

$(document).ready(function () {
    $('#travelInsurance').click(function () {
        var allFAQAreVisible = true;
        $('.faq-desc').each(function () {
            if ($(this).is(':hidden')) {
                allFAQAreVisible = false;
                return false;
            }
        });

        if (allFAQAreVisible) {
            $('.faq-box .faq-desc').slideUp('fast');
            $('#travelInsurance .title').html('Show All <i class="fa fa-angle-down"></i>');
            $('.faq-title p:nth-child(2)').html('<i class="fa fa-angle-down"></i>');
        } else {
            $('.faq-box .faq-desc').slideDown('fast');
            $('#travelInsurance .title').html('Hide All <i class="fa fa-angle-up"></i>');
            $('.faq-title p:nth-child(2)').html('<i class="fa fa-angle-up"></i>');
        }
    });

    $.ajax({
        type: 'GET',
        url: travelUrl + '/faq',
        async: false,
        success: function (response) {
            $.each(response, function (index, value) {
                $('#faqs').append(
                    '<div class="faq-box">' +
                        '<div class="faq-title title">' +
                            '<p>' + value.faqQuestion + '</p>' +
                            '<p><i class="fa fa-angle-down"></i></p>' +
                        '</div>' +
                        '<div class="faq-desc">' + value.faqAnswer + '</div>' +
                    '</div>'
                );
            });
        },
        error: function (jqXHR) {
            showMessage('There is an error encountered while getting FAQs.', 'E');
        }
    });

    $('.faq-title').click(function () {
        $(this).siblings('.faq-desc').slideToggle('fast', function () {
            if ($(this).is(':visible')) {
                $(this).siblings('.faq-title').children('p:nth-child(2)').html('<i class="fa fa-angle-up"></i>');
            } else {
                $(this).siblings('.faq-title').children('p:nth-child(2)').html('<i class="fa fa-angle-down"></i>');
            }

            var allFAQAreVisible = true;
            $('.faq-desc').each(function () {
                if ($(this).is(':hidden')) {
                    allFAQAreVisible = false;
                    return false;
                }
            });

            if (allFAQAreVisible) {
                $('#travelInsurance .title').html('Hide All <i class="fa fa-angle-up"></i>');
            } else {
                $('#travelInsurance .title').html('Show All <i class="fa fa-angle-down"></i>');
            }
        });
    });

    $('.faq-desc').hide();
});