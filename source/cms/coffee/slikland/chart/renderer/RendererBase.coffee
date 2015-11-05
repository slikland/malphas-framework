if !chart
	chart = {}
class chart.RendererBase extends BaseDOM
	@_colors: ['#ff0000', '#00ff00', '#0000ff']
	constructor:(type = null)->
		@_type = type
		super({element: 'canvas'})
		@attr({
			'width': '100%'
			'height': '100%'
		})
		@context = @element.getContext('2d')


	update:(data)->
		if !data
			throw new Error(data + ' is not renderable')
		@_data = data
		@_update()
		@_redraw()
	resize:(w, h)->
		@_width = w
		@_height = h
		@attr({
			width: @_width + 'px'
			height: @_height + 'px'
		})
		@_redraw()
	redraw:()->
		@_redraw()
	destroy:()->
		@_destroy()


	_update:()->
		throw new Error('Please implement this method')
	_redraw:()->
		throw new Error('Please implement this method')
	_destroy:()->
		throw new Error('Please implement this method')
