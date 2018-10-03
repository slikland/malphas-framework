$(document).on('ready', function () {


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

            console.log('#uploadDragDrop DROP', event);

            var file = event.originalEvent.dataTransfer.files;
            var fd = new FormData();
            fd.append('file', file[0]);
            fd.append('file2', file[1]);

            console.log(file);

            console.log(fd);
            //uploadData(fd);

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


/*






    // Sending AJAX request and upload file
    function uploadData(formdata){

        $.ajax({
            url: 'ajax-upload.php',
            type: 'post',
            data: formdata,
            contentType: false,
            processData: false,
            dataType: 'json',
            success: function(response){
                console.log(response);
                //addThumbnail(response);
            }
        });
    }


// Added thumbnail
    function addThumbnail(data){
        $("#uploadfile h1").remove();
        var len = $("#uploadfile div.thumbnail").length;

        var num = Number(len);
        num = num + 1;

        var name = data.name;
        var size = convertSize(data.size);
        var src = data.src;

        // Creating an thumbnail
        $("#uploadfile").append('<div id="thumbnail_'+num+'" class="thumbnail"></div>');
        $("#thumbnail_"+num).append('<img src="'+src+'" width="100%" height="78%">');
        $("#thumbnail_"+num).append('<span class="size">'+size+'<span>');

    }

// Bytes conversion
    function convertSize(size) {
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (size == 0) { return '0 Byte' };
        var i = parseInt(Math.floor(Math.log(size) / Math.log(1024)));
        return Math.round(size / Math.pow(1024, i), 2) + ' ' + sizes[i];
    }







    $('#addFileDragAndDrop').on('click', function () {

        $('#uploadDragDrop').slideToggle(200);

    });

*/