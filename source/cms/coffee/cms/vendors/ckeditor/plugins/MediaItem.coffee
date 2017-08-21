#namespace components.ckeditor.plugins
class MediaItem
	@CSS: "#inject mediaitem.css"
	constructor:()->
		@icons = 'mediaitem'
		@requires = 'widget'
	init:(editor)->
		CKEDITOR.addCss(@constructor.CSS)
		editor.widgets.add('mediaitem', new Widget(editor))
		new WidgetDialog()
		editor.ui.addButton('mediaitem', {
			label: 'Test'
			command: 'mediaitem',
			toolbar: 'media,0'
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
			@dialog = 'mediaitem'
			@draggable = false
			@template = '<div class="mediaitem">BLA1</div>'
			@inline = true
		init:()->
			@_scope = Widget.getInstance()
			@_scope.initInstance(@)
		initInstance:(data)->
			new WidgetInstance(data)
		upcast:(element)=>
			return element.hasClass('mediaitem')
		# edit:()->
		# 	@_editor.openDialog('mediaitem')
		# 	return @template
	class WidgetInstance
		constructor:(instance)->
			Widget.registerInstance(@)
			@_instance = instance
			@_wrapper = @_instance.wrapper
			@_editables = @_instance.editables
			@_editor = instance.editor
			@_element = @_instance.element
			@_instance.setData('bla', 1)
	class WidgetDialog
		@getInstance:()=>
			@_instance ?= new @(arguments...)
		constructor:(editor)->
			@_editor = editor
			CKEDITOR.dialog.add('mediaitem', @path + 'dialogs/null.js')
			CKEDITOR.dialog.add( 'mediaitem', @_dialogDefinition)
		setDialog:(dialog)->
			@_dialog = dialog
			@_dialog.onOk = @_onOk
			@_dialog.onCancel = @_onCancel

			setTimeout(@_test, 0)
		_test:()=>

		_onShow:()->

		_onOk:()=>

		_onCancel:()=>

		_test123:()->

		_dialogDefinition:()=>
			return {
				title: 'Media'
				minWidth: 400
				minHeight: 400
				# onLoad: @_onLoad
				# onOk: @_onOk
				# onShow: @_onShow
				# onCancel: @_onCancel
				contents: [
					{
						id: 'image'
						label: 'Image'
						elements: [
							{
								type: 'text'
								id: 'image1'
								label: 'Imagem (630x415)'
								setup: @_test123
							}
						]
					}
					{
						id: 'youtube'
						label: 'Youtube'
						elements: [
							{
								type: 'text'
								label: 'Youtube URL'
								id: 'youtubeURL'
							}
						]
					}
				]
			}
		_onLoad:()->
			WidgetDialog.getInstance().setDialog(@)

CKEDITOR.plugins.add( 'mediaitem', new components.ckeditor.plugins.MediaItem());