class Blocker extends BaseDOM
	constructor:()->
		super({element: 'div', className: 'blocker'})
		@css({display: 'none'})

	show:(showLoader = true)->
		if !@element.parentNode
			document.body.appendChild(@element)
		@css({display: 'block'})

	hide:()->
		@css({display: 'none'})
