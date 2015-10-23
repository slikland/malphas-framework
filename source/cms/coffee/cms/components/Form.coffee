class components.Form extends BaseDOM
	@SELECTOR: 'form'
	constructor:()->
		super
		console.log(@element)
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
		console.log(formData)
		console.log(@element)
		app.serviceController.call({url: @attr('action'), data: formData, onComplete: @_submitComplete, onError: @_submitError})
	_submitComplete:()=>
		@element.reset?()
	_submitError:()=>
