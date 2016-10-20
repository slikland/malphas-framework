#namespace components

class Masked extends BaseDOM
	@SELECTOR: '.mask'
	@ORDER: 0
	constructor:()->
		super
		
		$(".mask").mask("99/99/9999")

	destroy:()->