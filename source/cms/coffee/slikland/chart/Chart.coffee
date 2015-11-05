#import slikland.chart.renderer.RendererBase
#import slikland.chart.renderer.*

if !chart
	chart = {}
class chart.Chart extends BaseDOM

	@getRenderer:(name)->
		name = name.substr(0, 1).toUpperCase() + name.substr(1).toLowerCase() + 'Chart'
		return chart[name]

	@_parseData:(data)->
		if !data?.header? || !data?.data?
			return
		@_parseDataRecursive(data.header, data.data)
	@_parseDataRecursive:(header, data)->
		if !Array.isArray(header)
			return null
		isArray = Array.isArray(header?[0])
		if isArray
			obj = []
		else
			obj = {}
		for k, v of header
			if isArray

			else
				obj[v['name']] = @_parseDataObject(v, data[k])
			# if Array.isArray(v)
			# 	@_parseDataRecursive(v)
			# 	console.log('>>', k, v)
			# else
			# 	console.log(k, v)
		return obj
	@_parseDataObject:(header, data)->
		# console.log(header, data, Array.isArray(data))
		if !Array.isArray(data) || !header?.values?
			return data
		ret = []
		for item in data
			ret.push(@_parseDataRecursive(header.values, item))
		return ret

	@COLORS = []

	constructor:()->
		super

		type = @attr('type') || 'bar'
		o = /(^.*?)(?:\_(.*?))?$/.exec(type)
		@_type = o[1]
		@_subtype = o[2]
		renderer = chart.Chart.getRenderer(@_type)
		if !renderer
			throw new Error('Couldn\'t find chart renderer of type: ' + @_type)
		@_renderer = new renderer(@_subtype)
		@appendChild(@_renderer)
		window.addEventListener('resize', @_resize)
		@_resize()
	@get type:()->
		return @_type

	@set type:(value)->
		# if chart[]
		@_type = value

	_resize:()=>
		b = @getBounds()
		w = b.width >> 0
		h = b.height >> 0
		if w != @_prevWidth || h != @_prevHeight
			@_prevWidth = w
			@_prevHeight = h
			@_renderer?.resize?(@_prevWidth, @_prevHeight)

	update:(data)->
		@_data = chart.Chart._parseData(data)
		if !@_data
			throw new Error('Data is not parseable', data)
		@_renderer.update(@_data)

	_parseData:()->

