#namespace cms.ui.tag.attributes
class FAB extends cms.ui.Base
	@SELECTOR: 'button[type="fab"]'
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
			if @attr('on')
				@_target = document.querySelector('#' + @attr('on'))
				@_position = 'TR'
				if @attr('position')
					@_position = @attr('position')
				@_checkPosition()

		destroy:()=>
			super
			@_target = null
			window.cancelAnimationFrame(@_checkPositionTicker)

		_scroll:()=>
			console.log('scroll')

		_checkPosition:()=>
			if !@_target || !@_element.parentNode
				return
			@_checkPositionTicker = window.requestAnimationFrame(@_checkPosition)


			bounds = @_getTargetBounds(@_target)
			pBounds = @_element.parentNode.getBoundingClientRect()
			bBounds = @getBounds()


			t = bounds.top + bBounds.height * 0.25
			l = bounds.left
			if bounds.bottom < bBounds.height * 1.5
				t = bounds.bottom - bBounds.height * 1.25
			else if t < bBounds.height * 0.25
				t = bBounds.height * 0.25
			t += pBounds.top

			if bounds.right < bBounds.width * 1.25
				l = bounds.bottom - bBounds.width * 1.25
			else if l < 0
				l = 0
			l += pBounds.left + bounds.width - bBounds.width * 1.25

			@css({'top': t + 'px', left: l + 'px'})

		_getTargetBounds:(target = null)->
			boundsObj = {}
			bounds = target.getBoundingClientRect()
			for k, v of bounds
				boundsObj[k] = v
			if @_element.parentNode
				tbounds = @_element.parentNode.getBoundingClientRect()
			if tbounds
				boundsObj.top -= tbounds.top
				boundsObj.left -= tbounds.left
				boundsObj.bottom -= tbounds.top
				boundsObj.right -= tbounds.left
			boundsObj.width = boundsObj.right - boundsObj.left
			boundsObj.height = boundsObj.bottom - boundsObj.top

			return boundsObj