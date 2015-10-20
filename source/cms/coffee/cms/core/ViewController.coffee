class ViewController
	@getInstance:()=>
		@_instance ?= new @(arguments...)
	
	constructor:()->

	getInterface:()->
		API.call({url: 'index/view', onComplete: @_interfaceLoadComplete})
	_interfaceLoadComplete:(e, data)=>
		if data.__view
			@renderView(data.__view, data.data)

	renderView:(template, data, target = document.body)->
		console.log(data)
		Template.renderTemplate('index', template, target, data)
		app.componentController.parse()

	goto:(path)->
		app.router.goto(path)
