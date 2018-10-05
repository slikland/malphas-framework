/**
 * AVOID `CONSOLE`
 * ERRORS IN BROWSERS
 * THAT LACK A CONSOLE.
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
 * PLUGINS FOR CMS
 **/
$.fn.extend({

    formCrudAjax : function (options) {
        if(options === undefined) {
            options = {};
        }
        this.find('input').first().focus();
        this.on('submit', function () {
            var $form = $(this);
            var $submit = $form.find('button.is-form-submit');
            var _methods = {
                getPath : function ($element) {
                    if(!$element.attr('data-action').length) {
                        return swal({
                            title: 'Ops!',
                            text: 'Action do formulário não foi definida.',
                            type: 'error',
                            confirmButtonText: 'Okay'
                        });
                    }
                    return $element.attr('data-action');
                },
                getMethod : function ($element) {
                    if(!$element.attr('method').length) {
                        return swal({
                            title: 'Ops!',
                            text: 'Method do formulário não foi definida.',
                            type: 'error',
                            confirmButtonText: 'Okay'
                        });
                    }
                    return $element.attr('method');
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
                    $form.find('.is-danger').removeClass('is-danger');
                    $form.find('.is-success').removeClass('is-success');
                    $form.find('.icon-error').hide();
                    $form.find('.icon-success').hide();
                    $form.find('.help').slideUp(200);
                    $submit.addClass('is-loading');
                    if (typeof options.beforeSend === 'function') {
                        options.beforeSend();
                    }
                },
                success : function(response) {
                    if (typeof options.success === 'function') {
                        options.success(response);
                    } else {
                        if(response.error !== undefined) {
                            return swal({
                                title: 'Ops!',
                                text: response.message,
                                type: 'error',
                                confirmButtonText: 'Okay'
                            });
                        }
                        if(response === true) {
                            return swal({
                                title: 'Sucesso',
                                text: 'Salvo com sucesso.',
                                type: 'success',
                                confirmButtonText: 'Okay'
                            }).then(function(result) {
                                if($form.attr('data-redirect').length) {
                                    window.location.href = $form.attr('data-redirect');
                                } else {
                                    window.location.reload();
                                }
                            });
                        } else {
                            $form.formCrudValidation(response);
                        }
                    }
                },
                error : function() {
                    if (typeof options.error === 'function') {
                        options.error();
                    } else {
                        return swal({
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
                    if (typeof options.complete === 'function') {
                        options.complete();
                    }
                }
            });
        });
    },


    formCrudAjaxDelete : function (options) {
        if(options === undefined) {
            options = {};
        }

        var $this = this;

        if(options.path === undefined) {
            return swal({
                title: 'Ops!',
                text: 'Action do formulário não foi definida.',
                type: 'error',
                confirmButtonText: 'Okay'
            });
        }

        if($this.hasClass('sending')) {
            return false;
        }

        $.ajax({
            url : options.path,
            method : 'GET',
            beforeSend : function() {
                $this.addClass('sending is-loading');
                if (typeof options.beforeSend === 'function') {
                    options.beforeSend();
                }
            },
            success : function(response) {
                if (typeof options.success === 'function') {
                    options.success(response);
                }
            },
            error : function() {
                if (typeof options.error === 'function') {
                    options.error();
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
                $this.removeClass('sending is-loading');
                if (typeof options.complete === 'function') {
                    options.complete();
                }
            },
            statusCode : {
                200 : function() {console.log('200');},
                404 : function() {console.log('404');},
                500 : function() {console.log('500');}
            }
        });


    },



    /**
     * VALIDATE FORM JAVASCRIPT FRONT
     **/
    formCrudValidation : function (response) {
        var $form = this;

        var _i = 0;
        for(var key in response) {
            var $thisInput = $form.find('[name="'+key+'"]');

            if(_i === 0) {
                $thisInput.focus();
            }
            _i++;

            $form.animateCss('shake');

            var _html = '';
            for(var i = 0; i < response[key].length; i++) {
                _html += '<span><i class="fas fa-exclamation-circle"></i> '+response[key][i]+'</span>';
            }

            switch ($thisInput[0].localName) {

                case 'input':
                    $thisInput.addClass('is-danger');
                    $thisInput.parent().find('.icon-error').show();
                    $thisInput.parent()
                        .parent()
                        .find('.help')
                        .addClass('is-danger')
                        .html(_html)
                        .slideDown(200);

                    break;

                case 'select':
                    $thisInput.parent().addClass('is-danger');
                    $thisInput.parent()
                        .parent()
                        .parent()
                        .find('.help')
                        .addClass('is-danger')
                        .html(_html)
                        .slideDown(200);

                    break;

                case 'textarea':
                    break;
            }

        }
    }

});