$(document).on('ready', function () {

    $('.notification-close').each(function(index, element) {
        $(element).on('click', function() {
            $(this).parent().slideUp(200);
        });
    });

    var $notification = $('#authNotification');
        $notification.hide();

    if($('#formAuth').length) {

        $('#formAuth').on('submit', function () {

            if($notification.find('p').text().length) {
                $notification.addClass('is-info').slideDown(200);
            }

            var $form = $(this);
            var $submit = $form.find('button.is-submit');
            var _methods = {
                getPath : function ($form) {
                    if(!$form.attr('data-action').length) {
                        return swal({
                            title: 'Ops!',
                            text: 'Action do formulário não foi definida.',
                            type: 'error',
                            confirmButtonText: 'Okay'
                        });
                    }
                    return $form.attr('data-action');
                },
                getMethod : function ($form) {
                    if(!$form.attr('method').length) {
                        return swal({
                            title: 'Ops!',
                            text: 'Method do formulário não foi definida.',
                            type: 'error',
                            confirmButtonText: 'Okay'
                        });
                    }
                    return $form.attr('method');
                }
            };

            if($form.hasClass('sending')) {
                return false;
            }

            $.ajax({
                url : _methods.getPath($form),
                method : _methods.getMethod($form),
                data : $form.serializeArray(),
                beforeSend : function() {
                    $form.addClass('sending');
                    $submit.addClass('is-loading');
                    $notification.slideUp(200);
                },
                success : function(response) {
                    if(response.success) {
                        window.location.href = baseUrl + response.redirect;
                    }
                },
                error : function(response) {
                    console.log(response);
                    if(response.status === 401) {
                        $notification.text(response.responseJSON.message)
                            .addClass('is-danger')
                            .slideDown(200);
                    } else {
                        swal({
                            title: 'Ops!',
                            text: 'Erro no servidor, tente novamente daqui alguns minutos.',
                            type: 'error',
                            confirmButtonText: 'Okay'
                        });
                    }
                },
                complete : function() {
                    $form.removeClass('sending');
                    $submit.removeClass('is-loading');
                },
                statusCode : {
                    200 : function() {console.log('200');},
                    404 : function() {console.log('404');},
                    500 : function() {console.log('500');}
                }
            });
        });
    }
});

$(window).on('load', function () {

    $('body').removeClass('loading');
    $('#authBox').animateCss('bounceIn');

});

$(window).on('beforeunload', function () {

    $('body').addClass('loading');
    $('#authBox').animateCss('zoomOut');

});