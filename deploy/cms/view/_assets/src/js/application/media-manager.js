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
                );
            }
        });
    }

    function convertSize(size) {
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (size == 0) { return '0 Byte' };
        var i = parseInt(Math.floor(Math.log(size) / Math.log(1024)));
        return Math.round(size / Math.pow(1024, i), 2) + ' ' + sizes[i];
    }







    if($('#mediaManager').length) {

        $('#mediaManager').on('dragover', function(event) {
            event.preventDefault();
            event.stopPropagation();
            $('#uploadDropMediaManager').slideDown(200);
        });
        $('#mediaManager').on('dragleave', function(event) {
            event.preventDefault();
            event.stopPropagation();
            $('#uploadDropMediaManager').removeClass('is-dragover');
        });



        $('#uploadDropMediaManager').on('dragover', function(event) {
            event.preventDefault();
            event.stopPropagation();
            $('#uploadDropMediaManager').addClass('is-dragover');
        });

        $('#uploadDropMediaManager').on('drop', function(event) {
            event.preventDefault();
            event.stopPropagation();
            $('#uploadDropMediaManager').removeClass('is-dragover');

            var filesDrop = event.originalEvent.dataTransfer.files;
            var filesData = new FormData();
            var totalByte = 0;
            for (var i = 0; i < filesDrop.length; i ++) {
                filesData.append('file[]', filesDrop[i], filesDrop[i]['name']);
                totalByte += filesDrop[i]['size'];

                console.log('NAME : ', filesDrop[i]['name']);
                console.log('SIZE : ', filesDrop[i]['size']);
                console.log('TYPE : ', filesDrop[i]['type']);
                console.log('---------------');
            }

            console.log('totalByte', totalByte);
            console.log('convertedByte', convertSize(totalByte));

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

    }




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
                    $this.parent().parent().hide(200);
                    swal(
                        'Deletado!',
                        'Arquivo deletado para sempre!!!',
                        'success'
                    );
                }

            });

        });

    });





});