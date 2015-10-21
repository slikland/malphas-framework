class components.ActionButton extends BaseDOM
	@SELECTOR: 'button[action]'
	constructor:()->
		super
		console.log(@element)
		@element.on('click', @_click)
	_click:()=>
		app.serviceController.call({url: @attr('action')})
