class components.ImageGrid extends BaseDOM
	@SELECTOR: '.image-grid'
	constructor:()->
		super
		@css('position', 'relative')
		@_templateNode = @element.templateNode
		@_checkAttributes()
		@_buildGrid()
		@_addEventListeners()
		@_selection = new Selection()
		@_selection.on(Selection.SELECTED, @_add)
		@appendChild(@_selection)
		@_resize()

	destroy:()->

	_add:(e, data)=>
		href = @attr('addAction')
		attrs = []
		for k, v of data
			attrs.push(k + '=' + v)
		href += '?' + attrs.join('&')
		app.viewController.goto(href)
	_edit:(e, data)=>
		href = @attr('editAction')
		href += data
		app.viewController.goto(href)
	_remove:(e, data)=>
		if @attr('removeConfirm')
			if !window.confirm(@attr('removeConfirm'))
				return
		href = @attr('removeAction')
		href += data
		app.viewController.goto(href)
	_edit:(e, data)=>
		href = @attr('editAction')
		app.viewController.goto(href)

	_addEventListeners:()->
		@element.on('mousedown', @_mouseDown)
	_removeEventListeners:()->
		@element.off('mousedown', @_mouseDown)

	_addDragEventListeners:()->
		window.addEventListener('mousemove', @_mouseMove)
		window.addEventListener('mouseup', @_mouseUp)
	_removeDragEventListeners:()->
		window.removeEventListener('mousemove', @_mouseMove)
		window.removeEventListener('mouseup', @_mouseUp)

	_updateSelection:(showSelection = false)=>
		ix = (@_initPosition[0] / @_itemWidth) >> 0
		iy = (@_initPosition[1] / @_itemHeight) >> 0
		ex = (@_endPosition[0] / @_itemWidth) >> 0
		ey = (@_endPosition[1] / @_itemHeight) >> 0

		if ix < 0
			ix = 0
		if ix >= @_numCols - 1
			ix = @_numCols - 1
		if ex < 0
			ex = 0
		if ex >= @_numCols - 1
			ex = @_numCols - 1
		if iy < 0
			iy = 0
		if iy >= @_numRows - 1
			iy = @_numRows - 1
		if ey < 0
			ey = 0
		if ey >= @_numRows - 1
			ey = @_numRows - 1

		dx = ex - ix
		dy = ey - iy
		if dx == 0
			dx = 0.1
		if dy == 0
			dy = 0.1

		i = @_grid.length
		while i-- > 0
			gridItem = @_grid[i]
			gx = (gridItem.x - ix) / dx
			gy = (gridItem.y - iy) / dy
			# gridItem.selected = (gx >= 0 && gx <= 1) && (gy >= 0 && gy <= 1)

		# if showSelection
		@_showSelection(ix, iy, ex, ey)
	_getCoordinates:(x, y)->
		x = (x / @_itemWidth) >> 0
		y = (y / @_itemHeight) >> 0
		return [x, y]

	_showSelection:(ix, iy, ex, ey)->
		minX = Math.min(ix, ex)
		minY = Math.min(iy, ey)
		maxX = Math.max(ix, ex)
		maxY = Math.max(iy, ey)
		dx = maxX - minX
		dy = maxY - minY
		dx += 1
		dy += 1
		@_selection.show(minX, minY, minX + dx, minY + dy)
	_hideSelection:()->
		@_selection.hide()


	_mouseDown:(e)=>
		@_hideSelection()
		b = @getBounds()
		p = [e.pageX - b.left, e.pageY - b.top]
		[x, y] = @_getCoordinates(p[0], p[1])
		console.log(@_findGridItem(x, y).hasData)
		if @_findGridItem(x, y).hasData
			return
		@_initPosition = p
		@_endPosition = p
		@_addDragEventListeners()
		@_updateSelection()


	_mouseUp:(e)=>
		b = @getBounds()
		p = [e.pageX - b.left, e.pageY - b.top]
		@_endPosition = p
		@_updateSelection(true)
		@_removeDragEventListeners()

	_mouseMove:(e)=>
		b = @getBounds()
		p = [e.pageX - b.left, e.pageY - b.top]
		@_endPosition = p
		@_updateSelection()
		

	_checkAttributes:()->
		if @attr('cols')
			@_numCols = Number(@attr('cols'))
		else
			throw new Error('No columns defined')

		if @attr('rows')
			@_numRows = Number(@attr('rows'))
		else
			throw new Error('No rows defined')

		if @attr('width')
			@_contentWidth = Number(@attr('width'))

		if @attr('height')
			@_contentHeigh = Number(@attr('height'))

		if @_contentWidth && @_contentHeigh
			@_fixedSize = true
		else
			window.addEventListener('resize', @_resize)
		@_resize()

	_resize:()=>
		if !@_fixedSize
			@_contentWidth = @width
			@_contentHeight = @height
		if @_contentHeight < 100
			@_itemWidth = 100
			@_itemHeight = 100
		else
			@_itemWidth = @_contentWidth / @_numCols
			@_itemHeight = @_contentHeight / @_numRows

		@_selection?.setSizes(@_itemWidth, @_itemHeight)

		w = @_itemWidth * @_numCols
		h = @_itemHeight * @_numRows
		@css({
			width: w + 'px'
			height: h + 'px'
		})

	_buildGrid:()=>
		@_grid = []
		i = @_numCols
		c = 0
		while i-- > 0
			j = @_numRows
			while j-- > 0
				item = new GridItem()
				item.position(i, j)
				item.updateSize(@_itemWidth, @_itemHeight)
				item.on(GridItem.EDIT, @_edit)
				item.on(GridItem.REMOVE, @_remove)
				@appendChild(item)
				@_grid[c++] = item

		if @_templateNode?.data?
			@_items = @_templateNode.data
			i = @_items.length
			while i-- > 0
				item = @_items[i]
				x = item.x
				y = item.y
				gridItem = @_findGridItem(item.x, item.y)
				gridItem.setData(item)
				w = item.w
				h = item.h
				px = -1
				while ++px < w
					py = -1
					while ++py < h
						if !(px == 0 && py == 0)
							@_findGridItem(px + x, py + y).hide()
	_findGridItem:(x, y)->
		i = @_grid.length
		while i-- > 0
			if @_grid[i].x == x && @_grid[i].y == y
				return @_grid[i]

	class GridItem extends BaseDOM
		@EDIT: 'gridItem_edit'
		@REMOVE: 'gridItem_remove'
		constructor:()->
			super
			@_selected = false
			@addClass('item')
			@_w = 1
			@_h = 1
		@get x:()->
			return @_x
		@get y:()->
			return @_y

		@get hasData:()->
			return @_data?
		_redraw:()->
			@css({
				'width': @_width * @_w + 1 + 'px'
				'height': @_height * @_h + 1 + 'px'
				'left': @_x * @_width + 'px'
				'top': @_y * @_height + 'px'
			})
		setData:(data)->

			@_data = data
			if @_data?
				@_w = data.w
				@_h = data.h
				@addClass('hasData')
				@css({
					'background-image': 'url('+data.thumb+')'
				})
				if !@_edit
					@_edit = new BaseDOM({className: 'edit'})
					@_editIcon = new BaseDOM({element: 'i', 'className': 'icon edit-icon'})
					@_editIcon.element.on('mousedown', @_editClick)
					@_removeIcon = new BaseDOM({element: 'i', 'className': 'icon remove-icon'})
					@_removeIcon.element.on('mousedown', @_removeClick)
					@_edit.appendChild(@_editIcon)
					@_edit.appendChild(@_removeIcon)
				@appendChild(@_edit)
			@_redraw()

		_editClick:(e)=>
			@trigger(GridItem.EDIT, @_data.id)
			e.preventDefault()
			e.stopImmediatePropagation()
		_removeClick:(e)=>
			@trigger(GridItem.REMOVE, @_data.id)
			e.preventDefault()
			e.stopImmediatePropagation()
		updateSize:(w, h)->
			@_width = w
			@_height = h
			@_redraw()
		position:(x, y)->
			@_x = x
			@_y = y
			@_redraw()
		hide:()->
			@_data = {}
			@addClass('hide')

		show:(data = null)->
			@removeClass('hide')
			@_data = data
	class Selection extends BaseDOM
		@SELECTED: 'selection_selected'
		constructor:()->
			super
			@addClass('selection')
			@_addIcon = new BaseDOM({element: 'i', className: 'add-icon'})
			@_addIcon.element.on('mousedown', @_addClick)
			@appendChild(@_addIcon)
			@hide()
		setSizes:(itemWidth, itemHeight)->
			@_itemWidth = itemWidth
			@_itemHeight = itemHeight
		show:(ix, iy, ex, ey)->
			@_x = ix
			@_y = iy
			@_w = ex - ix
			@_h = ey - iy
			@css({
				left: ix * @_itemWidth + 'px'
				top: iy * @_itemHeight + 'px'
				width: (ex - ix) * @_itemWidth + 1 + 'px'
				height: (ey - iy) * @_itemHeight + 1 + 'px'
			})
			@removeClass('hide')
		hide:()->
			@addClass('hide')

		_addClick:(e)=>
			@trigger(Selection.SELECTED, {x: @_x, y: @_y, w: @_w, h: @_h})
			e.preventDefault()
			e.stopImmediatePropagation()