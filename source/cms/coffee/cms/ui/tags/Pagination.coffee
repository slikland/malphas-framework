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
			@_element.on('update', @_update)

			@_pages = []

			@_pageWrapper = new BaseDOM({element: 'div', className: 'wrapper'})
			@_pageContainer = new BaseDOM({element:'div', className: 'page-container'})
			@_shadowLeft = new BaseDOM({element: 'span', className: 'shadow-left'})
			@_shadowRight = new BaseDOM({element: 'span', className: 'shadow-right'})

			@_first = new BaseDOM({element: 'a', className: 'arrow first'})
			@_prev = new BaseDOM({element: 'a', className: 'arrow prev'})
			@_next = new BaseDOM({element: 'a', className: 'arrow next'})
			@_last = new BaseDOM({element: 'a', className: 'arrow last'})
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
		_pageMouseDown:(e)=>
			@_seeking = false
			@_mousePos = null
			window.addEventListener('mouseup', @_mouseUp)
			window.addEventListener('mousemove', @_mouseMove)
			@_pageSeekTimeout = setTimeout(@_startPageSeek, 100)
			e.preventDefault()
		_mouseUp:()=>
			@_stopPageSeek()
			clearTimeout(@_pageSeekTimeout)
		_stopPageSeek:()=>
			window.removeEventListener('mousemove', @_mouseMove)
			window.removeEventListener('mouseup', @_mouseUp)
			@removeClass('seeking')
			@_seeking = true

		_startPageSeek:()=>
			@addClass('seeking')
			@_seeking = true
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


		_update:(e)=>
			data = e.data

			if !data || !data.total? || !data.numItems?
				return
			@_pageContainer.removeAll()
			@_pages.length = 0


			l = data.total / data.numItems
			l = 100
			i = -1
			while ++i < l
				page = document.createElement('a')
				page.innerHTML = (i + 1)
				@_pageContainer.appendChild(page)
				@_pages[i] = page