#namespace cms.ui.tag.sattributes
class Sort extends cms.ui.Base
	@SELECTOR: '[sort]'
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
		_click:(e)=>
