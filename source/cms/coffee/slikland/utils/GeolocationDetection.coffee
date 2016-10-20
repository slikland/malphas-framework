class GeolocationDetection extends EventDispatcher

	@COMPLETE: 'geolocation_complete'
	@ERROR: 'geolocation_error'

	isSearching: false

	@getInstance:()=>
		@_instance ?= new @(arguments...)

	constructor:()->
		super
		
	fetchPosition: ()->
		#avoid searching twice
		if @isSearching then return

		#check 
		if navigator.geolocation
			@isSearching = true
			navigator.geolocation.getCurrentPosition(@_success, @_error)
		else
			@_error('Geolocation is not supported for this Browser/OS version yet.')

	@get position:()->
		return @_position

	_success:(position)=>
		@_position = position
		@isSearching = false
		@trigger(Geolocation.COMPLETE, position)

	_error:(error)=>
		@isSearching = false
		@trigger(Geolocation.ERROR, error)
