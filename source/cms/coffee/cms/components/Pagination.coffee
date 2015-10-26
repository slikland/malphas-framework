class components.Pagination extends BaseDOM
	@SELECTOR: '.pagination'
	@NUM_VISIBLE_PAGES: 15
	constructor:()->
		super
		@templateNode = @element.templateNode

		@_currentPage = 0

		setTimeout(@_create, 0)
	_create:()=>
		@_prevBtn = @find('.prev', true)
		@_nextBtn = @find('.next', true)
		@_prevBtn.element.on('click', @_prevClick)
		@_nextBtn.element.on('click', @_nextClick)

		@_pagesContainer = new BaseDOM({element: 'span'})
		@_nextBtn.element.parentNode.insertBefore(@_pagesContainer.element, @_nextBtn.element)
		@update(@templateNode.data)

	destroy:()->
		@removeAll()
		@off()
		
	update:(data)->
		@_total = data.total
		@_numItems = data.numItems
		@_currentPage = data.index / @_numItems

		@_buildPages()

		@goto(@_currentPage)

	goto:(page)->
		totalPages = Math.ceil(@_total / @_numItems)
		
		if page <= 0
			page = 0
			@_prevBtn.enable(false)
			@_prevBtn.removeClass('p3')
		else
			@_prevBtn.enable(true)
			@_prevBtn.addClass('p3')

		if page >= totalPages
			page = totalPages - 1
			@_nextBtn.enable(false)
			@_nextBtn.removeClass('p3')
		else
			@_nextBtn.enable(true)
			@_nextBtn.addClass('p3')
		if @_currentPage != page
			@_currentPage = page
			@_updateTarget()
	_buildPages:()->
		@_clear()



	_clear:()->
		items = @_pagesContainer.findAll('*', true)
		for item in items
			item.off?()
			item.destroy?()
		@_pagesContainer.removeAll()
	_prev:()->
		@goto(@_currentPage - 1)
	_next:()->
		@goto(@_currentPage + 1)

	_prevClick:()=>
		@_prev()
	_nextClick:()=>
		@_next()

	_updateTarget:()=>
		if !@_target
			@_target = document.getElementById(@attr('for'))?.getInstance()
		
		if !@_target
			return
		@_target.update({'_index': @_currentPage * @_numItems})
