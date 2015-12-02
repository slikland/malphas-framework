class components.CKEditor extends BaseDOM
	@ORDER: 0
	@SELECTOR: '[type="ckeditor"]'
	constructor:()->
		super
		@_editor = CKEDITOR.replace(@element, Template?.currentData?._ckeditor)
		@_form = @findParents('form')
		if @_form
			@_form.on('submit', @_updateTextarea)
		# @_templateNode = @element.templateNode
	_updateTextarea:()=>

		@_editor.updateElement()