$(document).on('ready', function () {

    function uploadData(formdata){
        var _intervalProgress = 0;
        $.ajax({
            url: baseUrl+'mediamanager/upload/',
            type: 'post',
            data: formdata,
            contentType: false,
            processData: false,
            dataType: 'json',
            beforeSend : function() {
                var progressUpload = 0;
                _intervalProgress = setInterval(function () {
                    $('#uploadDropMediaManagerProgress').val(progressUpload);
                    progressUpload++;
                    if(progressUpload > 98) {
                        clearInterval(_intervalProgress);
                    }
                }, 100);
            },
            success: function(response){
                clearInterval(_intervalProgress);
                if(response.error) {
                    $('#uploadDropMediaManagerProgress').val(0);
                    return swal(
                        'Error',
                        response.message,
                        'error'
                    );
                }
                $('#uploadDropMediaManagerProgress').val(100);
                swal(
                    'Sucesso',
                    'Arquivos foram salvos com sucesso',
                    'success'
                ).then(function(){
                    window.location.reload();
                });
            }
        });
    }

    function convertSize(size) {
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (size == 0) { return '0 Byte' };
        var i = parseInt(Math.floor(Math.log(size) / Math.log(1024)));
        return Math.round(size / Math.pow(1024, i), 2) + ' ' + sizes[i];
    }

    if($('#fileName').length) {
        $('#fileName').on('keyup', function (event) {
            var $this = $(this);
            $this.val(slugify($this.val()));
        });
    }



    if($('#addFileDragAndDrop').length) {
        $('#addFileDragAndDrop').on('click', function () {
            $('#uploadDropMediaManager').slideToggle(200);
        });
    }

    if($('#actionMediaManager').length) {

        $('#actionMediaManagerSelectAll').on('click', function () {
            $('.file-manager-item').each(function (index, element) {
                $(this).addClass('is-selected');
            });
        });
        $('#actionMediaManagerSelectAll').on('click', function () {

            if($('.file-manager-item:has(.is-selected)').length) {
                $('.file-manager-item').each(function (index, element) {
                    $(element).trigger('click');
                });
            } else {
                $('.file-manager-item').each(function (index, element) {
                    $(element).trigger('click');
                });
            }
        });
        $('.file-manager-item').each(function (index, element) {
            $(this).on('click', function () {

                $(this).addClass('is-selected');
                //$(this).toggleClass('is-selected');

                if($('.file-manager-item.is-selected').length) {
                    $('#actionMediaManagerDeleteSelectedRows').removeClass('blocked');
                    $('#actionMediaManagerSelectAll i').attr('class', 'fas fa-check-square');
                } else {
                    $('#actionMediaManagerDeleteSelectedRows').addClass('blocked');
                    $('#actionMediaManagerSelectAll i').attr('class', 'far fa-square');
                }
            });
        });

    }


    if($('#mediaManager').length) {

        if(!$('#gerenciadorMedia').length) {
            $('#uploadDropMediaManager').slideDown(200);
        }

        $('#mediaManager').on('dragover', function(event) {
            event.preventDefault();
            event.stopPropagation();
            $('#uploadDropMediaManager').slideDown(200);
            $('html').addClass('has-dragover');
        });
        $('#mediaManager').on('dragleave', function(event) {
            event.preventDefault();
            event.stopPropagation();
            $('#uploadDropMediaManager').removeClass('is-dragover');
            $('html').removeClass('has-dragover');
        });
        $('#mediaManager').on('drop', function(event) {
            event.preventDefault();
            event.stopPropagation();
            $('#uploadDropMediaManager').removeClass('is-dragover');
            $('html').removeClass('has-dragover');
        });

        $('#uploadDropMediaManager').on('dragover', function(event) {
            event.preventDefault();
            event.stopPropagation();
            $('#uploadDropMediaManager').addClass('is-dragover');
            $('html').addClass('has-dragover');
        });
        $('#uploadDropMediaManager').on('drop', function(event) {
            event.preventDefault();
            event.stopPropagation();
            $('#uploadDropMediaManager').removeClass('is-dragover');
            $('html').removeClass('has-dragover');

            var filesDrop = event.originalEvent.dataTransfer.files;
            var filesData = new FormData();
            var totalByte = 0;
            for (var i = 0; i < filesDrop.length; i ++) {
                filesData.append('file[]', filesDrop[i], filesDrop[i]['name']);
                totalByte += filesDrop[i]['size'];
            }

            if(totalByte > 8300000) {
                $('#uploadDropMediaManagerProgress').val(0);
                return swal(
                    'Error',
                    'Limite máximo de <strong>8MB</strong> por upload foi ultrapassado',
                    'error'
                );
            }

            uploadData(filesData);
        });

        $('.file-manager-view').each(function(index, element) {});
        $('.file-manager-edit').each(function(index, element) {});

        $('.file-manager-delete').each(function(index, element) {
            var $this = $(element);
            $this.on('click', function() {
                swal({
                    title: 'Deletar arquivo.',
                    text: 'Tem certeza que vai deletar esse arquivo?',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Sim, deletar!'
                }).then(function(result){
                    if (result.value) {
                        $this.formCrudAjaxDelete({
                            path : $this.attr('href'),
                            success : function (response) {
                                if(response === true) {
                                    swal({
                                        title: 'Sucesso',
                                        text: response.message,
                                        type: 'success',
                                        confirmButtonText: 'Okay'
                                    }).then(function(result) {
                                        $this.parent().parent().delay(300).addClass('deleted').hide(200);
                                        if(!$('#fileManagerList .file-manager-item:not(.deleted)').length) {
                                            window.location.reload();
                                        }
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
                        });
                    }
                });
                return false;
            });

        });




        if($('#formSearcMedia').length) {

            $(window).on('keyup', function(event) {
                console.log(event);
            });

            $('#formSearcMedia').on('keyup', function(event) {
                var $this = $(this);

                $this.find('.control').addClass('is-loading');

                if(event.keyCode === 27) {
                    return $('#formSearcMediaInput').blur();
                }


            });

            $('#formSearcMediaInput').blur(function () {
                var $this = $(this);
                $this.parent().removeClass('is-loading');
            });

        }






    }

});