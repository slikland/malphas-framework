(function() {
function __addNamespace(scope, obj){for(k in obj){if(!scope[k]) scope[k] = {};__addNamespace(scope[k], obj[k])}};
__addNamespace(this, {"components":{"ckeditor":{"plugins":{}}}});
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

components.ckeditor.plugins.MediaGallery = (function() {
  var Widget, WidgetInstance;

  MediaGallery.CSS = ".mediagallery{ background-color: #EEEEEE; border: 1px solid #CCCCCC; padding: 8px; }";

  function MediaGallery() {
    this.icons = 'mediagallery';
    this.requires = 'widget';
  }

  MediaGallery.prototype.init = function(editor) {
    CKEDITOR.addCss(this.constructor.CSS);
    editor.widgets.add('mediagallery', new Widget(editor));
    return editor.ui.addButton('mediagallery', {
      label: 'Test',
      command: 'mediagallery',
      toolbar: 'media,1'
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
      this.allowedContent = '.mediaitem';
      this.editables = {
        'wrapper': {
          selector: '.wrapper',
          allowedContent: 'div.mediaitem'
        }
      };
      this.draggable = false;
      this.template = '<div class="mediagallery"><div class="wrapper"></div><button>Add media</button></div>';
    }

    Widget.prototype.init = function() {
      this._scope = Widget.getInstance();
      return this._scope.initInstance(this);
    };

    Widget.prototype.initInstance = function(data) {
      return new WidgetInstance(data);
    };

    Widget.prototype.upcast = function(element) {
      return element.hasClass('mediagallery');
    };

    Widget.prototype.edit = function() {
      console.log('>>', arguments);
      return this.template;
    };

    return Widget;

  })();

  WidgetInstance = (function() {
    function WidgetInstance(instance) {
      this._emptyRemoveable = __bind(this._emptyRemoveable, this);
      this._editableFocus = __bind(this._editableFocus, this);
      this._buttonClick = __bind(this._buttonClick, this);
      Widget.registerInstance(this);
      this._instance = instance;
      this._wrapper = this._instance.wrapper;
      this._editables = this._instance.editables;
      this._editor = instance.editor;
      this._editableWrapper = this._editables.wrapper;
      this._editableWrapper.on('focus', this._editableFocus);
      this._element = this._instance.element;
      this._button = this._element.find('button').getItem(0);
      this._button.on('click', this._buttonClick);
    }

    WidgetInstance.prototype._buttonClick = function() {
      return this._addItem();
    };

    WidgetInstance.prototype._addItem = function() {
      var range;
      if (!this._editableWrapper.getParent()) {
        this._element.append(this._editableWrapper, true);
      }
      this._adding = true;
      range = this._editor.createRange();
      range.moveToElementEditEnd(this._editables.wrapper);
      this._editor.getSelection().selectRanges([range]);
      this._editor.execCommand('mediaitem');
      return this._adding = false;
    };

    WidgetInstance.prototype._editableFocus = function() {
      if (this._adding) {
        return;
      }
      return this._editor.getSelection().selectElement(this._wrapper);
    };

    WidgetInstance.prototype._emptyRemoveable = function() {
      console.log("REMOVEABLE");
      return false;
    };

    return WidgetInstance;

  })();

  return MediaGallery;

})();

CKEDITOR.plugins.add('mediagallery', new components.ckeditor.plugins.MediaGallery());

}).call(this);