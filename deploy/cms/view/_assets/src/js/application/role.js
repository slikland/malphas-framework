$(document).on('ready', function () {



    // $('.delete-user').each(function(index, element) {
    //     var $this = $(element);
    //
    //     $this.on('click', function() {
    //
    //         swal({
    //             title: 'Deletar usuário.',
    //             text: 'Tem certeza que vai deletar esse usuário?',
    //             type: 'warning',
    //             showCancelButton: true,
    //             confirmButtonColor: '#3085d6',
    //             cancelButtonColor: '#d33',
    //             confirmButtonText: 'Sim, deletar!'
    //         }).then(function(result) {
    //             if (result.value) {
    //                 $this.parent().parent().hide(200);
    //                 window.location.href = $this.attr('href');
    //             }
    //         });
    //         return false;
    //     });
    //
    // });


    $('#formRoleCreate').formSubmitGeneral(
        '',
        function (response) {

            if(response.action) {
                swal({
                    title: 'Sucesso',
                    text: response.message,
                    type: 'success',
                    confirmButtonText: 'Okay'
                }).then(function(result) {
                    window.location.href = baseUrl+'role/';
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