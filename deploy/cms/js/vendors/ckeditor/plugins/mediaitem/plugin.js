(function() {
function __addNamespace(scope, obj){for(k in obj){if(!scope[k]) scope[k] = {};__addNamespace(scope[k], obj[k])}};
__addNamespace(this, {"components":{"ckeditor":{"plugins":{}}}});
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

components.ckeditor.plugins.MediaItem = (function() {
  var Widget, WidgetDialog, WidgetInstance;

  MediaItem.CSS = ".mediaitem { display: inline-block; width: 200px; height: 200px; border: 1px solid #CCCCCC; }";

  function MediaItem() {
    this.icons = 'mediaitem';
    this.requires = 'widget';
  }

  MediaItem.prototype.init = function(editor) {
    CKEDITOR.addCss(this.constructor.CSS);
    editor.widgets.add('mediaitem', new Widget(editor));
    new WidgetDialog();
    return editor.ui.addButton('mediaitem', {
      label: 'Test',
      command: 'mediaitem',
      toolbar: 'media,0'
    });
  };

  Widget = (function() {
    Widget._instances = [];

    Widget.getInstance = function() {
      return Widget._instance != null ? Widget._instance : Widget._instance = (function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args);
        return Object(result) === result ? result : child;
      })(Widget, arguments, function(){});
    };

    Widget.registerInstance = function(instance) {
      if (!instance instanceof WidgetInstance) {
        throw new Error("Not a widget instance");
      }
      return this._instances.push(instance);
    };

    function Widget(editor) {
      this.upcast = __bind(this.upcast, this);
      this._editor = editor;
      this.dialog = 'mediaitem';
      this.draggable = false;
      this.template = '<div class="mediaitem">BLA1</div>';
      this.inline = true;
    }

    Widget.prototype.init = function() {
      this._scope = Widget.getInstance();
      return this._scope.initInstance(this);
    };

    Widget.prototype.initInstance = function(data) {
      return new WidgetInstance(data);
    };

    Widget.prototype.upcast = function(element) {
      return element.hasClass('mediaitem');
    };

    return Widget;

  })();

  WidgetInstance = (function() {
    function WidgetInstance(instance) {
      Widget.registerInstance(this);
      this._instance = instance;
      this._wrapper = this._instance.wrapper;
      this._editables = this._instance.editables;
      this._editor = instance.editor;
      this._element = this._instance.element;
      this._instance.setData('bla', 1);
    }

    return WidgetInstance;

  })();

  WidgetDialog = (function() {
    WidgetDialog.getInstance = function() {
      return WidgetDialog._instance != null ? WidgetDialog._instance : WidgetDialog._instance = (function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args);
        return Object(result) === result ? result : child;
      })(WidgetDialog, arguments, function(){});
    };

    function WidgetDialog(editor) {
      this._dialogDefinition = __bind(this._dialogDefinition, this);
      this._onCancel = __bind(this._onCancel, this);
      this._onOk = __bind(this._onOk, this);
      this._test = __bind(this._test, this);
      this._editor = editor;
      CKEDITOR.dialog.add('mediaitem', this.path + 'dialogs/null.js');
      CKEDITOR.dialog.add('mediaitem', this._dialogDefinition);
    }

    WidgetDialog.prototype.setDialog = function(dialog) {
      this._dialog = dialog;
      this._dialog.onOk = this._onOk;
      this._dialog.onCancel = this._onCancel;
      return setTimeout(this._test, 0);
    };

    WidgetDialog.prototype._test = function() {
      return console.log(this._dialog.parts.contents.find(''));
    };

    WidgetDialog.prototype._onShow = function() {
      return console.log("SHOW", this);
    };

    WidgetDialog.prototype._onOk = function() {
      return console.log("OK");
    };

    WidgetDialog.prototype._onCancel = function() {
      return console.log("Cancel");
    };

    WidgetDialog.prototype._test123 = function() {
      return console.log('>>>', this, arguments);
    };

    WidgetDialog.prototype._dialogDefinition = function() {
      console.log('bla');
      return {
        title: 'Media',
        minWidth: 400,
        minHeight: 400,
        contents: [
          {
            id: 'image',
            label: 'Image',
            elements: [
              {
                type: 'text',
                id: 'image1',
                label: 'Imagem (630x415)',
                setup: this._test123
              }
            ]
          }, {
            id: 'youtube',
            label: 'Youtube',
            elements: [
              {
                type: 'text',
                label: 'Youtube URL',
                id: 'youtubeURL'
              }
            ]
          }
        ]
      };
    };

    WidgetDialog.prototype._onLoad = function() {
      console.log(this);
      return WidgetDialog.getInstance().setDialog(this);
    };

    return WidgetDialog;

  })();

  return MediaItem;

})();

CKEDITOR.plugins.add('mediaitem', new components.ckeditor.plugins.MediaItem());

}).call(this);