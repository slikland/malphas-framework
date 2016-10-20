#namespace cms.ui.tags.form
#import slikland.net.API
class Form extends cms.ui.Base
	@SELECTOR: 'form'
	_update:(data)->
		for item in data.add
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
			setTimeout(@_addListeners, 1)
		_addListeners:()=>
			@_element.on('submit', @_submit)
		_submit:(e)=>
			if e.defaultPrevented
				return
			if !@_api
				@_api = new API()
				console.log(@_api)
			e.preventDefault()
			console.log(2)
