#namespace components

class CKEditorWrapper extends BaseDOM
	@ORDER: 0
	@SELECTOR: '[type="ckeditor"]'
	@init:()->
		ComponentController.getInstance().addIgnoreSelector('[class^=cke]')

	@_init:()->
		if @_inited
			return
		if !CKEDITOR
			throw new Error('CKEditor not imported')

		CKEDITOR.config.allowedContent = true
		@_inited = true
		for k, v of components.ckeditor
			v.init?()


	constructor:()->
		@constructor._init()
		super

		# CKEDITOR.skin.addIcon('testicon', CKEDITOR.basePath + 'plugins/sl_icons_hidpi.png', 0)
		# CKEDITOR.skin.addIcon('testicon2', CKEDITOR.basePath + 'plugins/sl_icons_hidpi.png', -24)
		ckEditorData = Template?.currentData?._ckeditor
		ckEditorData.toolbarGroups.push({name: 'media'})
		# ckEditorData = {}
		console.log(ckEditorData)
		ckEditorData.extraPlugins = 'mediaitem,mediagallery'
		@_editor = CKEDITOR.replace(@element, ckEditorData)
		@_form = @findParents('form')
		if @_form
			@_form.on('submit', @_updateTextarea)
		# @_templateNode = @element.templateNode
	_updateTextarea:()=>
		@_editor.updateElement()