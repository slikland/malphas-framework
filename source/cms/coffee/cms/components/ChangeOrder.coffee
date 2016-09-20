class components.changeOrderActive extends BaseDOM
	@SELECTOR: '.changeOrderActive'
	@ORDER: 0
	constructor:()->
		super
		# console.log(@SELECTOR);
		
		# @element.on("change", @_update)
		@_update()

		
		# window.setTimeout("@_update()", 5000);
		
	destroy:()->

	_update:()=>

		changeOrder()
		changeOrderHome()
		changeOrderCategoryHome()


	_checkAttributes:()->
		