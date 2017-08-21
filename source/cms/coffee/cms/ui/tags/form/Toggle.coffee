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
				# if @_input.getAttribute('type').toLowerCase() == 'radio'
					# @@_checkParents:()-
			@_element.on('click', @_toggle)
			@_element.on('change', @_change)
		_change:()=>
			if @_input
				form = @findParents('form')
				if form
					items = form.querySelectorAll('input[name="'+@_input.getAttribute('name')+'"]')
					i = items.length
					while i-- > 0
						if items[i] != @_input
							items[i].trigger('change')
		@get selected:()->
			return @_selected

		@set selected:(value)->
			if value == @_selected
				return
			@_selected = value
			@_element.setAttribute('selected', value)
			@_element.selected = value
			if @_input
				@_input.checked = value
				@_input?.trigger('update')
			@_element.trigger('change')
		_toggle:()=>
			if @_input?.getAttribute('type') == 'radio'
				@_input.click()
				return
			@selected = !@_selected
			@_input?.trigger('change')
		_update:(e = null)=>
			if @_input
				@selected = @_input.checked

