class Notification extends EventDispatcher

	@DEFAULT_TIMEOUT: 4

	constructor:()->
		super
	destroy:()->


	showNotifications:(items)=>
		items = [].concat(items)
		i = items.length
		for item in items
			if item['delay']?
				setTimeout(@showNotification, item['delay'] * 1000, item)
			else
				@showNotification(item)
	showNotification:(item)=>
		if typeof(item) == 'string'
			if item.length == 0
				return
		else if !item.message?
			return
		else if item.message.length == 0
			return
		target = document.querySelector('notification')
		if !target
			target = document.body
		if !target.getInstance?()
			target = new BaseDOM({element: target})
		else
			target = target.getInstance()
		item = new NotificationItem(item)
		target.appendChildAt(item)
		item.element.scrollIntoView()

	_showNotification:(e, data)=>
		data = [].concat(data)
		# for item in data
		# 	console.log(item)

	_hideNotification:(e, data)=>


	class NotificationItem extends BaseDOM
		constructor:(data)->
			super({element: 'div', className: 'notification-item show-down'})
			if typeof(data) == 'string'
				data = {message: data}
			if data['message']
				@text = data['message']
			if data['type']
				@addClass('p' + data['type'])
			else
				@addClass('p3')

			@timeout = Notification.DEFAULT_TIMEOUT
			if data['timeout']
				@timeout = Number(data['timeout'])
			if @timeout > 0
				@_closeTimeout = setTimeout(@_hideNotification, @timeout * 1000)
			@closeBtn = new BaseDOM({element: 'i', className: 'closeBtn fa fa-close'})
			@closeBtn.element.on('click', @_closeClick)
			@appendChild(@closeBtn)
		_hideNotification:()=>
			@_hide()
		_hide:()->
			clearTimeout(@_closeTimeout)
			@element.parentNode.removeChild(@element)
			@destroy?()

		_closeClick:(e)=>
			@_hide()
