#namespace cms.ui.tags.visualizer

# http://www.chartjs.org/docs/
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
			itemData = element.itemData
			if itemData && itemData.type?
				@_update({data: itemData})


		_update:(e)=>
			data = e.data
			@appendChild(@_canvas)
			@_resize()

			@_data = data
			if !data.options || Array.isArray(data.options)
				data.options = {}
			data.options.responsive = false
			data.options.maintainAspectRatio = false
			data.options.tooltips = {
				callbacks: {
					label: @_labelTooltip
					title: @_labelTooltipTitle
				}
			}
			data = @_parseFunctions(data)
			@_chart = new Chart(@_canvas, data)
			@_chart.onHover = @_mouseMove
			@_chart.onMouseMove = @_mouseMove
		_parseFunctions:(data)=>
			for k, v of data
				if typeof(v) == 'string'
					if /function\s*\(/.test(v)
						data[k] = eval('(' + v + ')')
				else if typeof(v) == 'object'
					data[k] = @_parseFunctions(v)
			return data
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
		_labelTooltipTitle:(tooltip, data)=>
			if Array.isArray(tooltip)
				tooltip = tooltip[0]
			item = data.datasets[tooltip.datasetIndex].data[tooltip.index]
			if item.title?
				return item.title
			return ''
		_labelTooltip:(tooltip, data)=>
			item = data.datasets[tooltip.datasetIndex].data[tooltip.index]
			if item.label?
				return item.label
			else
				if Array.isArray(item)
					return item.join(', ')
				else
					labels = []
					for k, v of item
						if typeof(v) != 'string' && isNaN(v)
							continue
						labels.push(k + ': ' + v)
					return labels.join(', ')
			return ''