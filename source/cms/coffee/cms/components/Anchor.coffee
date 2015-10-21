class components.Anchor extends BaseDOM
	@SELECTOR: 'a[href]'
	constructor:()->
		super
		href = @attr('href')
		if !href || href.length == 0
			@element.removeAttribute('href')
			return
		@element.on('click', @_click)
	_click:(e)=>
		href = @attr('href')
		if !href || /^http/i.test(href) || /blank/i.test(@attr('target')?.toLowerCase() || '')
			return
		e.stopPropagation()
		e.preventDefault()
		app.viewController.goto(href)