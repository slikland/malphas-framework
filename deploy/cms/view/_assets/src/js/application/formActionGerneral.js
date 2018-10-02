$(document).on('ready', function () {


    if($('#formSubmit').length) {
        $('#formSubmit').formSubmitGeneral();
    }




    /*
    * AÇÕES PARA TABELA DE LISTAGEM DOS DADOS
    * MELHORAR DEPOIS
    *
    $('.select-this-row').each(function (index, element) {
        var $this = $(element);

        $this.on('click', function() {
            $this.parent().parent().parent().toggleClass('is-selected');
            if($('.select-this-row:checked').length) {
                $('#severalActionDelete').removeClass('blocked');
                $('#severalActionSelectAllRows i').attr('class', 'fas fa-check-square');
            } else {
                $('#severalActionDelete').addClass('blocked');
                $('#severalActionSelectAllRows i').attr('class', 'far fa-square');
            }
        });
    });

    $('#severalActionSelectAllRows').on('click', function () {

        if($('.select-this-row:not(:checked)').length) {
            $('.select-this-row:not(:checked)').each(function (index, element) {
                $(element).trigger('click');
            });
        } else {
            $('.select-this-row').each(function (index, element) {
                $(element).trigger('click');
            });
        }


    });
    $('#severalActionRefresh').on('click', function () {
        window.location.reload();
    })
    $('#severalActionDelete').on('click', function () {
        var $this = $(this);

        if(!$this.hasClass('blocked')) {
            swal({
                title: 'Deletar vários usuários.',
                text: 'Tem certeza que vai deletar (' + $('.select-this-row:checked').length + ') usuários?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Sim, deletar!'
            }).then(function(result) {
                if (result.value) {
                    $this.addClass('is-loading');
                    $('.table').addClass('is-loading');

                    var _ids = [];
                    $('.select-this-row:checked').each(function (index, element) {
                        _ids.push($(this).val());
                    });

                    setTimeout(function () {
                        $this.removeClass('is-loading blocked');
                        $('.table tr.is-selected').slideUp(200, function () {
                            swal({
                                title: 'Sucesso',
                                text: '',
                                type: 'success',
                                confirmButtonText: 'Okay'
                            }).then(function(result) {
                                window.location.href = baseUrl+'user/';
                            });
                        });

                    }, 2000);
                }
            });
        }
    });
    *
    * AÇÕES PARA TABELA DE LISTAGEM DOS DADOS
    * MELHORAR DEPOIS
    */





});