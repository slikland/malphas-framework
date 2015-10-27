class components.Field extends BaseDOM
	@SELECTOR: 'field'
	constructor:()->
		super
		@element.on('submit', @_submit)
		@_name = @attr('name')
	@get name:()->
		return @_name
	@set name:(value)->
		@_name = value

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
		switch data?.code
			when 101
				@_showErrors(data.data)

	_showErrors:(items)=>


	clearError:()->
		@_errorContainer?.css('display', 'none')
		@_errorContainer?.html = ''

	showError:(error)->
		if !@_errorContainer
			@_errorContainer = new BaseDOM({element: 'div', className: 'p1 error-container'})
			item = @find(components.Input.SELECTOR)
			@element.insertBefore(@_errorContainer.element, item)
			# @appendChild(@_errorContainer)
		@_errorContainer.css('display', 'block')
		@_errorContainer.html += error + '<br>'
