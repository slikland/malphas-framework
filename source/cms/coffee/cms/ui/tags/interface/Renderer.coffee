#namespace cms.ui.tags.interface
class Renderer extends cms.ui.Base
	@SELECTOR: 'renderer'
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
			@element.on('update', @_update)
		_update:(e, data)=>
			app.template.renderBlock(@elemnet, data)
