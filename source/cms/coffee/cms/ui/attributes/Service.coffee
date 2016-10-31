#namespace cms.ui.tag.sattributes
class Service extends cms.ui.Base
	@SELECTOR: '[service]'
	_update:(data)->
		for item in data.add
			if item.hasAttribute('service')
				@_plugins[item] = new Plugin(item)

		for item in data.remove
			p = @_plugins[item]
			if p
				p.destroy?()

	class Plugin extends BaseDOM
		@_destroyPlugin:(item)->

		constructor:(element)->
			super({element: element})
			setTimeout(@_loadService, 1)
		_loadService:()=>

			data = @_parseData()

			API.call(@_element.getAttribute('service'), null, @_serviceLoaded)
		_parseData:()=>
			if @attr('id')
				id = @attr('id')
				items = document.querySelectorAll('[for=' + id + ']')
		_serviceLoaded:(e, data)=>
			app.template.renderBlock(@_element, data)
