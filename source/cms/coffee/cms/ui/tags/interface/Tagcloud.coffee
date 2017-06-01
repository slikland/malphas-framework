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

			@_template = @find('template')
			@_container = @find('content')
			if !@_container
				@_container = document.createElement('content')
				@appendChild(@_container)
			if @attr('name')
				@_content = document.createElement('textarea')
				@_content.setAttribute('name', @attr('name'))
				@_content.style.display = 'none'
				@appendChild(@_content)

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


		addTag:(value)->
			if !value || value.trim().length == 0
				return
			normalized = value.toLowerCase()
			if @_values[normalized]
				return
			if @_template
				content = document.createDocumentFragment()
				app.template.renderBlock(@_template, {value: value}, content)
				removeBtn = content.querySelector('.remove')
				container = content.querySelector('*')
				removeBtn.value = value
				if removeBtn
					removeBtn.on('click', @_removeTag)
				@_container.appendChild(content)
				@_values[normalized] = {element: container, value: value}

			@_updateValues()



		_removeTag:(e)=>
			target = e.currentTarget
			value = target.value
			@removeTag(value)
