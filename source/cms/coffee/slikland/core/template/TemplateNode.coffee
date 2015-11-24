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
	find:(element = null, attrs = null)->
		childNode = null
		for child in @_children
			if element
				if child.element != element
					continue
			if attrs
				found = true
				for k, v of attrs 
					if !child.attributes[k] || child.attributes[k]?.indexOf(v) < 0
						found = false
						continue
				if !found
					continue
			childNode = child
			break
		if !childNode
			for child in @_children
				childNode = child.find(element, attrs)
				if childNode
					break
		return childNode
	clear:()->
		children = @_childContext.childNodes
		while @_childContext.childNodes.length
			@_childContext.removeChild(@_childContext.childNodes[0])

	render:(context, data, originalData = null, ignoreUse = false)->
		if !originalData && data
			originalData = data
		@originalData = originalData
		foundData = data
		if !ignoreUse
			if @_use && o = /([\*\@])?(.*?)$/.exec(@_use)
				foundData = @_findObjectData(foundData, @_use)
				if !foundData?
					return
				if !Array.isArray(foundData) && typeof(foundData) != 'object'
					@_content = foundData
				else
					data = foundData
					@_content = ''
		if @_contextSelector
			context = (context || document.body).querySelector(@_contextSelector)
		@data = data

		childContext = context
		if @_element
			childContext = document.createElement(@_element)
			context.appendChild(childContext)
			childContext.templateNode = @
		if @_content
			childContext.innerHTML = @_replaceData(@_content, data)

		if @_attributes
			attrs = @_replaceData(@_attributes, data)
			for k, v of attrs
				if !v || v.length == 0
					continue
				childContext.setAttribute(k, v)

		if !context
			throw new Error('Context was not found.')
		if (!ignoreUse && @_use) && data && (Array.isArray(data))
			for v in data
				@_renderChildren(childContext, v, originalData)
		else
			@_renderChildren(childContext, data, originalData)
		@_childContext = childContext

	update:(data, originalData)->
		@clear()
		if data && (typeof(data) == 'object' || Array.isArray(data))
			for v in data
				@_renderChildren(@_childContext, v, data, true)
		else
			@_renderChildren(@_childContext, data, data, true)
		@data = data

	_replaceData:(obj, data)->
		obj = JSON.stringify(obj)
		while o = /\#\{(.*?)\}/.exec(obj)
			value = ObjectUtils.findChild(data, o[1])
			if !value
				value = ''
			value = value.toString().replace(/\"/g, '\\"')
			obj = obj.replace(new RegExp('#\\{' + o[1] + '\\}', 'g'), value)
			obj = obj.replace(new RegExp('\r\n', 'g'), '\n')
			obj = obj.replace(new RegExp('[\n|\r]', 'g'), '\\n')
		return JSON.parse(obj)

	_findObjectData:(obj, path)->
		if !obj
			return null
		if path && o = /([\*\@])?(.*?)$/.exec(path)
			switch o[1]
				when '*'
					1
					# console.log("GLOBAL")
				when '@'
					2
					# console.log("ROOT")
				else
					obj = ObjectUtils.findChild(obj, o[2])
		return obj

	_renderChildren:(childContext, data, originalData, ignoreUse = false)->
		l = @_children.length
		i = -1
		while ++i < l
			@_children[i].render(childContext, data, originalData, ignoreUse)

