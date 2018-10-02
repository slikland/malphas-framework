$(document).on('ready', function () {


    /*
    * FORM CRUD AJAX GERAL
    * VALIDAÇÃO, ENVIO E RETORNO
    */
    if($('#formCrudAjax').length) {
        $('#formCrudAjax').formCrudAjax();
    }


    /*
    * AÇÕES EM MASSA PARA
    * TABELA DE VISUALIZAR DADOS
    */
    if($('#actionTableContent').length) {

        var $tableContent = $('#tableContent');

        $('#actionTableContentSelectAllRows').on('click', function () {
            if($('.table-content-select-this-row:not(:checked)').length) {
                $('.table-content-select-this-row:not(:checked)').each(function (index, element) {
                    $(element).trigger('click');
                });
            } else {
                $('.table-content-select-this-row').each(function (index, element) {
                    $(element).trigger('click');
                });
            }
        });

        $('#actionTableContentRefreshTable').on('click', function () {
            window.location.reload();
        });

        $('#actionTableContentDeleteSelectedRows').on('click', function () {
            var $this = $(this);

            if(!$this.hasClass('blocked')) {

                swal({
                    title: 'Deletar vários registros.',
                    text: 'Tem certeza que deseja deletar (' + $('.table-content-select-this-row:checked').length + ') registros?',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'Sim, deletar!'

                }).then(function(result) {

                    if (result.value) {

                        console.log('DELETE VARIOS FAKING AJAX');

                        $this.addClass('is-loading');
                        $('.table').addClass('is-loading');

                        var _ids = [];
                        $('.table-content-select-this-row:checked').each(function (index, element) {
                            _ids.push($(this).val());
                        });

                        console.log(_ids);

                        setTimeout(function () {
                            $this.removeClass('is-loading blocked');
                            $('.table tr.is-selected').slideUp(200, function () {
                                swal({
                                    title: 'Sucesso',
                                    text: '',
                                    type: 'success',
                                    confirmButtonText: 'Okay'
                                }).then(function(result) {
                                    console.log(result);
                                    if(result.value) {
                                        window.location.reload();
                                    }
                                });
                            });

                        }, 1500);
                    }
                });
            }
        });
    }



    $('.table-content-select-this-row').each(function (index, element) {
        var $this = $(element);

        $this.on('click', function() {
            $this.parent().parent().parent().toggleClass('is-selected');

            if($('.table-content-select-this-row:checked').length) {
                $('#actionTableContentDeleteSelectedRows').removeClass('blocked');
                $('#actionTableContentSelectAllRows i').attr('class', 'fas fa-check-square');
            } else {
                $('#actionTableContentDeleteSelectedRows').addClass('blocked');
                $('#actionTableContentSelectAllRows i').attr('class', 'far fa-square');
            }
        });
    });




    $('.delete-this-register').each(function(index, element) {
        var $this = $(element);

        $this.on('click', function() {

            swal({
                title: 'Deletar usuário.',
                text: 'Tem certeza que deseja deletar esse registro?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
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
                                    window.location.reload();
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










});