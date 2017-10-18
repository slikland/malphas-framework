#namespace cms.ui.tags
#import slikland.utils.MouseUtils
class Pagination extends cms.ui.Base
	@SELECTOR: 'pagination'
	_update:(data)->
		for item in data.add
			@_plugins[item] = new Plugin(item)
			

		for item in data.remove
			p = @_plugins[item]
			if p
				p.destroy?()

	class Plugin extends BaseDOM
		@_destroyPlugin:(item)->

		constructor:(element)->
			super({element: element})
			@_page = 0

			@_pages = []

			@_pageWrapper = new BaseDOM({element: 'div', className: 'wrapper'})
			@_pageContainer = new BaseDOM({element:'div', className: 'page-container'})
			@_shadowLeft = new BaseDOM({element: 'span', className: 'shadow-left'})
			@_shadowRight = new BaseDOM({element: 'span', className: 'shadow-right'})

			@_first = new BaseDOM({element: 'a', className: 'arrow first'})
			@_prev = new BaseDOM({element: 'a', className: 'arrow prev'})
			@_next = new BaseDOM({element: 'a', className: 'arrow next'})
			@_last = new BaseDOM({element: 'a', className: 'arrow last'})

			@_first.element.on('click', @_firstClick)
			@_prev.element.on('click', @_prevClick)
			@_next.element.on('click', @_nextClick)
			@_last.element.on('click', @_lastClick)

			@_first.html = '<i />'
			@_prev.html = '<i />'
			@_next.html = '<i />'
			@_last.html = '<i />'

			@_pageWrapper.appendChild(@_pageContainer)
			@_pageWrapper.appendChild(@_shadowLeft)
			@_pageWrapper.appendChild(@_shadowRight)

			@appendChild(@_first)
			@appendChild(@_prev)
			
			@appendChild(@_pageWrapper)

			@appendChild(@_next)
			@appendChild(@_last)
			
			@_pageContainer.element.on('mousedown', @_pageMouseDown)

			@_setItemValue()
			if @attr('numItems')
				@element['numItems'] = @attr('numItems')

			@_element.on('update', @_update)


		@get page:()->
			return @_page
		@set page:(value)->
			if value >= @_total - 1
				value = @_total - 1
				@_last.attr('disabled', '1')
				@_next.attr('disabled', '1')
			else
				@_last.element.removeAttribute('disabled')
				@_next.element.removeAttribute('disabled')
			if value <= 0
				value = 0
				@_first.attr('disabled', '1')
				@_prev.attr('disabled', '1')
			else
				@_first.element.removeAttribute('disabled')
				@_prev.element.removeAttribute('disabled')
			changed = false
			if @_page != value
				changed = true
			@_page = value
			@_element.index = @_page * @_numItems
			@_element.numItems = @_numItems
			KTween.remove(@)
			page = @_pages[@_page]
			if !page
				return

			i = @_pages.length
			while i-- > 0
				if i == @_page
					@_pages[i].className = 'hover'
				else
					@_pages[i].className = ''

			pBounds = @_pageContainer.getBounds()
			bounds = page.getBoundingClientRect()
			sl = @_pageContainer.element.scrollLeft
			p = (bounds.right + bounds.left) * 0.5 - pBounds.left + sl - pBounds.width * 0.25
			p = p / (@_pageContainer.element.scrollWidth - pBounds.width * 0.5)
			if p < 0
				p = 0
			else if p > 1
				p = 1

			sl = @_pageContainer.element.scrollLeft
			sw = @_pageContainer.element.scrollWidth
			if sw - pBounds.width < 1
				@_shadowLeft.css('width', 0)
				@_shadowRight.css('width', 0)
			else
				@_shadowLeft.css('width', (p * 2) + 'em')
				@_shadowRight.css('width', ((1 - p) * 2) + 'em')

			KTween.tween(@, {scrollPosition: p, onUpdate: @_test}, 'easeInOutQuart', 0.3)
			if changed
				@_target?.trigger('update')

		@get _target:()->
			return document.querySelector('#' + @attr('for'))

		@get total:()->
			return @_total

		@get scrollPosition:()->
			return @_pageContainer.element.scrollLeft / (@_pageContainer.element.scrollWidth - @_pageContainer.getBounds().width)
		@set scrollPosition:(value)->
			@_pageContainer.element.scrollLeft = (@_pageContainer.element.scrollWidth - @_pageContainer.getBounds().width) * value

		_setItemValue:()->
			id = @_element.getAttribute('for')
			data = app.router.getParam(id)
			if !data
				return
			if @attr('numItems')
				@_numItems = @attr('numItems')
			else if data['_numItems']
				@_numItems = data['_numItems']

			if data['_index']
				@page = @_page = data['_index'] / @_numItems
				@element['index'] = data['_index']
		_firstClick:()=>
			@page = 0

		_prevClick:()=>
			@page -= 1

		_nextClick:()=>
			@page += 1

		_lastClick:()=>
			@page = @total - 1

		_pageMouseDown:(e)=>
			@_seeking = false
			@_mousePos = MouseUtils.getMousePos(e)
			window.addEventListener('mouseup', @_mouseUp)
			window.addEventListener('mousemove', @_mouseMove)
			window.addEventListener('keydown', @_keyDown)
			@_startPageSeek(e)
			e.preventDefault()
		_keyDown:(e)=>
			if e.keyCode == 27
				@_cancelSeek()
		_mouseUp:()=>
			clearTimeout(@_pageSeekTimeout)
			@_stopPageSeek()
		_cancelSeek:()=>
			window.removeEventListener('mousemove', @_mouseMove)
			window.removeEventListener('mouseup', @_mouseUp)
			window.removeEventListener('keydown', @_keyDown)
			@removeClass('seeking')
			@_seeking = true
			@page = @_page

		_stopPageSeek:()=>
			window.removeEventListener('mousemove', @_mouseMove)
			window.removeEventListener('mouseup', @_mouseUp)
			window.removeEventListener('keydown', @_keyDown)
			@removeClass('seeking')
			@_seeking = true
			if @_closestItem
				@page = @_closestItem.index

		_startPageSeek:(e)=>
			@_pageSeekTimeout = setTimeout(@_setSeeking, 100)
			@_seeking = true
			@_mouseMove(e)
		_setSeeking:()=>
			@addClass('seeking')

		_mouseMove:(e)=>
			@_prevPos = @_mousePos
			@_mousePos = MouseUtils.getMousePos(e, false)
			if !@_seeking
				return
			if !@_prevPos
				return
			bounds = @_pageWrapper.getBounds()
			ePos = MouseUtils.toGlobal(bounds.left, bounds.top)
			pX = (@_prevPos[0] - ePos[0]) / bounds.width
			cX = (@_mousePos[0] - ePos[0]) / bounds.width
			if pX < 0
				pX = 0
			else if pX > 1
				pX = 1
			if cX < 0
				cX = 0
			else if cX > 1
				cX = 1
			x = pX
			dx = (cX - pX) * bounds.width
			sl = @_pageContainer.element.scrollLeft
			pw = @_pageContainer.element.scrollWidth
			if dx > 0
				x = 1 - x
				w = pw - sl - bounds.width * x
			else
				w = sl + bounds.width * x

			dx /= bounds.width * x
			px = sl + dx * w
			if px < 0
				px = 0
			else if px > pw - bounds.width
				px = pw - bounds.width

			@_pageContainer.element.scrollLeft += dx * w

			@_getClosest()
		_getClosest:()=>
			pos = [].concat(@_mousePos)
			pBounds = @_pageWrapper.getBounds()
			pPos = MouseUtils.toGlobal(pBounds.left, pBounds.top)
			pos = [pos[0] - pPos[0], pos[1] - pPos[1]]
			i = @_pages.length
			d = Number.MAX_VALUE
			closestItem = null
			while i-- > 0
				item = @_pages[i]
				b = item.getBoundingClientRect()
				cx = (b.right + b.left) * 0.5 - pBounds.left
				dx = cx - pos[0]
				dx *= dx
				item.className = ''
				if dx < d
					d = dx
					closestItem = item
			if closestItem
				closestItem.className = 'hover'
				@_closestItem = closestItem

		_update:(e)=>
			data = e.data
			if data.pagination
				data = data.pagination
			if !data || !data._total? || !data._numItems?
				return
			data.index = data._index
			data.total = data._total
			data.numItems = data._numItems
			@_pageContainer.removeAll()
			@_pages.length = 0

			l = Math.ceil(data.total / data.numItems)
			@_total = l
			@_numItems = data.numItems
			if @_total == 0
				@css('display', 'none')
			else
				@css('display', '')

			i = -1
			while ++i < l
				page = document.createElement('a')
				page.innerHTML = (i + 1)
				page.index = i
				@_pageContainer.appendChild(page)
				@_pages[i] = page


			@page = @_page = Math.floor(data.index / data.numItems)