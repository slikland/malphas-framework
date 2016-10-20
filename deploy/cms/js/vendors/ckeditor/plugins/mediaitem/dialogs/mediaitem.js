(function() {
var MediaItemDialog;

MediaItemDialog = (function() {
  MediaItemDialog.dialogDefinition = {};

  function MediaItemDialog() {
    return {
      title: 'Media',
      minWidth: 400,
      minHeight: 400,
      onLoad: this._onLoad,
      onShow: this._onLoad,
      contents: [
        {
          id: 'image',
          label: 'Image',
          elements: [
            {
              type: 'file',
              label: 'Imagem (630x415)',
              id: 'testText1',
              accept: 'image/*',
              'default': 'hello world1!'
            }
          ]
        }, {
          id: 'image2',
          label: 'Image2',
          title: 'First Tab Title2',
          elements: [
            {
              type: 'text',
              label: 'Test Text 1',
              id: 'testText2',
              'default': 'hello world2!'
            }
          ]
        }, {
          id: 'image3',
          label: 'Image3',
          title: 'First Tab Title3',
          elements: [
            {
              type: 'text',
              label: 'Test Text 1',
              id: 'testText3',
              'default': 'hello worl3d!'
            }
          ]
        }
      ]
    };
  }

  MediaItemDialog.prototype._onLoad = function() {
    console.log("LALALa");
    return console.log(this);
  };

  return MediaItemDialog;

})();

CKEDITOR.dialog.add('mediaitem', MediaItemDialog);

}).call(this);