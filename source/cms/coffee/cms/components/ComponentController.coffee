class ComponentController
	@getInstance:()=>
		@_instance ?= new @(arguments...)
	constructor:(target = document.body)->
		# target.
	addComponent:(component)->

	removeComponent:()->