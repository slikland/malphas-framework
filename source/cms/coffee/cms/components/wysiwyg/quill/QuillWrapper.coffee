#namespace components
class QuillWrapper extends BaseDOM
	@SELECTOR: 'textarea[type="quill"]'
	@ORDER: 0

	@_init:()->
		if @_inited
			return
		if !Quill?
			throw new Error('QUILL is not loaded')
		@_inited = true
		for k, v of components.quill
			Quill.registerModule(v.NAME, v);
	constructor:()->
		@constructor._init()
		super
		@_quillContainer = new BaseDOM({element: 'div', className: 'quill-container'})
		@element.parentNode.insertBefore(@_quillContainer.element, @element)
		@_quillContainer.appendChild(@element)
		@css({display: 'none'})

		@_buildToolbar()
		@_buildEditor()

		@_quill = new Quill(@_quillEditor.element, {
			modules: {
				toolbar: {
					container: @_toolbarContainer.element
				}
				'media-gallery': true
			}
			theme: 'snow'
		})
		@_quill.setHTML(@element.value)
		href = @attr('href')
		if !href || href.length == 0
			@element.removeAttribute('href')
			return
		@element.on('click', @_click)

	update:()->
		@html = @_quill.getHTML()

	_addToolbarItemsRecursive:(items, target)->
		if !target
			target = document.createElement('span')
		for item in items
			tag = item.tag || 'span'
			element = document.createElement(tag)
			if item.type?
				element.className = item.type
			for k, v of item
				if k in ['type', 'items', 'tag']
					continue
				element.setAttribute(k, v)
			if item.items
				@_addToolbarItemsRecursive(item.items, element)
			target.appendChild(element)
		return target


	_buildToolbar:()->
		items = [
			{
				type: 'ql-format-group', 
				items: [
					{
						type: "ql-format-button ql-bold",
						title: "Bold"
					}
					{
						type: "ql-format-separator"
					}
					{
						type: "ql-format-button ql-italic"
						title: "Italic"
					}
					{
						type: "ql-format-separator"
					}
					{
						type: "ql-format-button ql-underline"
						title: "Underline"
					}
				]
			}
			{
				type: "ql-format-separator"
			}
			{
				type: 'ql-align', 
				tag: 'select'
				items: [
					{
						value: "left",
						tag: 'option'
					}
					{
						value: "right",
						tag: 'option'
					}
					{
						value: "center",
						tag: 'option'
					}
					{
						value: "justify",
						tag: 'option'
					}
				]
			}
			{
				type: "ql-format-separator"
			}
			{
				type: 'ql-format-group', 
				items: [
					{
						type: "ql-format-button ql-media-gallery",
						title: "Media gallery"
					}

				]
			}
		]

		@_toolbarContainer = new BaseDOM({element:'div', className: 'toolbar-container'})
		@_addToolbarItemsRecursive(items, @_toolbarContainer.element)
		@_quillContainer.appendChild(@_toolbarContainer)

	_buildEditor:()->
		@_quillEditor = new BaseDOM({element: 'div', className: 'editor-container'})
		@_quillContainer.appendChild(@_quillEditor)

	destroy:()->
		@removeAll()
		@off()
