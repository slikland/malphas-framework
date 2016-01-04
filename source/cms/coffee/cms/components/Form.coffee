class components.Form extends BaseDOM
	@SELECTOR: 'form'
	constructor:()->
		super
		@element.on('submit', @_submit)
	destroy:()->
		@element.on('submit', @_submit)
		@removeAll()
		@off()
		
	addComponent:(component)->

	removeComponent:()->

	_submit:(e)=>
		e.stopPropagation()
		e.preventDefault()


		@_checkConditions()

		formData = new FormData(@element)

		app.serviceController.call({url: @attr('action'), data: formData, onComplete: @_submitComplete, onError: @_submitError})
	_checkConditions:()=>
		@_removedEditable = []
		submitIfs = @findAll('[submitif]')
		for item in submitIfs
			chk = item.querySelector(item.getAttribute('submitif'))
			if !chk.checked
				@_removedEditable.push({item: item, parent: item.parentNode, index: @_getItemIndex(item)})
				item.parentNode.removeChild(item)

	_getItemIndex:(item)->
		childs = item.parentNode.childNodes
		i = childs.length
		while i-- > 0
			if childs[i] == item
				return i

	_appendChildAt:(item, parent, index)->
		childs = parent.childNodes
		if childs.length >= index
			parent.appendChild(item)
		else
			parent.insertBefore(item, childs[index])


	_restoreConditions:()=>
		if @_removedEditable
			for item in @_removedEditable
				@_appendChildAt(item.item, item.parent, item.index)
		@_removedEditable = []

	_submitComplete:()=>
		@_restoreConditions()
		@element.reset?()
	_submitError:(e, data)=>
		@_restoreConditions()
		@_clearErrors()
		if !data
			app.notification.showNotifications({message: "Unknown error occured.", 'type': 1});
			return
		switch data?.code
			when 101
				@_showErrors(data.data)

	_clearErrors:()->
		fields = @findAll(components.Field.SELECTOR, true)
		for field in fields
			field.clearError()
		items = @findAll(components.Input.SELECTOR, true)
		for item in items
			item.clearError()
	_showErrors:(items)=>
		for item in items
			fields = [].concat(item.field)
			for field in fields
				input = @find('[name="'+field+'"]')
				input?.getInstance()?.showError(item.message)
