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
		formData = new FormData(@element)
		app.serviceController.call({url: @attr('action'), data: formData, onComplete: @_submitComplete, onError: @_submitError})
	_submitComplete:()=>
		@element.reset?()
	_submitError:(e, data)=>
		@_clearErrors()
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
			input = @find('[name="'+item.field+'"]')
			input.getInstance()?.showError(item.message)
