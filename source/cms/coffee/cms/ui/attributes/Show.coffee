#namespace cms.ui.tag.attributes
class Show extends cms.ui.Base
	@SELECTOR: '[show]'
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
			@_element.on('change', @_change)
		_change:(e)=>
			currentTarget = e.target
			container = e.target.parentNode.parentNode
			inputs = container.querySelectorAll(@attr('show'))
			selectedOption = currentTarget.options[currentTarget.selectedIndex].value
			
			for input in inputs
				if selectedOption == '' || selectedOption == '0' || selectedOption == 0
					input.parentNode.style.display = 'block'
				else
					input.parentNode.style.display = 'none'
