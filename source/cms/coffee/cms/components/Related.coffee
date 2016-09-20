class components.Related extends BaseDOM
	@SELECTOR: '.changeRelated'
	@ORDER: 0
	constructor:()->
		super
		# console.log(@SELECTOR);
		
		@element.on("change", @_update)
		@_update()

		
		# window.setTimeout("@_update()", 5000);
		
	destroy:()->

	_update:()=>

		text = parseInt($(@element).val())
		if(text == 2)
			$(".selectedCategoryRelated").css("display":"block")
			$(".selectedNewsRelated").css("display":"none")
			$(".selectedYoutube").css("display":"none")

		if(text == 1)
			$(".selectedNewsRelated").css("display":"block")
			$(".selectedCategoryRelated").css("display":"none")
			$(".selectedYoutube").css("display":"none")

		if(text == 3)
			$(".selectedYoutube").css("display":"block")
			$(".selectedCategoryRelated").css("display":"none")
			$(".selectedNewsRelated").css("display":"none")

	


	_checkAttributes:()->
		