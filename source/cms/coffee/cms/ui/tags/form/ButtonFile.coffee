#namespace cms.ui.tags.form
class ButtonFile extends cms.ui.Base
	@SELECTOR: 'button[type="file"]'
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
			input = element.querySelector('input[type="file"]')
			if !input
				input = document.createElement('input')
				for attr in element.attributes
					name = attr.name || attr.nodeName
					input.setAttribute(name, element.getAttribute(name))
			@_input = input
			@_input.className = @_input.className + ' hidden-file-input'
			@_input.on('change', @_inputChange)
			@_element.parentNode.appendChild(@_input)
			@_element.on('click', @_click)

		_click:(e)=>
			e.preventDefault?()
			e.stopImmediatePropogation?()
			@_input.click()

		_inputChange:()=>
			if @_input.files.length > 0
				form = @findParents('form')
				form.trigger('submit')

		destroy:()->
			if @_input
				1
				# @_input.off()
			@_element.off('click', @_click)
