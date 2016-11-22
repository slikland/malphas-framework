#namespace cms.ui.tags.visualizer
class ChartHelper extends cms.ui.Base
	@SELECTOR: 'chart'
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

			@_canvas = document.createElement('canvas')
			@_canvas.setAttribute('width', '100%')
			@_canvas.setAttribute('height', 400)
			@_context = @_canvas.getContext('2d')

			@_element.on('updated', @_update)

			window.addEventListener('resize', @_resize)

		_update:(e)=>
			data = e.data
			@appendChild(@_canvas)
			@_resize()

			@_data = data
			console.log(@_data)
			if !data.options || Array.isArray(data.options)
				data.options = {}
			data.options.responsive = false
			data.options.maintainAspectRatio = false
			@_chart = new Chart(@_canvas, data)
		_resize:()=>
			bounds = @getBounds()
			@_canvas.setAttribute('width', bounds.width)
			@_canvas.setAttribute('height', bounds.height)
			@_canvas.style.width = bounds.width + 'px'
			@_canvas.style.height = bounds.height + 'px'
			if @_chart
				@_chart.chart.width = bounds.width
				@_chart.chart.height = bounds.height
				@_chart.update(0)
