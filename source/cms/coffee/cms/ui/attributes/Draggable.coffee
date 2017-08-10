#namespace cms.ui.tag.attributes
#import slikland.utils.MouseUtils
class Draggable extends cms.ui.Base
	@SELECTOR: '[draggable]'
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
			@_draggableName = @attr('draggable')
			@_dragHandler = document.createElement('i')
			@_dragHandler.className = 'drag-handle fa fa-ellipsis-h'
			@_dragHandler.on('mousedown', @_mouseDown)
			@_draggableContextSelector = '[draggableContext="'+@_draggableName+'"]'
			@appendChild(@_dragHandler)
			@_parentContexts = @_findParentContext()
			if @_parentContexts.length == 0
				@_parentContexts = [element.parentNode]
			@_setupDraggables()
			@_getDraggableItems()
		_findParentContext:(target = null)=>
			contexts = document.body.querySelectorAll(@_draggableContextSelector)
			parentContexts = []
			i = contexts.length
			while i-- > 0
				if !contexts[i].findParents(@_draggableContextSelector)
					parentContexts.push(contexts[i])
			return parentContexts
		_addEventListeners:()->
			window.addEventListener('mousemove', @_mouseMove)
			window.addEventListener('mouseup', @_mouseUp)
			window.addEventListener('mouseleave', @_mouseLeave)
		_removeEventListeners:()->
			window.removeEventListener('mousemove', @_mouseMove)
			window.removeEventListener('mouseup', @_mouseUp)
			window.removeEventListener('mouseleave', @_mouseLeave)
		_drop:()->
			@_items = null
			@_removeEventListeners()
			@_cloned.parentNode.removeChild(@_cloned)
			@_element.style.opacity = ''
			@element.trigger('update')
		_mouseDown:(e)=>
			@_updateDraggableItems()
			e.preventDefault()
			@_cloned = @_element.cloneNode(true)
			@_cloned.setAttribute('cloned', '1')
			@_cloned.style.position = 'absolute'
			@_cloned.style.opacity = '0.4'

			handleOffset = @getBounds(@_dragHandler)
			@_elOffset = {
				x: e.offsetX - handleOffset.left
				y: e.offsetY - handleOffset.top
			}
			@_cloned.style.top = '0px'
			@_cloned.style.left = '0px'
			@_cloned.style.zIndex = '100'

			bounds = @getBounds()
			@_cloned.style.width = bounds.width + 'px'
			@_cloned.style.height = bounds.height + 'px'
			@_element.style.opacity = '0.6'
			@_element.parentNode.appendChild(@_cloned)
			@_moveCloned(e)
			@_addEventListeners()

		_setupDraggables:()->
			if @_parentContexts[0].querySelector('draggableplaceholder')
				return

			for context in @_parentContexts
				children = context.querySelectorAll('[draggableContext="'+@_draggableName+'"]')
				i = children.length
				while i-- > 0
					child = children[i]
					placeholder = document.createElement('draggableplaceholder')
					placeholder.style.width = '100%'
					placeholder.style.height = '100%'
					placeholder.style.display = 'inline-block'
					child.appendChild(placeholder)
				placeholder = document.createElement('draggableplaceholder')
				placeholder.style.width = '100%'
				placeholder.style.height = '100%'
				placeholder.style.display = 'inline-block'
				context.appendChild(placeholder)

		_getDraggableItems:()->
			items = @_getDraggableChildren(@_parentContexts)
			return items
		_getDraggableChildren:(contexts)->
			items = []
			contexts = [].concat(contexts)
			for context in contexts
				children = context.children
				i = children.length
				while i-- > 0
					if children[i] != @_element && !children[i].hasAttribute('cloned')
						items.push({element: children[i]})
			return items

		_updateDraggableItems:()->
			if !@_items
				@_items = @_getDraggableItems()

			i = @_items.length
			while i-- > 0
				item = @_items[i]
				element = item.element
				pos = @_getElementPosition(element)
				if context = element.querySelector('draggableContext')
					cpos = @_getElementPosition(context)
					pos.h -= cpos.h
					pos.cy = pos.y + cpos.h * 0.5
				item.pos = pos

		_getElementPosition:(element, ignoreChildDraggable = false)->
			pos = {}
			wx = document.body.scrollLeft + document.documentElement.scrollLeft
			wy = document.body.scrollTop + document.documentElement.scrollTop
			bounds = element.getBoundingClientRect()
			px = bounds.left
			py = bounds.top
			w = bounds.right - px
			h = bounds.bottom - py
			pos.x = px + wx
			pos.y = py + wy
			pos.w = w
			pos.h = h
			pos.cx = pos.x + w * 0.5
			pos.cy = pos.y + h * 0.5
			return pos

		_mouseMove:(e)=>
			@_moveCloned(e)
			pos = @_getElementPosition(@_cloned)
			o = @_findElementToSwitch(pos)

			if o
				@_switchElement(o.element, o.after)
				@_moveCloned(e)
		_findElementToSwitch:(pos, contexts = null)=>
			if !contexts
				contexts = @_parentContexts
			contexts = [].concat(contexts)
			closest = null
			dist = Number.MAX_VALUE
			for context in contexts
				children = context.children
				items = []
				i = children.length
				while i-- > 0
					child = children[i]
					if !child.matches('[cloned]')
						items.push(child)

				i = items.length
				while i-- > 0
					item = items[i]
					ipos = @_getElementPosition(item)
					dx = ipos.cx - pos.cx
					dy = ipos.cy - pos.cy
					d = dx * dx + dy * dy
					if d < dist
						dist = d
						a = Math.atan2(dy, dx)
						closest = item
						closestPos = ipos
			if closest == @_element
				return null

			if closest
				if context = closest.querySelector('[draggableContext="'+@_draggableName+'"]')
					cPos = @_getElementPosition(context)
					if cPos.x < pos.cx < cPos.x + cPos.w && cPos.y < pos.cy < cPos.y + cPos.y
						return @_findElementToSwitch(pos, context)
				pi2 = Math.PI * 2
				a = ((a % pi2) + pi2) % pi2
				after = pi2 * 0.375 < a < pi2 * 0.875
				return {element: closest, after: after}

		_switchElement:(element, after)=>
			parent = element.parentNode
			children = parent.children

			currentIndex = -1
			targetIndex = -1
			i = children.length
			while i-- > 0
				child = children[i]
				if child == element
					targetIndex = i
				if child == @_element
					currentIndex = i
			if after
				targetIndex = targetIndex + 1
			if currentIndex == targetIndex
				return
			if targetIndex >= children.length - 1
				parent.appendChild(@_element)
			else
				parent.insertBefore(@_element, children[targetIndex])
			@_updateDraggableItems()
		_sortPosition:(a, b)=>
			return 0
		_mouseUp:()=>
			@_drop()

		_moveCloned:(e)=>
			pos = MouseUtils.getMousePos(e)
			bounds = @_cloned.parentNode.getBoundingClientRect()
			x = pos[0] - bounds.left - @_elOffset.x
			y = pos[1] - bounds.top - @_elOffset.y
			@_cloned.style.left = x + 'px'
			@_cloned.style.top = y + 'px'
