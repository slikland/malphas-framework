#namespace cms.ui.tags.form
class Toggle extends cms.ui.Base
	@SELECTOR: 'toggle'
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
			@_input = @find('input')
			if @_input
				@selected = @_input.checked
				@_input.on('change', @_update)
			@_element.on('click', @_toggle)
			@_element.on('change', @_change)
		_change:()=>

		@get selected:()->
			return @_selected

		@set selected:(value)->
			@_selected = value
			@_element.setAttribute('selected', value)
			@_element.selected = value
			if @_input
				@_input.checked = value
			@_element.trigger('change')
		_toggle:()=>
			@selected = !@_selected
		_update:()=>
			if @_input
				@selected = @_input.checked
