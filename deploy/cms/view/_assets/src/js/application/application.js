var $loading;

$(document).on('ready', function () {

    $loading = $('#loading');

    $('.notification-close').each(function(index, element) {
        $(element).on('click', function() {
            $(this).parent().slideUp(200);
        });
    });


    $('#navbarTopBurger').on('click', function() {
        var $this = $(this);
        $('html').toggleClass('mobile-sidebar-show');
    });
    $('#sidebarBackDrop').on('click', function() {
        var $this = $(this);
        $('html').removeClass('mobile-sidebar-show');
    });





    $('.table').each(function(index, element) {
        $(this).DataTable({
            autoFill: {
                update: true
            }
        });
    });







    if($('#statusSlider').length) {

        $('#statusSlider').flickity({
            cellAlign: 'left',
            contain: true,
            pageDots: false,
            prevNextButtons: false
        });

    }




    $('#navbarTopBrand').animateCss('bounceIn');


































    $(window).on('scroll', function () {
        var _scaleY = $(document).scrollTop();

        if (_scaleY > 100) {
            $('body').addClass('scrolling');
        } else {
            $('body').removeClass('scrolling scrolling-down scrolling-up');
        }

    });

    $('body').on('mousewheel', function(e) {
        if(e.originalEvent.wheelDelta / 120 > 0) {
            $('body').addClass('scrolling-up').removeClass('scrolling-down');
        } else {
            $('body').addClass('scrolling-down').removeClass('scrolling-up');
        }
    });

});

$(window).on('load', function () {

    animaScroll(0);



    //=========================
    $('#wrap .page-content').css({
        'min-height' : ($(window).height() - 52)
    });
    //=========================



    setTimeout(function() {
        $loading.animateCss('slideOutUp faster', function() {
            $loading.hide();
        });
    }, 500);

    setTimeout(function() {
        $('body').removeClass('loading');
    }, 650);

});




$(window).on('resize', function () {


    //=========================
    $('#wrap .page-content').css({
        'min-height' : ($(window).height() - 52)
    });
    //=========================


});




$(window).on('beforeunload', function () {
    console.log('BEFOREUNLOAD GLOBAL : ', Date());

    animaScroll(0);

    $('body').addClass('loading');


    $loading.slideDown(200);
    setTimeout(function() {
        window.location.reload();
    }, 2000);

});