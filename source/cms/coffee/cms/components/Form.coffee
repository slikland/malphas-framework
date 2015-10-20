class components.Form extends BaseDOM
	@SELECTOR: 'form'
	constructor:()->
		super
		@element.on('submit', @_submit)
	destroy:()->
		
	addComponent:(component)->

	removeComponent:()->

	_submit:(e)=>
		e.stopPropagation()
		e.preventDefault()
		formData = new FormData(@element)
		app.serviceController.call({url: @attr('action'), data: formData, onComplete: @_submitComplete, onError: @_submitError})
	_submitComplete:()=>
		@element.reset?()
	_submitError:()=>
