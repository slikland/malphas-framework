#namespace cms.ui.tags.form
class Field extends cms.ui.Base
	@SELECTOR: 'field'
	_update:(data)->
		for item in data.add
			@_plugins[item] = new Plugin(item)

		for item in data.remove
			p = @_plugins[item]
			if p
				p.destroy?()

	class Plugin extends BaseDOM
		@_destroyPlugin:(item)->

		constructor:(element)->
			super({element: element})
			@_input = @_element.querySelector('input')

			@_input.on('focus', @_focus)
			@_input.on('blur', @_blur)
			@_input.on('change', @_change)
			@_input.on('input', @_change)
			@_checkFilled()

		_focus:()=>
			@_focused = true
			@_checkFilled()
		_blur:()=>
			@_focused = false
			@_checkFilled()
		_change:()=>
			@_checkFilled()

		_checkFilled:()=>
			if @_focused
				@addClass('filled')
				return
			v = @_input.value.trim()
			if v.length == 0
				@removeClass('filled')
				@_input.value = v
			else
				@addClass('filled')
