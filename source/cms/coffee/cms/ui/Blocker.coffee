class Blocker extends BaseDOM
	constructor:()->
		super({element: 'div', className: 'blocker'})
		@css({display: 'none'})
		@element.on('transitionend', @_transitionEnd)
		@element.on('moztransitionend', @_transitionEnd)
		@element.on('otransitionend', @_transitionEnd)
		@element.on('webkittransitionend', @_transitionEnd)
		@_showing = false

	show:(showLoader = true)->
		@_showing = true
		if !@element.parentNode
			document.body.appendChild(@element)
		@css({display: 'block'})
		@addClass('show')

	hide:()->
		@_showing = false
		# @css({display: 'none'})
		@removeClass('show')
	_transitionEnd:()=>
		if !@_showing
			@css({display: 'none'})
