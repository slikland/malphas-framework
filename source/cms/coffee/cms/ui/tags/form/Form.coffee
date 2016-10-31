#namespace cms.ui.tags.form
#import slikland.loader.API
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
			@_api = new API(@_element)
			@_api.on(API.COMPLETE, @_apiComplete)
			@_api.on(API.ERROR, @_apiError)
			@_element.on('submit', @_submit)
			@_element.on('change', @_change)
		_change:()=>
			@_clearMessage()
		_submit:(e)=>
			if e.defaultPrevented
				e.stopImmediatePropagation()
				return
			e.preventDefault()

		_apiComplete:()=>
			@_element.reset()
			success = @attr('success')
			if success && success.length > 0
				switch success
					when 'refresh'
						app.interface.show()
					when 'reload'
						window.location.reload()
					else
						app.interface.show(success)

		_apiError:(e, data)=>
			@_showMessage(data?.message)
		_showMessage:(message, type = 1)->
			if !@_messageField
				if !message || message.length == 0
					return
				fields = @findAll('validation message')
				i = fields.length
				validationMessagesFields = []
				while i-- > 0
					validationMessagesFields[i] = fields[i]
				messageFields = @findAll('message')
				messages = []
				for field in messageFields
					if validationMessagesFields.indexOf(field) < 0
						messages.push(field)
				if messages.length > 0
					@_messageField = messages[0]

				if !@_messageField
					@_messageField = document.createElement('message')
					@appendChildAt(@_messageField, 0)
			@_messageField.innerHTML = message

		_clearMessage:()=>
			@_showMessage('')