$(document).on('ready', function () {
    console.log('PAGE AUTH READY');

    var $loginBox = $('#loginBox');
    var $forgotBox = $('#forgotBox');
    var $login = $('#loginEmail');
    var $pass = $('#loginPass');
    var $forgot = $('#forgotEmail');
    var $notification = $('#authNotification');

    $login.focus();
    $notification.hide();



    $('#formLogin').formSubmitAuth();


    /*

    $('#formLogin').on('submit', function () {

        var $this = $(this);
        var $submit = $('#loginSubmit');

        $this.find('.icon-error, .icon-success').hide();


        // VALIDANDO EMAIL LOGIN
        if(!$login.val().length) {
            $login.addClass('is-danger');
            $login.focus().parent().find('.icon-error').show();
            return $loginBox.animateCss('shake');
        }
        if (!regex.email.test($login.val())) {
            $login.addClass('is-danger');
            $login.focus().parent().find('.icon-error').show();
            return $loginBox.animateCss('shake');
        }
        $login.addClass('is-success').removeClass('is-danger');
        $login.parent().find('.icon-success').show();
        // VALIDANDO EMAIL LOGIN



        // VALIDANDO SENHA LOGIN
        if($pass.val().length < 4) {
            $pass.addClass('is-danger');
            $pass.focus().parent().find('.icon-error').show();
            return $loginBox.animateCss('shake');
        }
        $pass.addClass('is-success').removeClass('is-danger');
        $pass.parent().find('.icon-success').show();
        // VALIDANDO SENHA LOGIN



        // VALIDANDO SE JÁ FOI SUBMETIDO
        if($loginBox.hasClass('sending')) {
            return false;
        }



        // AJAX PARA CMS AUTENTICAR
        $.ajax({
            url : 'https://api.diegosanches.me/login',
            method : 'GET',
            data : {
                pass : $pass.val()
            },
            beforeSend : function() {
                $loginBox.addClass('sending');
                $submit.addClass('is-loading');
                $notification.slideUp(200, function() {
                    $(this).attr('class', 'notification').find('p').html('');
                });
            },
            success : function(response) {
                console.log(response);

                if(response.SEND === 'Slik') {

                    $loginBox.animateCss('bounceOut', function() {

                        $loginBox.css({
                            opacity : 0
                        }).remove();

                        window.location.href = 'dashboard';

                    });

                } else {
                    /// LOGIN SENHA INVALIDO
                    $notification.find('p').html('Login ou senha inválido');
                    $notification.addClass('is-danger').slideDown(200);
                    $loginBox.animateCss('shake');
                }

            },
            error : function() {
                console.log('ERROR');

                setTimeout(function() {
                    $notification.find('p').html('ERRO NO SERVIDOR');
                    $notification.addClass('is-warning').slideDown(200);
                }, 200);
            },
            complete : function() {
                $loginBox.removeClass('sending');
                $submit.removeClass('is-loading');
            },
            statusCode : {
                200 : function() {console.log('200');},
                404 : function() {console.log('404');},
                500 : function() {console.log('500');}
            }
        });

    });











    //$forgot.focus();

    $('#formForgot').on('submit', function () {

        var $this = $(this);
        var $submit = $('#forgotSubmit');

        $this.find('.icon-error, .icon-success').hide();



        // VALIDANDO EMAIL forgot
        if(!$forgot.val().length) {
            $forgot.addClass('is-danger');
            $forgot.focus().parent().find('.icon-error').show();
            return $forgotBox.animateCss('shake');
        }
        if (!regex.email.test($forgot.val())) {
            $forgot.addClass('is-danger');
            $forgot.focus().parent().find('.icon-error').show();
            return $forgotBox.animateCss('shake');
        }
        $forgot.addClass('is-success').removeClass('is-danger');
        $forgot.parent().find('.icon-success').show();
        // VALIDANDO EMAIL forgot




        // VALIDANDO SE JÁ FOI SUBMETIDO
        if($forgotBox.hasClass('sending')) {
            return false;
        }



        // AJAX PARA CMS AUTENTICAR
        $.ajax({
            url : 'https://api.diegosanches.me/login/forgot',
            method : 'GET',
            data : {
                email : $forgot.val()
            },
            beforeSend : function() {
                $forgotBox.addClass('sending');
                $submit.addClass('is-loading');
                $notification.slideUp(200, function() {
                    $(this).attr('class', 'notification').find('p').html('');
                });
            },
            success : function(response) {
                console.log(response);

                $notification.find('p')
                    .html('Pronto!<br>O e-mail de recuperação foi enviado para <strong>'+$forgot.val());
                $notification.addClass('is-link').slideDown(200);
                // $forgotBox.animateCss('shake');

                if(response.SEND === 'Slik') {

                    // $forgotBox.animateCss('bounceOut', function() {
                    //     $forgotBox.css({
                    //         opacity : 0
                    //     });
                    // });

                } else {
                    /// forgot SENHA INVALIDO

                }


            },
            error : function() {
                console.log('ERROR');

                setTimeout(function() {
                    $notification.find('p').html('ERRO NO SERVIDOR');
                    $notification.addClass('is-warning').slideDown(200);
                }, 200);
            },
            complete : function() {
                $forgotBox.removeClass('sending');
                $submit.removeClass('is-loading');
            },
            statusCode : {
                200 : function() {console.log('200');},
                404 : function() {console.log('404');},
                500 : function() {console.log('500');}
            }
        });

    });

    */

});

$(window).on('load', function () {

    $('body').removeClass('loading');
    $('#loginBox, #forgotBox').animateCss('bounceIn');

});

$(window).on('beforeunload', function () {

    $('body').addClass('loading');
    $('#loginBox, #forgotBox').animateCss('zoomOut');

});