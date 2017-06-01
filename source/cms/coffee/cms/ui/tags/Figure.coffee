#namespace cms.ui.tags.form
class Figure extends cms.ui.Base
	@SELECTOR: 'figure'
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
			@css('background-image', 'url(' + @attr('src') + ')')
