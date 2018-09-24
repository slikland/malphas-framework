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
 * GENERATE RANDOM STRONG PASSOWRD
 **/
var randomPassword = function(length) {
    var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOP1234567890!@#$%^&*-+";
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


    /**
     * AUTH FORMULARIO DE
     * LOGIN E ESQUECI A SENHA
     **/
    formSubmitAuth : function(beforeSend, success, error, complete) {

        this.on('submit', function () {

            if($(this).cmsFormValidate()) {

                $(this).cmsFormAjaxSend(beforeSend, success, error, complete);

            }

        });

    },






    /**
     *
     **/
    cmsFormValidate : function () {

        var $form = this;
        var validateAllInput = true;

        var _methods = {

            isRequired : function () {},

            /**
             * VERIFICA SE O INPUT ESTÁ VAZIO
             * OU É MENOR QUE O MÍNIMO
             * DE CARACTERES NECESSÁRIO
             **/
            inputLengthEmpty : function($element) {
                if(!$element.val().length) {
                    return true;
                }
                if($element.attr('minlength') !== undefined) {
                    if($element.val().length < $element.attr('minlength')) {
                        return true;
                    }
                }
                return false;
            },


            /**
             * VERIFICA SE O INPUT ESTÁ VAZIO
             * OU É MENOR QUE O MÍNIMO
             * DE CARACTERES NECESSÁRIO
             **/
            inputIsEmailValid : function($element) {

                if (!regex.email.test($element.val())) {
                    _methods.inputAlertInvalid($element);
                    return false;
                }
                return true;
            },


            /**
             * SINALIZA QUE O INPUT ESTÁ INVÁLIDO
             * E FAZ UM EFEITO DE "SHAKE" no FORM
             **/
            inputAlertInvalid : function ($element) {
                $form.animateCss('shake');
                $element.addClass('is-danger');
                $element.focus().parent().find('.icon-error').show();
                return false;
            },




        };

        $form.find('.icon-error, .icon-success').hide();


        /**
         * PERCORRENDO TODOS ELEMENTOS DO FORMULARIO
         **/
        $form.find('input, select, textarea').each(function(index, element) {

            var $element = $(element);


            /**
             * VALIDAÇÃO "REQUIRED"
             **/
            if($element.attr('required') !== undefined) {

                switch($element.attr('type')) {

                    /**
                     * VALIDANDO INPUT TYPE TEXT
                     **/
                    case 'text':
                    case 'search':
                    case 'password':
                        if(_methods.inputLengthEmpty($element)) {

                            _methods.inputAlertInvalid($element);
                            validateAllInput = false;

                            return false;
                        }
                        break;



                    /**
                     * VALIDANDO INPUT TYPE EMAIL
                     **/
                    case 'email':

                        if(_methods.inputLengthEmpty($element)) {

                            _methods.inputAlertInvalid($element);
                            validateAllInput = false;

                            return false;
                        }

                        if (!_methods.inputIsEmailValid($element)) {

                            _methods.inputAlertInvalid($element);
                            validateAllInput = false;

                            return false;
                        }

                        break;



                    /**
                     * VALIDANDO INPUT TYPE CHECKBOX
                     **/
                    case 'checkbox':

                        _methods.inputAlertInvalid($element);
                        validateAllInput = false;
                        return false;

                        break;


                    /**
                     * VALIDANDO INPUT TYPE RADIO
                     **/
                    case 'radio':

                        _methods.inputAlertInvalid($element);
                        validateAllInput = false;
                        return false;

                        break;


                    // case 'select':
                    //     if(!$element.val().length) {
                    //         $form.animateCss('shake');
                    //         $element.parent().addClass('is-danger');
                    //         $element.focus().parent().find('.icon-error').show();
                    //         validateAllInput = false;
                    //         return false;
                    //     }
                    //     break;

                    // case 'textarea':
                    //     if($element.val().length < 3) {
                    //         $form.animateCss('shake');
                    //         $element.addClass('is-danger');
                    //         $element.focus().parent().find('.icon-error').show();
                    //         validateAllInput = false;
                    //         return false;
                    //     }
                    //     break;

                    default:
                        console.log('INPUT NÃO INDENTIFICADO');
                }

                console.log('INPUT PASSOU PELO SWITCH');

            }

            $element.addClass('is-success').removeClass('is-danger');
            $element.parent().find('.icon-success').show();

            // if($element.attr('type') === 'select') {
            //     $element.parent().addClass('is-success').removeClass('is-danger');
            // }

        });

        return validateAllInput;

    },
    
    

    cmsFormAjaxSend : function (beforeSend, success, error, complete) {

        var $form = this;
        var $submit = this.find('button.is-submit');
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

            },

        };

        // VALIDANDO SE JÁ FOI SUBMETIDO
        if($form.hasClass('sending')) {
            return false;
        }

        // ENVIANDO O REQUEST EM AJAX
        $.ajax({
            url : _methods.getPath($form),
            method : _methods.getMethod($form),
            data : {
                form : $form.serializeArray()
            },
            beforeSend : function() {
                $form.addClass('sending');
                $submit.addClass('is-loading');

                if (typeof beforeSend === 'function') {
                    beforeSend();
                }

            },
            success : function(response) {
                if (typeof success === 'function') {
                    success(response);
                }
            },
            error : function() {
                console.log('ERROR');

                swal({
                    title: 'Ops!',
                    text: 'Erro no servidor, tente novamente daqui alguns minutos.',
                    type: 'error',
                    confirmButtonText: 'Okay'
                });

                if (typeof error === 'function') {
                    error();
                }

            },
            complete : function() {
                $form.removeClass('sending');
                $submit.removeClass('is-loading');

                if (typeof complete === 'function') {
                    complete();
                }
            },
            statusCode : {
                200 : function() {console.log('200');},
                404 : function() {console.log('404');},
                500 : function() {console.log('500');}
            }
        });

    }
    
});