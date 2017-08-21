#namespace cms.ui.tag.attributes
class Confirm extends cms.ui.Base
	@SELECTOR: '[confirm]'
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
			@_element.on('click', @_click)
		_click:(e)=>
			message = @attr('confirm')
			if !window.confirm(message)
				e.preventDefault()
				e.stopImmediatePropagation()
