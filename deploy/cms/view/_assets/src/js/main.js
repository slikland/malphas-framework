/**
 * AVOID `CONSOLE`
 * ERRORS IN BROWSERS THAT LACK A CONSOLE.
 **/
;(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});
    while (length--) {
        method = methods[length];
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

/**
 * REGEX UTILS
 **/
var regex = {
    email : /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
};

/**
 * SCROLL VERTICAL
 * ANIMATED BY POSITION
 **/
var animaScroll = function(_top, duration, callback) {
    duration = duration || 500;
    $('html, body').stop().animate({
        scrollTop : _top
    }, duration, function() {
        if (typeof callback === 'function') {
            callback();
        }
    });
};

/**
 * RANDOM STRONG PASSOWRD
 **/
var randomPassword = function(length) {
    var chars = "abcdefghijklmnopqrstuvwxyz!@#$%^&*-+ABCDEFGHIJKLMNOP1234567890";
    var pass = "";
    for (var x = 0; x < length; x++) {
        var i = Math.floor(Math.random() * chars.length);
        pass += chars.charAt(i);
    }
    return pass;
};

/**
 * CREATE JQUERY FUNCTION
 * FOR CSS LIB ANIMATE.CSS
 **/
$.fn.extend({
    animateCss : function(animationName, callback) {
        var animationEnd = (function(el) {
            var animations = {
                animation: 'animationend',
                OAnimation: 'oAnimationEnd',
                MozAnimation: 'mozAnimationEnd',
                WebkitAnimation: 'webkitAnimationEnd',
            };

            for (var t in animations) {
                if (el.style[t] !== undefined) {
                    return animations[t];
                }
            }
        })(document.createElement('div'));

        this.addClass('animated ' + animationName).one(animationEnd, function() {
            $(this).removeClass('animated ' + animationName);

            if (typeof callback === 'function') callback();
        });

        return this;
    }
});

/**
 * UTILS PLUGINS FOR CMS
 **/
$.fn.extend({


    formSubmit : function (pluginOptions, callback) {

        setTimeout(function () {

            if (typeof callback === 'function') callback();

        }, 50);

    },

    formSubmitAuth : function (pluginOptions, callback) {

        var $this = this;

        $this.on('submit', function () {

            $this._thisFormValidate();

        });

        setTimeout(function () {
            if (typeof callback === 'function') callback();
        }, 50);

    },
    
    _thisFormValidate : function () {

        var $this = this;

        $this.find('.icon-error, .icon-success').hide();

        var validateAllInput = true;

        $this.find('input, select, textarea').each(function(index, element) {
            var $element = $(element);

            /// VALIDAÇÃO
            if($element.attr('required') !== undefined) {

                switch($element.attr('type')) {

                    case 'text':
                        if($element.val().length < 1) {
                            $this.animateCss('shake');
                            $element.addClass('is-danger');
                            $element.focus().parent().find('.icon-error').show();
                            validateAllInput = false;
                            return false;
                        }
                        break;

                    case 'email':
                        if(!$element.val().length) {
                            $this.animateCss('shake');
                            $element.addClass('is-danger');
                            $element.focus().parent().find('.icon-error').show();
                            validateAllInput = false;
                            return false;
                        }
                        if (!regex.email.test($element.val())) {
                            $this.animateCss('shake');
                            $element.addClass('is-danger');
                            $element.focus().parent().find('.icon-error').show();
                            validateAllInput = false;
                            return false;
                        }
                        break;

                    case 'password':
                        if($element.val().length < 8) {
                            $this.animateCss('shake');
                            $element.addClass('is-danger');
                            $element.focus().parent().find('.icon-error').show();
                            validateAllInput = false;
                            return false;
                        }
                        break;

                    case 'select':
                        if(!$element.val().length) {
                            $this.animateCss('shake');
                            $element.parent().addClass('is-danger');
                            $element.focus().parent().find('.icon-error').show();
                            validateAllInput = false;
                            return false;
                        }
                        break;

                    case 'textarea':
                        if($element.val().length < 3) {
                            $this.animateCss('shake');
                            $element.addClass('is-danger');
                            $element.focus().parent().find('.icon-error').show();
                            validateAllInput = false;
                            return false;
                        }
                        break;

                    default:
                        alert('INPUT DEFAULT');
                }

            }

            $element.addClass('is-success').removeClass('is-danger');
            $element.parent().find('.icon-success').show();
            if($element.attr('type') === 'select') {
                $element.parent().addClass('is-success').removeClass('is-danger');
            }


        });

        // VALIDANDO SE JÁ FOI SUBMETIDO
        if($this.hasClass('sending')) {
            return false;
        }

        //console.log('serializeArray : ', $this.serializeArray());




        if(validateAllInput) {

            $.ajax({
                url : 'https://api.diegosanches.me/data/submit/',
                method : 'POST',
                data : {
                    form : $this.serializeArray()
                },
                beforeSend : function() {
                    $this.addClass('sending');
                    $submit.addClass('is-loading');
                    $notification.slideUp(200, function() {
                        $(this).attr('class', 'notification').find('p').html('');
                    });
                },
                success : function(response) {
                    console.log(response);

                    swal({
                        position: 'center',
                        type: 'success',
                        title: 'Usuário criado com sucesso!',
                        showConfirmButton: false,
                        timer: 2000
                    });

                    $this.find('input, select, textarea').each(function(index, element) {
                        var $element = $(element);
                        $(element).val('');
                        $element.removeClass('is-success is-danger');
                        $element.parent().find('.icon-error, .icon-success').hide();
                        if($element.attr('type') === 'select') {
                            $element.parent().removeClass('is-success is-danger');
                        }
                    });

                },
                error : function() {
                    console.log('ERROR');

                    swal({
                        title: 'Ops!<br>Erro ao salvar os dados',
                        text: 'Tente novamente.',
                        type: 'error',
                        confirmButtonText: 'Okay'
                    });
                },
                complete : function() {
                    $this.removeClass('sending');
                    $submit.removeClass('is-loading');
                },
                statusCode : {
                    200 : function() {console.log('200');},
                    404 : function() {console.log('404');},
                    500 : function() {console.log('500');}
                }
            });

        }




    }


});