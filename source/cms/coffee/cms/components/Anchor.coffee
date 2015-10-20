class components.Anchor extends BaseDOM
	@SELECTOR: 'a[href]'
	constructor:()->
		super
		@element.on('click', @_click)
	_click:(e)=>
		href = @attr('href')
		if !href || /^http/i.test(href) || /blank/i.test(@attr('target')?.toLowerCase() || '')
			return
		e.stopPropagation()
		e.preventDefault()
		app.viewController.goto(href)