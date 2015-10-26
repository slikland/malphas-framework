class components.Pagination extends BaseDOM
	@SELECTOR: '.pagination'
	constructor:()->
		super
		@templateNode = @element.templateNode

		console.log(@templateNode)
	destroy:()->
		@removeAll()
		@off()
		
	update:(values)->
		values

	_updateTarget:()=>
		if !@_target
			@_target = document.getElementById(@attr('for'))?.getInstance()
		
		if !@_target
			return
		@_target.update({'_index': @_value})
