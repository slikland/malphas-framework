class components.Pagination extends BaseDOM
	@SELECTOR: '.pagination'
	@NUM_VISIBLE_PAGES: 15
	constructor:()->
		super
		@_templateNode = @element.templateNode
		@_pageTemplate = @_templateNode.find('button', {'class': 'page'})

		@_currentPage = 0

		setTimeout(@_create, 0)
	_create:()=>
		@_prevBtn = @find('.prev', true)
		@_nextBtn = @find('.next', true)
		@_firstBtn = @find('.first', true)
		@_lastBtn = @find('.last', true)
		@_prevBtn?.element.on('click', @_prevClick)
		@_nextBtn?.element.on('click', @_nextClick)
		@_firstBtn?.element.on('click', @_firstClick)
		@_lastBtn?.element.on('click', @_lastClick)

		@_pagesContainer = new BaseDOM({element: 'span'})
		@_nextBtn?.element.parentNode.insertBefore(@_pagesContainer.element, @_nextBtn?.element)
		@update(@_templateNode.data)

	destroy:()->
		@removeAll()
		@off()
		
	update:(data)->
		@_total = data.total
		@_numItems = data.numItems
		@_currentPage = data.index / @_numItems
		@_totalPages = Math.ceil(@_total / @_numItems)

		@goto(@_currentPage)

	goto:(page)->
		
		if page >= @_totalPages - 1
			page = @_totalPages - 1
			@_nextBtn?.enable(false)
			@_lastBtn?.enable(false)
		else
			@_nextBtn?.enable(true)
			@_lastBtn?.enable(true)
		if page <= 0
			page = 0
			@_prevBtn?.enable(false)
			@_firstBtn?.enable(false)
		else
			@_prevBtn?.enable(true)
			@_firstBtn?.enable(true)

		if @_currentPage != page
			@_currentPage = page
			@_updateTarget()
		@_buildPages()
	_buildPages:()->
		@_clear()

		halfPages = (Pagination.NUM_VISIBLE_PAGES >> 1)
		init = @_currentPage - halfPages
		if init + Pagination.NUM_VISIBLE_PAGES >= @_totalPages
			init = @_totalPages - Pagination.NUM_VISIBLE_PAGES
		if init < 0
			init = 0
		end = init + Pagination.NUM_VISIBLE_PAGES
		if end >= @_totalPages
			end = @_totalPages
		for page in [init...end]
			item = @_pageTemplate.render(@_pagesContainer.element, {page: (page + 1).toString()}, null, true)
			if item
				item = item.getInstance() || new BaseDOM({element: item})
				item.value = page
				if page == @_currentPage
					item.addClass('selected p3')
				else
					item.element.on('click', @_pageClick)

	_pageClick:(e)=>
		@goto(e.currentTarget.getInstance().value)

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

	_firstClick:()=>
		@goto(0)
	_lastClick:()=>
		@goto(@_totalPages - 1)

	_updateTarget:()=>
		if !@_target
			@_target = document.getElementById(@attr('for'))?.getInstance()
		
		if !@_target
			return
		@_target.update({'_index': @_currentPage * @_numItems})
