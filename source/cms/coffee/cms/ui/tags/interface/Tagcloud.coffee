#namespace cms.ui.tags.interface
class Tagcloud extends cms.ui.Base
	@SELECTOR: 'tagcloud'
	_update:(data)->
		for item in data.add
			@_plugins[item] = new Plugin(item)

		for item in data.remove
			p = @_plugins[item]
			if p
				p.destroy?()

	class Plugin extends BaseDOM
		constructor:(element)->
			super({element: element})

			if add = @find('add')
				@_buildAddElement(add)

			@_values = {}
			@_suggestions = {}

			@_template = @find('template')
			@_container = @find('content')
			if !@_container
				@_container = document.createElement('content')
				@appendChild(@_container)
			@_suggestion = @find('suggestion')

			if @attr('name')
				@_content = document.createElement('textarea')
				@_content.setAttribute('name', @attr('name'))
				@_content.style.display = 'none'
				@appendChild(@_content)
			if @attr('validateaction')
				@_validateAction = @attr('validateaction')

		_buildAddElement:(target)->
			group = new BaseDOM({element: 'group'})

			input = new BaseDOM({element: 'input', className: 'col-1_3'})
			button = new BaseDOM({element: 'button', className: target.className})

			label = target.innerHTML
			if !label || label.length == 0
				label = "Adicionar"
			button.html = label

			group.appendChild(input)
			group.appendChild(button)
			target.parentNode.insertBefore(group.element, target)
			target.parentNode.removeChild(target)

			input.element.on('keydown', @_keyDown)
			button.element.on('click', @_buttonClick)
			@_input = input.element

		_keyDown:(e)=>
			e.stopImmediatePropagation()
			if e.keyCode == 13
				e.preventDefault()
				@_addTag()

		_buttonClick:(e)=>
			e.stopImmediatePropagation?()
			e.preventDefault()
			@_addTag()

		_addTag:()->
			value = @_input.value
			value = value.trim()
			value = value.replace(/\s+/g, ' ')
			@addTag(value)

			@_input.value = ''

		_updateValues:()->
			values = []
			for k, v of @_values
				values.push(v.value)
			@_content?.innerHTML = JSON.stringify(values)
		removeTag:(value)->
			if !value || value.trim().length == 0
				return
			normalized = value.toLowerCase()
			if !@_values[normalized]
				return
			target = @_values[normalized]
			target.element.parentNode.removeChild(target.element)
			@_values[normalized] = null
			delete @_values[normalized]

		_commitAddTag:(value, target)=>
			if @_template
				normalized = value.toLowerCase()
				container = @addItem(value, @_container)
				@_values[normalized] = {element: container, value: value}
			@_input.focus()

			@_updateValues()
		addSuggestion:(value)->
			normalized = value.toLowerCase()
			if !@_suggestions[normalized]
				container = @addItem(value, @_suggestion)
				@_suggestions[normalized] = {element: container, value: value}

		addItem:(value, target)->
			content = document.createDocumentFragment()
			app.template.renderBlock(@_template, {value: value}, content)
			removeBtn = content.querySelector('.remove')
			addBtn = content.querySelector('.add')
			container = content.querySelector('*')
			if removeBtn
				removeBtn.value = value
				removeBtn.on('click', @_removeTag)
			if addBtn
				addBtn.value = value
				addBtn.on('click', @_addSuggested)
			if !target
				target = @_container
			target.appendChild(content)
			return container


		addTag:(value)->
			if !value || value.trim().length == 0
				return
			normalized = value.toLowerCase()
			if @_values[normalized]
				return
			if @_validateAction
				if !@_loading
					@_loading = new cms.ui.Loading()
					@appendChild(@_loading)
				@_input.blur()
				@_loading.show()
				API.call(@_validateAction, {value: value}, @_validateComplete, @_validateComplete)
			else
				@_commitAddTag(value)

		_validateComplete:(e, data)=>
			@_loading.hide()
			if data.suggestions
				for v in data.suggestions
					@addSuggestion(v)
			if data?.confirm?
				if !window.confirm(data.confirm)
					return
			if data.value
				@_commitAddTag(data.value)


		_removeTag:(e)=>
			target = e.currentTarget
			value = target.value
			@removeTag(value)
		_addSuggested:(e)=>
			target = e.currentTarget
			value = target.value
			normalized = value.toLowerCase()
			item = @_suggestions[normalized]
			if item
				item.element.parentNode?.removeChild(item.element)
			@addTag(value)
			@_suggestions[normalized] = null

			delete @_suggestions[normalized]
