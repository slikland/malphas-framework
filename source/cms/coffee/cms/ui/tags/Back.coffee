#namespace cms.ui.tags
class Back extends cms.ui.Base
	@SELECTOR: 'back'
	_update:(data)->
		for item in data.add
			if !app.main.hasHistory
				item?.parentNode.removeChild(item)
			else
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
		_click:()=>
			app.trigger('back')
