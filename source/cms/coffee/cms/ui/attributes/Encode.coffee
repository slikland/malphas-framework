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
			@_element.on('cleanup', @_cleanup, true)
			@_element.setAttribute('rawname', @_element.name)
		destroy:()->
			super
		_submit:()=>
			@submit()
		submit:()->
			@_cleanup()
			@_tempElement = @_element.cloneNode(true)
			@_element.name = ''
			@_tempElement.style.display = 'none'

			@_element.parentNode.appendChild(@_tempElement)
			if @_element.value.trim().length == 0
				@_tempElement.value = ''
			else
				@_tempElement.value = slikland.crypt.Philo.encode(@_element.value)
			@_tempElement.rawValue = @_element.value
		_cleanup:()=>

			clearTimeout(@_element.name)
			@_element.rawValue = @_element.value
			if @_tempElement
				@_tempElement.rawValue = @_element.value
				@_tempElement.parentNode?.removeChild(@_tempElement)
				@_element.name = @_tempElement.name
				@_tempElement = null
