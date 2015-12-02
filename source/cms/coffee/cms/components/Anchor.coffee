class components.Anchor extends BaseDOM
	@SELECTOR: 'a[href],button[href]'
	@ORDER: 0
	constructor:()->
		super
		href = @attr('href')
		if !href || href.length == 0
			@element.removeAttribute('href')
			return
		@element.on('click', @_click)
	destroy:()->
		@removeAll()
		@off()
		@element.off('click', @_click)
	_click:(e)=>
		href = @attr('href')
		if @attr('confirm')
			if !confirm(@attr('confirm'))
				e.stopPropagation()
				e.preventDefault()
				return
		if href && /^javascript:/.test(href)
			e.stopPropagation()
			e.preventDefault()
			return
		if !href || /^http/i.test(href) || /blank/i.test(@attr('target')?.toLowerCase() || '')
			if @element.tagName.toLowerCase() == 'button'
				window.open(href, @attr('target'))
			return
		e.stopPropagation()
		e.preventDefault()
		app.viewController.goto(href)