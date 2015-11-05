class chart.BarChart extends chart.RendererBase
	_update:()->

	_redraw:()->
		if !@_data
			return
		if @_height < @_width * 0.5
			@_height = @_width * 0.5
			@attr('height', @_height)
		colors = @constructor._colors
		items = @_data['data']
		numBars = items.length
		values = @_data['values']
		numValues = values.length
		barDist = @_width / numBars >> 0
		barSize = barDist * 0.5 / numValues
		if barSize < 4
			barSize = 4
		barSize = barSize >> 0
		# for item in items
		maxH = 0
		for item in items
			for value in values
				val = item[value]
				if maxH < val
					maxH = val
		maxH = 1 / maxH
		px = 0
		for item in items
			ox = px + (barDist - (numValues * barSize + (numValues - 1))) * 0.5 >> 0
			for c, value of values
				color = colors[c]
				@context.beginPath()
				@context.fillStyle = color
				h = item[value] * maxH * @_height
				@context.shadowColor = '#999999'
				@context.shadowBlur = 2
				@context.shadowOffsetX = 0
				@context.shadowOffsetY = 0
				@context.fillRect(ox, @_height - h, barSize, h) 
				@context.fill()
				ox += barSize + 1
			px += barDist
		@context.beginPath()
		@context.fillStyle = null
		@context.lineStyle = '#CCCCCC'
		@context.rect(0, 0, @_width, @_height)
		@context.stroke()
		@context.closePath()
