class ViewController
	@getInstance:()=>
		@_instance ?= new @(arguments...)
	
	constructor:()->
		@_body = new BaseDOM({element: document.body})

	getInterface:(logged = false)->
		app.serviceController.call({url: 'index/view'})

	addView:(id, template)->
		Template.addTemplate(id, template)

	renderInterface:(id, template, data)->
		@addView('__interface', template)
		@renderView('__interface', data, @_body)
		main = document.querySelector('main')

		if main
			@_container = main.getInstance() || new BaseDOM({element: main})
		else
			@_container = null

	renderView:(id, data, target = null)->
		if !target
			target = @_container
		if !target
			return
		if target instanceof BaseDOM
			target.removeAll()
			target = target.element
		Template.renderTemplate(id, target, data)
		app.componentController.parse()

	goto:(path)->
		app.router.goto(path)
