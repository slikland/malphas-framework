#namespace cms.ui.tag.attributes
class For extends cms.ui.Base
	@SELECTOR: '[for]'
	_update:(data)->
		for item in data.add
			if item.hasAttribute('sort')
				continue
			@_plugins[item] = new Plugin(item)

		for item in data.remove
			p = @_plugins[item]
			if p
				p.destroy?()
	class Plugin extends BaseDOM
		@_destroyPlugin:(item)->

		constructor:(element)->
			super({element: element})
			
			@_target = document.querySelector('#' + @attr('for'))
			@_value = ''
			@_setItemValue()
			@_element.on('change', @_change)
			@_element.on('input', @_change)
		_setItemValue:()->
			id = @_element.getAttribute('for')
			data = app.router.getParam(id)
			if !data
				return
			name = @_element.getAttribute('name')
			if name && data[name]
				data = data[name]
				if @_element.tagName.toLowerCase() == 'input' && @_element.getAttribute('type')?.toLowerCase() in ['checkbox','radio']
					if @_element.value in data
						@_element.checked = true
						@_element.trigger('change')
						@_value = true
					else
						@_value = false
				else
					@_element.value = data
					@_value = data
		_updateTarget:()=>
			@_target = document.querySelector('#' + @attr('for'))
			changed = false
			newValue = null
			if @_element.tagName.toLowerCase() == 'input' && @_element.getAttribute('type')?.toLowerCase() in ['checkbox','radio']
				newValue = @_element.checked
				if newValue != @_value
					changed = true
					@_value = newValue
			else
				newValue = @_element.value
				if newValue.trim() != @_value.trim()
					changed = true
					@_value = newValue
			if changed
				@_target?.trigger('update')
		_updateDelayed:()->
			clearTimeout(@_updateTimeout)
			@_updateTimeout = setTimeout(@_updateTarget, 250)
		_change:(e)=>
			@_updateDelayed()