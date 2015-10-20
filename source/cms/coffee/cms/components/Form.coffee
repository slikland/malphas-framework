class components.Form extends BaseDOM
	@SELECTOR: 'form'
	constructor:()->
		super
		console.log(@)
		@element.on('submit', @_submit)
	addComponent:(component)->

	removeComponent:()->

	_submit:(e)=>
		e.stopPropagation()
		e.preventDefault()
		formData = new FormData(@element)
		API.call({url: @attr('action'), data: formData})