#namespace slikland.mara

class Templates
	
	@getInstance:()=>
		@_instance ?= new @(arguments...)

	constructor:(rootPath = null)->
		@_templates = []
		@_rootPath = ''
		@_callbacks = []
		if rootPath
			@rootPath = rootPath

	@get rootPath:()->
		return @_rootPath
	@set rootPath:(value)->
		if typeof(value) != 'string'
			return
		value = value.trim().rtrim('/')
		if value.length > 0
			value += '/'
		@_rootPath = value

	_addInstance:(block)->
		@_templates.push(block)

	_findInstance:(file, name = null)->
		o = /(.*?)(?:(?:\>)(.*?))?$/.exec(file)
		file = o[1]
		if !name && o[2]
			name = o[2]
		i = @_templates.length
		while i-- > 0
			block = @_templates[i]
			if block.file == file && block.name == name
				return block
		return null

	get:(file, callback)->
		block = @_findInstance(file)
		if block
			setTimeout(@_callCallback, 0, callback, block)
		else
			@_callbacks.push({file: file, callback: callback})
			@load(file)

	_callCallback:(callback, block)=>
		callback?(block)

	load:(file)->
		o = /(.*?)(?:(?:\>)(.*?))?$/.exec(file)
		file = o[1]
		file = file.trim()
		if file.length < 2
			return

		if !(/\.mara$/i.test(file))
			file += '.mara'

		if file.charAt(0) == '/'
			path = file
		else
			path = @_rootPath + file
		API.call(path, {file: file}, @_fileLoaded)

	_checkCallbacks:()=>
		i = @_callbacks.length
		while i-- > 0
			item = @_callbacks[i]
			file = item.file
			callback = item.callback
			block = @_findInstance(file)
			if block
				callback?(block)
				@_callbacks.splice(i, 1)

	_fileLoaded:(e, data)=>
		@_parse(data, e.currentTarget.data.file)

		@_checkCallbacks()
	
	_parse:(data, file = '')->
		file = file.replace(/\.mara$/, '')
		blocks = @_parseBlocks(data + '\n', file)
		if blocks.length > 1
			block = new slikland.mara.Block('', file)
			block.children = blocks
		else if blocks.length == 1
			block = blocks[0]
		else
			return
		@_addInstance(block)


	_removeIndent:(data)->
		indentLength = Number.MAX_VALUE
		indent = null
		indentRE = /^(\s*)[^\s].*?$/gm
		while (o = indentRE.exec(data))
			i = o[1]
			if i.length < indentLength
				indentLength = i.length
				indent = i

		if indent
			data = data.replace(new RegExp('^' + indent, 'gm'), '')
		return data

	_parseBlocks:(data, file = '')->
		data = @_removeIndent(data.replace(/^\s*\n/gm, ''))
		blockRE = /(\s*)([^\s].*?\n)((?:^\1[ |\t]+[^\n]*?(?:\n|$))*)/gm
		blocks = []
		while (o = blockRE.exec(data))
			try
				block = new slikland.mara.Block(o[2], file)
			catch e
				continue
			if block.type == slikland.mara.Block.TYPES['INSTANCE']
				@_addInstance(block)
			else
				blocks.push(block)

			content = o[3]
			if content.length > 0
				children = @_parseBlocks(content, file)
				block.children = children

		return blocks
