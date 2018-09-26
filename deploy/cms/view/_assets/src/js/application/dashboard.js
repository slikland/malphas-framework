$(document).on('ready', function () {

    $('#dashboardGrid').sortable({
        handle: '.dashboard-grid-handle',
        cursor: 'move',
        sort: function(event, ui) {
            var $target = $(event.target);
            if (!/html|body/i.test($target.offsetParent()[0].tagName)) {
                var top = event.pageY - $target.offsetParent().offset().top - (ui.helper.outerHeight(true) / 4);
                ui.helper.css({'top' : top + 'px'});
            }
        },
        update: function( event, ui ) {
            console.log('DASHBOARD SORTABLE UPDATE');
        },
    });

});