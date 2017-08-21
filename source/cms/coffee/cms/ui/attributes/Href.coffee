#namespace cms.ui.tag.attributes
class Href extends cms.ui.Base
	@SELECTOR: '[href]'
	_update:(data)->
		for item in data.add
			if item.hasAttribute('href') && !item.getAttribute('target')
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
			app.router.goto(@attr('href'))
			e.preventDefault()
			e.stopImmediatePropagation()
