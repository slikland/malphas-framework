#namespace cms.ui.tag.attributes
#import slikland.crypt.Philo

class Encode extends cms.ui.Base
	@SELECTOR: '[encode]'
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
			@_form = @findParents('form')
			@_form.on('submit', @_submit, true)
		destroy:()->
			super
		_submit:()=>
			@submit()
		submit:()->
			console.log("SUBMITT")
			@_cleanup()
			@_tempElement = @_element.cloneNode(true)
			@_element.name = ''
			@_tempElement.style.display = 'none'
			@_element.parentNode.appendChild(@_tempElement)
			@_tempElement.value = slikland.crypt.Philo.encode(@_element.value)
		_cleanup:()=>
			clearTimeout(@_cleanupTimeout)
			if @_tempElement
				@_tempElement.parentNode?.removeChild(@_tempElement)
				@_element.name = @_tempElement.name
				@_tempElement = null
