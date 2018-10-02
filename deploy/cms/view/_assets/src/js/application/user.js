$(document).on('ready', function () {










    $('#generatePass').on('click', function() {
        $('#userPassword, #userConfirmPassword').attr('type', 'text').val(randomPassword(8));
    });

});