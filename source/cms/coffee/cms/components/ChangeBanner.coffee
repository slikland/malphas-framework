class components.ChangeBanner extends BaseDOM
	@SELECTOR: '.changeSelect'
	@ORDER: 0
	constructor:()->
		super
		# console.log(@SELECTOR);
		$(".changed1").css("display":"none")
		$(".changed2").css("display":"none")
		@element.on("change", @_update)
		@_update()

		
		# window.setTimeout("@_update()", 5000);
		
	destroy:()->

	_update:()=>

		text = parseInt($(@element).val())
		if(text == 2)
			$(".changed2").css("display":"block")
			$(".changed1").css("display":"none")

		if(text == 1)
			$(".changed1").css("display":"block")
			$(".changed2").css("display":"none")

	


	_checkAttributes:()->
		