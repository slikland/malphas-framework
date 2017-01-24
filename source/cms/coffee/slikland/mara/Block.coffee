#namespace slikland.mara
#import slikland.utils.ObjectUtils
class Block
	@_INSTRUCTION_RE = /^([\(\#\@\>\<])?([^\:]*?)?(?:(?::)(.*?)(?:\#{([^\#\{\}\'\"]*?)})?)?\s*$/m

	@TYPES = {
		1: 'NORMAL'
		2: 'CONDITIONAL'
		3: 'REFERENCE'
		4: 'INSTANCE'
		5: 'FILE'
	}

	@_blocks: {}

	@_MARA_ID: 1

	for k, v of @TYPES
		@TYPES[v] = Number(k)

	@_registerBlock:(block)->
		@_blocks[block.maraId] = block

	@findBlock:(id)->
		id = Number(id)
		return @_blocks[id]

	constructor:(instruction, file)->
		@_maraId = @constructor._MARA_ID++
		@constructor._registerBlock(@)
		@_file = file
		@_type = null
		@_instance = null
		@_renderQueue = []

		instruction = @constructor._INSTRUCTION_RE.exec(instruction)
		if instruction[1] == '#'
			throw new Error('Comment line')
		@_parseInstruction(instruction)

	@get maraId:()->
		return @_maraId

	@get file:()->
		return @_file
	@get name:()->
		if !@_instance
			return null
		return @_instance

	@get children:()->
		return @_children

	@set children:(value)->
		if !value || !Array.isArray(value)
			throw new Error('slikland.mara.Block children needs to be an Array')
		for v in value
			if !(v instanceof Block)
				throw new Error('slikland.mara.Block children needs to be an Array of slikland.mara.Block')
		@_children = value

	@get type:()->
		return @_type

	toValue:()->
		obj = {}
		switch @_type
			when 2
				obj['condition'] = @_condition
			when 3
				obj['reference'] = @_reference
			when 4
				obj['instance'] = @_instance
			when 5
				obj['file'] = @_file
				if @_reference
					obj['reference'] = @_reference
			else
				obj['tag'] = @_tag

		obj['type'] = @constructor.TYPES[@_type]
		obj['data'] = @_data
		return obj


	_parseInstruction:(instruction)->
		ref = instruction[2] || ''
		@_attributes = instruction[3] || ''
		@_data = instruction[4] || ''

		switch instruction[1]
			when '('
				# Conditional
				type = @constructor.TYPES['CONDITIONAL']
				ref = ref.replace(/\)\s*$/, '')
				@_condition = ref
			when '>'
				# Reference
				type = @constructor.TYPES['REFERENCE']
				@_reference = ref
			when '<'
				# Instance
				type = @constructor.TYPES['INSTANCE']
				@_instance = ref
			when '@'
				# FILE
				type = @constructor.TYPES['FILE']
				o = /(.*?)(?:(?:\>)(.*?))?$/.exec(ref)
				@_file = o[1]
				if o[2]?.length > 0
					@_reference = o[2]
			else
				type = @constructor.TYPES['NORMAL']
				idClassRE = /(#|.)([^\#\.]+)/g
				id = null
				classes = []
				while o = idClassRE.exec(ref)
					switch o[1]
						when '#'
							id = o[2]
						when '.'
							classes.push(o[2])
				if id
					@_id = id
				if classes
					@_classes = classes
				ref = ref.replace(/[#.].*?$/, '')
				@_tag = ref

		@_type = type


	_parseObjectString:(object, data = {}, test = false)->

		glob = slikland.Mara.globals
		replaceObject = object.replace(/\#\{(\$|\@)([^\}\}\#]+)\}/g, '(glob[\'$1\']\.$2 || \'\')')
		replaceObject = replaceObject.replace(/\#\{([^\}\}\#]+)\}/g, '(data[\'$1\'] || \'\')').replace(/\#\{\}/g, '(data || \'\')')

		try
			object = eval('(function(){return (' + replaceObject + ');})();')

		if test
			return Boolean(object)
		if typeof(object) != 'string'
			object = JSON.stringify(object)
		try
			object = @_replaceString(object, data)
			object = JSON.parse(object)
		catch e
			if object
				object = {'html': object}
			else
				object = {}
		if typeof(object) in ['string', 'number']
			object = {'html': object}

		return object

	_replaceString:(string, data)->
		@_currentReplaceObjectData = data
		string = string.replace(/\(glob\[\'(.*?)\'\]\.([^\s]+) \|\| \'\'\)/g, '\#\{$1$2\}')
		string = string.replace(/\(data\[\'(.*?)\'\]\ \|\| \'\'\)/g, '\#\{$1\}')
		string = string.replace(/\(data \|\| \'\'\)/g, '\#\{\}')
		string = string.replace(/\#\{(\$|\@)?([^\}\}\#]+)?\}/g, @_replaceObject)
		return string

	_replaceObject:(match, symbol, name)=>
		data = null
		if symbol && symbol.length > 0
			if name
				data = ObjectUtils.find(slikland.Mara.globals[symbol], name)
		else
			if name
				data = ObjectUtils.find(@_currentReplaceObjectData, name)
			else
				data = @_currentReplaceObjectData
		# if data typeof 'string'
		# 	data = data.replace(/"/g, '\\"').replace(/'/g, "\\'")

		data ?= ''
		return data

	render:(data, context = null, onlyChildren = false)->
		if !context
			context = document.createElement('div')

		if onlyChildren
			ret = [data, context]
		else
			ret = @['_render_' + @constructor.TYPES[@_type]]?(data, context)
		if ret
			if ret[1] && ret[1] instanceof Node
				ret = [ret]
			for d in ret
				data = d[0]
				context = d[1]

				if @_children
					for child in @_children
						child.render(data, context)
		return ret

	_render_NORMAL:(data, context)->
		if !@_tag
			return [data, context]
		items = data
		if @_data && @_data.length > 0
			items = items?[@_data]
		ret = []
		if items
			items = [].concat(items)
			for item in items

				el = document.createElement(@_tag)
				content = @_parseObjectString(@_attributes, item)

				html = null
				if content['html']
					html = content['html']
				else if content['text']
					html = content['text']
				else if content['content']
					html = content['content']
					delete content['content']

				delete content['html']
				delete content['text']

				if html
					el.innerHTML = html

				for k, v of content
					if typeof(k) in ['string', 'number']
						if v
							el.setAttribute(k, v)
				el.data = data
				el.setAttribute('mara', @_maraId)
				if @_id
					el.setAttribute('id', @_id)
				if @_classes
					className = el.className || ''
					className = className.split(' ')
					className = [].concat(className, @_classes)
					el.className = className.join(' ')

				context.appendChild(el)
				ret.push([item, el])

		return ret

	_renderLoadedBlock:(block)=>
		for renderData in @_renderQueue
			data = renderData.data
			context = renderData.context
			items = data
			if @_data && @_data.length > 0
				items = items?[@_data]
			if items
				items = [].concat(items)
				for item in items
					block.render(item, context)
			parentNode = context.parentNode
			children = context.childNodes
			prevChild = context
			i = children.length
			while i-- > 0
				child = children[i]
				parentNode.insertBefore(child, prevChild)
				prevChild = child
			parentNode.removeChild(context)
		@_renderQueue.length = 0


	_render_FILE:(data, context)->
		div = document.createElement('div')
		div.style.display = 'none'
		context.appendChild(div)
		@_renderQueue.push({data: data, context: div})
		f = @_file
		if @_reference
			f += '>' + @_reference
		try
			f = @_replaceString(f, data)
			slikland.mara.Templates.getInstance().get(f, @_renderLoadedBlock)
		return [[data, div]]

	_render_INSTANCE:(data, context)->
		return [[data, context]]

	_render_REFERENCE:(data, context)->
		div = document.createElement('div')
		div.style.display = 'none'
		context.appendChild(div)
		@_renderQueue.push({data: data, context: div})
		slikland.mara.Templates.getInstance().get(@_file + '>' + @_reference, @_renderLoadedBlock)
		return [[data, div]]

	_render_CONDITIONAL:(data, context)->
		if @_parseObjectString(@_condition, data, true)
			return [[data, context]]
		else
			return false
