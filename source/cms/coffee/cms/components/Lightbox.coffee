#namespace components

class Lightbox extends BaseDOM
	@SELECTOR: '.lightbox'
	constructor:()->
		super
		@_enabled = true
		@element.on('click', @_click)
		
	destroy:()->
		
	enable:(enabled = true)->
	
	_close:(e)=>
		document.body.removeChild(@_addLightbox)
	_click:(e)=>
		@_addLightbox = new BaseDOM({className: "bg-lightbox"})
		document.body.appendChild(@_addLightbox)

		W = parseInt(@attr('w'))
		H = parseInt(@attr('h'))
		image = @attr('open')
		console.log image

		windowsW = window.innerWidth
		windowsH = window.innerHeight

		top = (windowsH - H) / 2
		left = (windowsW - W) / 2

		@_bgImage = new BaseDOM({className: "image-lightbox"})
		@_bgImage.element.style.top = top+'px'
		@_bgImage.element.style.left = left+'px'
		@_addLightbox.appendChild(@_bgImage)

		@_addImage = new BaseDOM({element:"img"})
		@_addImage.attr("width",W+'px')
		@_addImage.attr("height",H+'px')
		@_addImage.element.src = image
		@_bgImage.appendChild(@_addImage)

		@_addDivClose = new BaseDOM({className: "closed"})
		@_bgImage.appendChild(@_addDivClose)
		

		@_addClose = new BaseDOM({element:"i",className: "fa fa-circle fa-2x"})
		@_addClose.css({
			'position': 'absolute'
			'left': '0px'
			'top': '0px'
		})
		@_addDivClose.appendChild(@_addClose)

		@_addSecondClose = new BaseDOM({element:"i",className: "fa fa-times"})
		@_addSecondClose.css({
			'position': 'absolute'
			'left': '7px'
			'top': '7px'
			'color': '#FFFFFF'
		})
		@_addDivClose.appendChild(@_addSecondClose)

		@_addDivClose?.element.on('click', @_close)
		
