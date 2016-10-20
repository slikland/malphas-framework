#namespace components.ckeditor.plugins
class MediaGallery

	@CSS: "#inject mediagallery.css"

	constructor:()->
		@icons = 'mediagallery'
		@requires = 'widget'
	init:(editor)->
		CKEDITOR.addCss(@constructor.CSS)
		editor.widgets.add('mediagallery', new Widget(editor))
		editor.ui.addButton('mediagallery', {
			label: 'Test'
			command: 'mediagallery',
			toolbar: 'media,1'
		})
	class Widget
		@_instances = []
		@getInstance:()=>
			@_instance ?= new @(arguments...)

		@registerInstance:(instance)->
			if !instance instanceof WidgetInstance
				throw new Error("Not a widget instance")
			@_instances.push(instance)

		constructor:(editor)->
			@_editor = editor
			@allowedContent = '.mediaitem'
			@editables = {
				'wrapper': {
					selector: '.wrapper'
					allowedContent: 'div.mediaitem'
				}
			}
			@draggable = false
			@template = '<div class="mediagallery"><div class="wrapper"></div><button>Add media</button></div>'
		init:()->
			@_scope = Widget.getInstance()
			@_scope.initInstance(@)
		initInstance:(data)->
			new WidgetInstance(data)
		upcast:(element)=>
			return element.hasClass('mediagallery')
		edit:()->
			console.log('>>', arguments)
			return @template
	class WidgetInstance
		constructor:(instance)->
			Widget.registerInstance(@)
			@_instance = instance
			@_wrapper = @_instance.wrapper
			@_editables = @_instance.editables
			@_editor = instance.editor
			@_editableWrapper = @_editables.wrapper
			@_editableWrapper.on('focus', @_editableFocus)
			@_element = @_instance.element
			@_button = @_element.find('button').getItem(0)
			@_button.on('click', @_buttonClick)
		_buttonClick:()=>
			@_addItem()
		_addItem:()->
			if !@_editableWrapper.getParent()
				@_element.append(@_editableWrapper, true)
			@_adding = true
			range = @_editor.createRange()
			range.moveToElementEditEnd(@_editables.wrapper)
			@_editor.getSelection().selectRanges([range])
			@_editor.execCommand('mediaitem')
			@_adding = false
		_editableFocus:()=>
			if @_adding
				return
			@_editor.getSelection().selectElement(@_wrapper)
		_emptyRemoveable:()=>
			console.log("REMOVEABLE")
			return false

CKEDITOR.plugins.add( 'mediagallery', new components.ckeditor.plugins.MediaGallery());