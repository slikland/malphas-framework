$(document).on('ready', function () {


    $('#generatePass').on('click', function() {
        $('#userPassword, #userConfirmPassword').attr('type', 'text').val(randomPassword(8));
    });


    $('.delete-user').each(function(index, element) {
        var $this = $(element);

        $this.on('click', function() {

            swal({
                title: 'Deletar usuário.',
                text: 'Tem certeza que vai deletar esse usuário?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sim, deletar!'
            }).then(function(result) {
                if (result.value) {

                    $this.cmsAjaxDelete(
                        $this.attr('href'),
                        '',
                        function (response) {
                            if(response === true) {
                                swal({
                                    title: 'Sucesso',
                                    text: response.message,
                                    type: 'success',
                                    confirmButtonText: 'Okay'
                                }).then(function(result) {
                                    window.location.href = baseUrl+'user/';
                                });
                            } else {
                                swal({
                                    title: 'Ops!',
                                    text: response.message,
                                    type: 'error',
                                    confirmButtonText: 'Okay'
                                });
                            }
                        }
                    );
                    //$this.parent().parent().hide(200);

                }
            });
            return false;
        });

    });


    $('#formUserCreate').formSubmitGeneral(
        '',
        function (response) {

            if(response === true) {
                swal({
                    title: 'Sucesso',
                    text: 'Adicionado com Sucesso',
                    type: 'success',
                    confirmButtonText: 'Okay'
                }).then(function(result) {
                    window.location.href = baseUrl+'user/';
                });
            } else {
                swal({
                    title: 'Ops!',
                    text: response.message,
                    type: 'error',
                    confirmButtonText: 'Okay'
                });
            }

        }
    );

});