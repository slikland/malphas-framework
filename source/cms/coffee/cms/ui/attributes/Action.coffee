#namespace cms.ui.tag.attributes
class Action extends cms.ui.Base
	@SELECTOR: ':not(form)[action]'
	_update:(data)->
		for item in data.add
			if item.hasAttribute('action') && !item.getAttribute('target')
				action = item.getAttribute('action')
				if /\/api\/.*?$/.test(action)
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
			API.call(@_element.getAttribute('action'))
			e.preventDefault()
			e.stopImmediatePropagation()
