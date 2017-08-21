#namespace cms.ui.tags.form
class Field extends cms.ui.Base
	@SELECTOR: 'field'
	_update:(data)->
		for item in data.add
			if Plugin._checkPlugin(item)
				@_plugins[item] = new Plugin(item)
			else
				item.className += ' filled'

		for item in data.remove
			p = @_plugins[item]
			if p
				p.destroy?()

	class Plugin extends BaseDOM
		@_destroyPlugin:(item)->

		@_checkPlugin:(item)->
			input = item.querySelector('input:not([type="hidden"]),select,textarea')
			if !input
				return false
			if input.findParents('field') != item
				return false
			return true

		constructor:(element)->
			super({element: element})
			@_input = @_element.querySelector('input:not([type="hidden"]),select,textarea')
			nameAttr = @_input.getAttribute("type")
			if(nameAttr == 'date' || nameAttr == 'time')
				@_checkFilled(true)
			else
				if @_input?.tagName.toLowerCase() in ['select', 'textarea']
					@_input?.setAttribute('type', @_input?.tagName.toLowerCase())
				if @_input?.hasAttribute('type')
					@addClass(@_input.getAttribute('type'))
					switch @_input.getAttribute('type').toLowerCase()
						when 'password'
							@_checkPasswordPreview()

				@_input?.on('focus', @_focus)
				@_input?.on('blur', @_blur)
				@_input?.on('change', @_change)
				@_input?.on('input', @_change)
				setTimeout(@_checkFilled, 1)

		_checkPasswordPreview:()->
			pp = @find('.show-password')
			if !pp
				return
			@_passwordPreview = pp
			@_passwordPreview.on('change', @_passwordPreviewChange)
		_passwordPreviewChange:()=>
			if @_passwordPreview.selected
				@_input?.setAttribute('type', 'text')
			else
				@_input?.setAttribute('type', 'password')

		_password:(e)=>
			@_input?.type = 'text'
			e.preventDefault()
			e.stopImmediatePropagation()

		_focus:()=>
			@_focused = true
			@_checkFilled()
		_blur:()=>
			@_focused = false
			@_checkFilled()
		_change:()=>
			@_checkFilled()

		_checkFilled:(focusStarts = false)=>

			if @_focused || focusStarts
				@addClass('filled')
				return
			v = @_input?.value.trim()
			if v.length == 0
				@removeClass('filled')
				@_input?.value = v
			else
				@addClass('filled')
