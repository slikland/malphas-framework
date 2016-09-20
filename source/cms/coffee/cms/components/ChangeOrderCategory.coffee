class components.ChangeOrderCategory extends BaseDOM
	@SELECTOR: '.changeOrderCategory'
	@ORDER: 0
	constructor:()->
		super
		# console.log(@SELECTOR);
		
		# @element.on("change", @_update)
		@_update()

		
		# window.setTimeout("@_update()", 5000);
		
	destroy:()->

	_update:()=>

		changeOrderCategory()


	_checkAttributes:()->
		