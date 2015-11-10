class Resizer extends EventDispatcher
	@getInstance:()=>
		@_instance ?= new @(arguments...)
	constructor:()->
		super
		window.addEventListener('resize', @_resize)

	_resize:()=>
		# @width = @
		@trigger('resize')