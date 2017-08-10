#namespace cms.ui.tag.attributes
class Duplicate extends cms.ui.Base
	@SELECTOR: '[duplicate]'
	_update:(data)->
		for item in data.add
			@_plugins[item] = new Plugin(item)

		for item in data.remove
			p = @_plugins[item]
			if p
				p.destroy?()

	class Plugin extends BaseDOM
		@_form: null
		@_destroyPlugin:(item)->

		constructor:(element)->
			super({element: element})
			@_element.on('click', @_click)
		_click:(e)=>
			e.preventDefault()
			e.stopImmediatePropagation()
			target = app.interface.context.find(@attr('duplicate'))
			block = slikland.mara.Block.findBlock(target.getAttribute('mara'))
			child = target.cloneNode(true)
			inputs = child.querySelectorAll('input,textarea')
			for input in inputs
				input.value = ''
				input.innerHTML = ''

			target.parentNode.appendChild(child)

