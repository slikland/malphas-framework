#import slikland.chart.renderer.RendererBase
#import slikland.chart.renderer.*

if !chart
	chart = {}
class chart.Chart extends BaseDOM
	@COLORS = []
	constructor:()->
		super
	@get type:()->
		return @_type

	@set type:(value)->
		# if chart[]
		@_type = value

	update:(data)->

	_parseData:()->

