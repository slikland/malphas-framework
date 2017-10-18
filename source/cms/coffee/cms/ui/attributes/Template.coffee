#namespace cms.ui.attributes
class Template extends cms.ui.Base
	@SELECTOR: 'a[template],button[template]'

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
			@_template = @attr('template')
			if /^\>/.test(@_template)
				@_template = app.template.currentFile + @_template
			@_element.on('click', @_click)
		_click:()=>
			o = {
				template: @_template
				target: @attr('templateTarget')
				currentTarget: @element
				clearContext: false
			}
			console.log(o)
			app.trigger(Main.RENDER_TEMPLATE, o)
