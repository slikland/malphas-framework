#namespace cms.ui.tags.form
#import slikland.loader.API
class Form extends cms.ui.Base
	@SELECTOR: 'form'
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
			setTimeout(@_addListeners, 50)
		_addListeners:()=>
			@_api = new API(@_element)
			if !(@_element.getAttribute('target') && @_element.getAttribute('target').toLowerCase() == '_blank')
				@_api.on(API.START, @_apiStart)
				@_api.on(API.COMPLETE, @_apiComplete)
				@_api.on(API.ERROR, @_apiError)
			@_element.on('submit', @_submit)
			@_element.on('change', @_change)
			@_element.on('reset', @_reset)
			@_element.on('abort', @_abort)
		_abort:()=>
			@_api?.abort()
		_change:()=>
			@_clearMessage()

		_submit:(e)=>
			if @attr('target')?.toLowerCase?() == '_blank'
				data = @_api.parseJSON(@_element)
				if !@_dataElement
					@_dataElement = document.createElement('textarea')
					@_dataElement.name = '__data'
					@_dataElement.style.display = 'none'
					@appendChild(@_dataElement)
				@_dataElement.innerHTML = JSON.stringify(data)
			else
				# @_clearFieldMessages()
				if e.defaultPrevented
					e.stopImmediatePropagation()
					return
				e.preventDefault()
		_reset:()=>
			setTimeout(@_resetFields, 0)
		_resetFields:()=>
			items = @_element.querySelectorAll('[type=checkbox],[type=radio]')
			i = items.length
			while i-- > 0
				items[i].trigger('change')

		_apiStart:()=>
			

		_apiComplete:(e, data)=>
			@_element.reset()
			success = @attr('success')
			if success && success.length > 0
				if /\[[^\[\]]+\]/.exec(success)
					re = /\[([^\[\]]+)\]/g
					while o = re.exec(success)
						params = o[1].split(',')
						targets = [app]
						if params[1]
							targets = document.querySelectorAll(params[1])
						evt = params[0]
						params = params.splice(2)
						for target in targets
							target.trigger?.apply(target, [].concat(evt, params))

				else
					switch success
						when 'update'
							@_element.trigger('update')
						when 'refresh'
							app.interface.show()
						when 'reload'
							window.location.reload()
						else
							app.router.goto(success)
			if data?.notification?.message?.length > 0
				if !data.notification.type
					data.notification.type = 3
				app.notification.showNotification(data.notification)

		_apiError:(e, data)=>
			@_showMessage(data?.message)
			if Array.isArray(data.data)
				for item in data.data
					if item?.field
						@_showFieldMessage(item.field, item.message)
		_showFieldMessage:(fieldName, message, type = 1)->
			field = @find('[name="'+fieldName+'"]')?.findParents('field')

			if !field
				return
			if field.__instance__
				field = field.__instance__
			else
				return

			messageField = field.find('.validation-message')
			field.removeClass('valid')
			field.addClass('invalid')
			if !messageField
				messageField = new BaseDOM({element: 'div', className: 'validation-message'})
				field.appendChild(messageField)
			else
				if messageField.__instance__
					messageField = messageField.__instance__
				else
					messageField = new BaseDOM({element: messageField})
			messageField.css({display: ''})
			messageField.html = message
			messageField.element.scrollIntoView()

		_clearFieldMessages:()->
			fields = @findAll('field .validation-message')
			for field in fields
				if field.__instance__
					field = field.__instance__
				else
					field = new BaseDOM({element: field})
				field.css({display: 'none'})
				field.findParents('field').__instance__.removeClass('invalid')
				field.html = ''

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
			@_messageField.scrollIntoView()

		_clearMessage:()=>
			@_showMessage('')