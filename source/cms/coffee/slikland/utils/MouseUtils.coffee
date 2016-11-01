class MouseUtils
	@getMousePos:(e, global = true)->
		x = e.pageX || e.clientX
		y = e.pageX || e.clientX
		if global
			x += document.body.scrollLeft + document.documentElement.scrollLeft
			y += document.body.scrollTop + document.documentElement.scrollTop
		return [x, y]

	@toGlobal:(x, y)->
		x += document.body.scrollLeft + document.documentElement.scrollLeft
		y += document.body.scrollTop + document.documentElement.scrollTop
		return [x, y]
