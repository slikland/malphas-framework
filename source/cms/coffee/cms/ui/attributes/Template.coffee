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
			clearContext = false
			if @attr('templateClearContext')
				clear = @attr('templateClearContext')
				if clear == 'true' or clear == 1 or clear is true
					clearContext = true
			o = {
				template: @_template
				target: @attr('templateTarget')
				currentTarget: @element
				clearContext: clearContext
			}
			app.trigger(Main.RENDER_TEMPLATE, o)
