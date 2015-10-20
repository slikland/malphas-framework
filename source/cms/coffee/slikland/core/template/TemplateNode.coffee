class TemplateNode extends EventDispatcher
	constructor:(@nodeData)->
		@_id = @nodeData['id']
		@_external = @nodeData['external']
		@_use = @nodeData['use']
		@_attributes = @nodeData['attributes']
		@_element = @nodeData['element']
		@_content = @nodeData['content']
		@_condition = @nodeData['condition']
		@_children = []
		@_contextSelector = @nodeData['contextSelector']

		@_parseNode(@nodeData)

	@get id:()->
		return @_id
	@get external:()->
		return @_external
	@get use:()->
		return @_use
	@get attributes:()->
		return @_attributes
	@get element:()->
		return @_element
	@get content:()->
		return @_content
	@get condition:()->
		return @_condition
	@get children:()->
		return @_children
	@set children:(value)->
		@_children = value

	_parseNode:(nodeData)->
		# console.log(nodeData)

	render:(context, data, originalData = null)->
		if !originalData && data
			originalData = data
		foundData = data
		if @_use && o = /([\*\@])?(.*?)$/.exec(@_use)
			foundData = @_findObjectData(foundData, @_use)
			if !foundData
				return
			if !Array.isArray(foundData) && typeof(foundData) != 'object'
				@_content = foundData
			else
				data = foundData
				@_content = ''

		if @_contextSelector
			context = (context || document.body).querySelector(@_contextSelector)

		childContext = context
		if @_element
			childContext = document.createElement(@_element)
			context.appendChild(childContext)
		if @_content
			childContext.innerHTML = @_content

		if @_attributes
			attrs = @_replaceData(@_attributes, data)
			for k, v of attrs
				childContext.setAttribute(k, v)

		if !context
			throw new Error('Context was not found.')

		if @_use && data && (typeof(data) == 'object' || Array.isArray(data))
			
			for v in data
				@_renderChildren(childContext, v, originalData)
		else
			@_renderChildren(childContext, data, originalData)

	_replaceData:(obj, data)->
		obj = JSON.stringify(obj)
		while o = /\#\{(.*?)\}/.exec(obj)
			obj = obj.replace(new RegExp('#\\{' + o[1] + '\\}', 'g'), ObjectUtils.findChild(data, o[1]))
		return JSON.parse(obj)

	_findObjectData:(obj, path)->
		if !obj
			return null
		if path && o = /([\*\@])?(.*?)$/.exec(path)
			switch o[1]
				when '*'
					# console.log("GLOBAL")
				when '@'
					# console.log("ROOT")
				else
					obj = ObjectUtils.findChild(obj, o[2])
		return obj

	_renderChildren:(childContext, data, originalData)->
		l = @_children.length
		i = -1
		while ++i < l
			@_children[i].render(childContext, data, originalData)

