class components.DragOn extends BaseDOM
	@SELECTOR: '.dragBox'
	@ORDER: 0
	constructor:()->
		super
		# console.log(@SELECTOR);
		@_textBox = $(@element).find(".spotlightText")
		@_changeAlign = $(@element).find(".boxAlign")
		@_create()
		
		
		@_textBox.on("keyup", @_update)
		@_changeAlign.on("change", @_updateAlign)


		
		# window.setTimeout("@_update()", 5000);
		
	destroy:()->

	_update:()=>

		text = $(@_textBox).val()
		formatText = "<p>"+text.replace(/\r?\n/g,"<br />")+"</p>"
		$(@addContent).html(formatText)
		align = $(@_changeAlign).val()

		rectW = $(@addContent).width()
		rectH = $(@addContent).height()

		$(@addinputHeightDrag).val(rectW)
		$(@addinputWidthDrag).val(rectH)

		if(align == "right")
			@_updateAlign("left")
			@_updateAlign("right")

	_updateAlign:(e=false,plus=0)=>

		
		align = $(@_changeAlign).val()

		if(e == "right")
			align = "right"
		if(e == "left")
			align = "left"
		w = $(@element).find(".handle").width()
		if(align == "left")
			$(@element).find(".handle").css("left":"0px")

		if(align == "right")
			wD = $(@element).find(".dragdealer").width();
			mgLeft = (wD - w)+plus;
			$(@element).find(".handle").css("left":mgLeft+"px")
	_create:()=>

		topDrag = $(@_element).attr("topDrag")
		widthDrag = $(@_element).attr("widthDrag")
		heightDrag = $(@_element).attr("heightDrag")

		textRec = $(@_textBox).val()
		formatTextRec = "<p>"+textRec.replace(/,/g,"").replace('/ e /g',"").replace(/\n/g,"<br />")+"</p>"
		@addContent = document.createElement("div")
		$(@addContent).attr('class', 'handle')
		$(@addContent).html(formatTextRec)
		$(@element).find(".dragdealer").append(@addContent)

		@addinputTopDrag = document.createElement("input")
		$(@addinputTopDrag).attr('type', 'hidden')
		$(@addinputTopDrag).attr('name', 'topDrag')
		$(@addinputTopDrag).attr('class', 'topDrag')
		$(@addinputTopDrag).attr('value', topDrag)

		@addinputHeightDrag = document.createElement("input")
		$(@addinputHeightDrag).attr('type', 'hidden')
		$(@addinputHeightDrag).attr('name', 'widthDrag')
		$(@addinputHeightDrag).attr('class', 'widthDrag')
		$(@addinputHeightDrag).attr('value', widthDrag)

		@addinputWidthDrag = document.createElement("input")
		$(@addinputWidthDrag).attr('type', 'hidden')
		$(@addinputWidthDrag).attr('name', 'heightDrag')
		$(@addinputWidthDrag).attr('class', 'heightDrag')
		$(@addinputWidthDrag).attr('value', heightDrag)

		$(@element).append(@addinputTopDrag,@addinputHeightDrag,@addinputWidthDrag)
		dragOn(topDrag)

		@_searchTimeout = setTimeout(@_update, 300, {})


	_checkAttributes:()->
		