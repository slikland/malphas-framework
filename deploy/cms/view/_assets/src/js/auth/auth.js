$(document).on('ready', function () {

    $('.notification-close').each(function(index, element) {
        $(element).on('click', function() {
            $(this).parent().slideUp(200);
        });
    });

    var $notification = $('#authNotification');
        $notification.hide();


    /**
     * FORM LOGIN
     **/
    if($('#formLogin').length) {

        var beforeSend = function() {
            $notification.slideUp(200, function() {
                $(this).attr('class', 'notification').find('p').html('');
            });
        };

        var success = function(response) {

            $notification.find('p').html('Usuário ou senha inválido');
            $notification.addClass('is-danger').slideDown(200);
            $('#formLogin').animateCss('shake');
        };

        $('#formLogin').formSubmitAuth(beforeSend, success);

    }


    /**
     * FORM ESQUECI A SENHA
     **/
    if($('#formForgot').length) {

        var beforeSend = function() {
            $notification.slideUp(200, function() {
                $(this).attr('class', 'notification').find('p').html('');
            });
        };

        var success = function(response) {

            $notification.find('p').html('Pronto! O e-mail de recuperação foi enviado.');
            $notification.addClass('is-link').slideDown(200);

        };

        $('#formForgot').formSubmitAuth(beforeSend, success);

    }

});

$(window).on('load', function () {

    $('#loginEmail, #forgotEmail').focus();

    $('body').removeClass('loading');
    $('#loginBox, #forgotBox').animateCss('bounceIn');

});

$(window).on('beforeunload', function () {

    $('body').addClass('loading');
    $('#loginBox, #forgotBox').animateCss('zoomOut');

});