#namespace cms.ui.tags.visualizer

# http://www.chartjs.org/docs/
class ChartistHelper extends cms.ui.Base
	@SELECTOR: 'chartist'
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

			if (w = @attr('width'))
				if /^[\d\.]$/.test(w)
					w += 'px'
				@css('width', w)
			if (h = @attr('height'))
				if /^[\d\.]$/.test(h)
					h += 'px'
				@css('height', h)

			@_element.on('updated', @_update)

			window.addEventListener('resize', @_resize)

		_update:(e)=>
			data = e.data

			if !Chartist[data.type]
				throw new Error('Chart not found')
			cons = Chartist[data.type]
			@_chart = new cons(@element, data.data, data.options)
			# @appendChild(@_canvas)
			# @_resize()

			# @_data = data
			# if !data.options || Array.isArray(data.options)
			# 	data.options = {}
			# data.options.responsive = false
			# data.options.maintainAspectRatio = false
			# @_chart = new Chart(@_canvas, data)
			# @_chart.onHover = @_mouseMove
			# @_chart.onMouseMove = @_mouseMove
		_resize:()=>
			# bounds = @getBounds()
			# @_canvas.setAttribute('width', bounds.width)
			# @_canvas.setAttribute('height', bounds.height)
			# @_canvas.style.width = bounds.width + 'px'
			# @_canvas.style.height = bounds.height + 'px'
			# if @_chart
			# 	@_chart.chart.width = bounds.width
			# 	@_chart.chart.height = bounds.height
			# 	@_chart.update(0)
