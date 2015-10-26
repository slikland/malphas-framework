class TemplateParser extends EventDispatcher
	@LOAD_COMPLETE: 'templateParser_loadComplete'
	@LOAD_ERROR: 'templateParser_loadError'

	@_parseTemplateRules:()->
		rulesStr = Template.RULES.replace(/^\s*$/g, '')
		blockRE = /^[^\s].*?\n(^[\s+].*?(\n|$))+/gm
		@_rules = []
		while o = blockRE.exec(rulesStr)
			@_parseBlock(o[0])
	@_parseBlock:(data)->
		name = /^([^\s]+)\s*\:/.exec(data)
		if !name
			return
		name = name[1]
		ruleObj = {name: name}
		paramRE = /^\s+([^\s]+)\s*\:\s*(.*?)\s*$/gm
		while o = paramRE.exec(data)
			ruleObj[o[1]] = o[2]
		@_rules.push(ruleObj)

	constructor:(template = null)->
		if !TemplateParser.rules
			TemplateParser._parseTemplateRules()

		@_renderQueue = []
		@_loaded = false
		@id = template
		if template
			@loadTemplate(template)


	@get loaded:()->
		return @_loaded
	
	parse:(template)->
		@_templateLoadComplete(null, template)

	loadTemplate:(name, dataPath = null)->
		if !/\.tpl$/.test(name)
			name = name.replace(/\./, '/') + Template.EXTENSION
		if name.indexOf('/') != 0
			rootPath = Template.ROOT_PATH
		else
			rootPath = ''
		path = rootPath + name
		API.call({
			url: path
			onComplete: @_templateLoadComplete
			onError: @_templateLoadError
			type: 'template'
		})

	render:(context, data, onComplete, onError)->
		if !@_loaded
			@_renderQueue.push(arguments)
		else
			l = @_nodes.length
			i = -1
			while ++i < l
				@_nodes[i].render(context, data)


	_templateLoadComplete:(e, data)=>
		data = data + '\n'
		@_externalTemplates = []

		@_nodes = @_parseBlocks(data)

		@_loadExternalTemplates()



	_templateLoadError:(e, data)=>
		@_loaded = true
		@trigger(TemplateParser.LOAD_ERROR)


	_findTemplate:(id)->
		i = @_nodes.length
		while i-- > 0
			if @_nodes[i]?.id == id
				return @_nodes[i]
		return Template.find(id)

	_loadExternalTemplates:()=>
		i = @_externalTemplates.length
		while i-- > 0
			id = @_externalTemplates[i]
			if @_findTemplate(id)
				@_externalTemplates.splice(i, 1)
			else
				template = new TemplateParser(@_externalTemplates[i])
				template.on(TemplateParser.LOAD_ERROR, @_externalTemplateLoadError)
				template.on(TemplateParser.LOAD_COMPLETE, @_externalTemplateLoaded)
				Template.addTemplate(@_externalTemplates[i], template)
				@_externalTemplates.splice(i, 1)
				return

		if @_externalTemplates.length == 0
			@_replaceNodeExternals(@_nodes)
			@_loadComplete()
		else
			@_loadExternalTemplates()

	_replaceNodeExternals:(nodes)=>
		i = nodes.length
		while i-- > 0
			node = nodes[i]
			if node.external
				externalNode = @_findTemplate(node.external)
				if externalNode
					if externalNode instanceof TemplateParser
						node.children = externalNode.nodes
					else if externalNode instanceof TemplateNode
						node.children = externalNode.children
				if !node.children || node.children.length == 0
					nodes.splice(i, 1)
			if node.children.length
				@_replaceNodeExternals(node.children)

	_externalTemplateLoaded:(e, data)=>
		target = e.currentTarget
		if target instanceof TemplateParser
			Template.addTemplate(target.id, target)
		@_loadExternalTemplates()

	_externalTemplateLoadError:(e, data)=>
		Template.addTemplate(e.target.id, '')
		@_loadExternalTemplates()

	_loadComplete:()=>
		@_loaded = true

		i = @_nodes.length
		while i-- > 0
			if @_nodes[i].id
				@_nodes.splice(i, 1)
		l = @_renderQueue.length
		i = -1
		while ++i < l
			@render.apply(@, @_renderQueue[i])

		@trigger(TemplateParser.LOAD_COMPLETE)



	_parseBlocks:(data)->

		data = data.replace(/\/\*[\s\S]*?\*\//mg, '')

		data = data.replace(/^\s*$[\n|\r]/gm, '')
		blockRE = /(^\s*)([^\s].*?\n)((?:\1\s[\s\S].*?(?:\n|$))*)/gm

		[data, @_escapeMap] = @_escapeCharacters(data, @_escapeMap || [])
		[data, @_escapeMap] = @_escapeLineBreaks(data, @_escapeMap)
		[data, @_escapeMap] = @_escapeConditionals(data, @_escapeMap)
		childs = []
		while o = blockRE.exec(data)
			templateNode = new TemplateNode(@_parseNodeData(o[2]))
			if o[3] && o[3].trim().length > 0
				templateNode.children = @_parseBlocks(o[3])
			childs.push(templateNode)
		return childs

	_parseNodeData:(nodeData)->

		# externalTempaltes

		[nodeData, charMap] = @_escapeConditionals(nodeData, @_escapeMap)
		o = /^([\>\<\!]?)(.*?)(\:(.*?))?$/m.exec(nodeData)
		data = {}
		if o[1] && o[1].length > 0
			switch o[1]
				when '>'
					data['contextSelector'] = o[2]
				when '<'
					@_externalTemplates.push(o[2])
					data['external'] = o[2]
					if o[4] && o[4].length > 0
						c = /^\s*\#\{(.*?)\}\s*$/.exec(@_unescapeCharacters(o[4], charMap))
						data['content'] = o[4]
						if c
							data['use'] = c[1]
				when '!'
					data['id'] = o[2]
				else
					throw new Error('Couldn\'t parse node: ' + o[0])
		else
			instruction = (@_unescapeCharacters(o[2], @_escapeMap) || '').trim()
			content = (@_unescapeCharacters(o[4], @_escapeMap) || '').trim()
			initialContent = content

			content = content.replace(/^([\'\"])(.*?)\1$/, '$2')

			[instructionData, @_escapeMap] = @_escapeDataObjects(instruction, @_escapeMap)
			[instructionData, attrs] = @_parseObjectRecursive(instructionData)
			instructionData = @_unescapeCharacters(instructionData, attrs)
			instructionData = @_unescapeCharacters(instructionData, @_escapeMap)

			if cond = /^\s*(\((?:if|for).*?)\)\s*$/.exec(instructionData)
				data['condition'] = cond[1]
			else
				attrsRE = /([\.\#])?([\w\-]+)/g
				if !instructionData
					instructionData = ''
				tagData = instructionData.replace(/\{.*?\}/g, '')
				ids = []
				cssClasses = []
				while instAttr = attrsRE.exec(tagData)
					switch instAttr[1]
						when '.'
							cssClasses.push(instAttr[2])
						when '#'
							ids.push(instAttr[2])
						else
							data['element'] = instAttr[2]
				if ids.length
					if !attrs['id']
						attrs['id'] = ''
					attrs['id'] = [].concat(attrs['id'].split(' '), ids).join(' ').trim()

				if cssClasses.length
					if !attrs['class']
						attrs['class'] = ''
					attrs['class'] = [].concat(attrs['class'].split(' '), cssClasses).join(' ').trim()
				for k, v of attrs
					attrs[k] = @_unescapeCharacters(v, @_escapeMap)
				data['attributes'] = attrs

			if !data['element'] && !data['condition']
				data['element'] = 'div'

			if content?.length > 0
				data['content'] = content

			
			if content == initialContent && c = /^\s*\#\{(.*?)\}\s*$/.exec(content)
				data['use'] = c[1]

		return data
	_parseObjectRecursive:(data)=>
		@_objData = []
		obj = /(\{.*?\})/.exec(data)
		if obj
			try
				obj = JSON.parse(obj[0])
		if !obj
			obj = {}
		while /\{([^\{\}]*)\}/.test(data)
			[data, @_objData] = @_escapeCharacters(data, @_objData, '£££')
			[data, @_objData] = @_escapeString(data, /(([\'\"])([^\2]*)\2)/, @_objData, '£££', 3)
			data = data.replace(/\{([^\{\}]*)\}/g, @_replaceObject)
		# if @_objData.length == 0
		# 	return [data, {}]
		# @_objData.length = 0
		data = data.replace(/\${3}\d+\£{3}/g, '')
		return [data, obj]
	_replaceObject:(context, match)=>
		index = @_objData.length
		obj = {}
		argsRE = /([^\:\,\{\}]+)\:([^\:\,\}]+)/gm
		while o = argsRE.exec(match)
			name = o[1].trim()
			content = o[2].trim()

			objContent = /^\-{3}(\d+)\-{3}$/.exec(content)
			if objContent && @_objData[objContent[1]]
				obj[name] = @_objData[objContent[1]]
			else
				obj[name] = @_unescapeCharacters(o[2].trim(), @_objData, '£££')
		@_objData[index] = obj
		return '---' + index + '---'

	_escapeString:(data, re, map = [], escapeChars = '---', captureIndex = 1)->
		if !re
			throw new Error('Must define a RegExp object')
		mapIndex = map.length
		escapeChars ?= '---'
		while o = re.exec(data)
			data = data.replace(new RegExp(o[0].replace(/(\W)/g, '\\$1'), 'g'), escapeChars + mapIndex + escapeChars)
			map[mapIndex++] = o[captureIndex]
			re.lastIndex = 0
		return [data, map]


	_escapeDataObjects:(data, map = [])->
		return @_escapeString(data, /(\#\{[^\{\}]*\})/, map)
	_escapeConditionals:(data, map = [])->
		return @_escapeString(data, /((?:\{([^\{\}]+)})|(?:\(([^\(\)]+)\)))/, map)

	_escapeCharacters:(data, map = [], escapeChars = null)->
		[data, map] = @_escapeString(data, /(\\.)/, map, escapeChars)
		return [data, map]
	_escapeLineBreaks:(data, map)->
		data = data.replace(/(['"])([\s\S]*?)\1/g, @_replaceStringMultilines)
		return @_escapeString(data, /(\+{3})/, map)
	_replaceStringMultilines:(data)=>
		data = data.replace(/^\s+/gm, '')
		return data.replace(/\n/gm, '+++')

	_unescapeCharacters:(data, charMap, escapeChars = '---')->
		if !data
			return
		escaper = escapeChars.replace(/(.)/g, '\\$1')
		escapeRE = new RegExp(escaper + '(\\d+)' + escaper, 'g')
		# while escaper
		while o = escapeRE.exec(data)
			index = o[1]
			char = charMap[o[1]] || ''
			data = data.replace(new RegExp(escaper + index + escaper, 'g'), char)
			escapeRE.lastIndex = 0
		return data


