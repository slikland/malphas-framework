# https://en.wikipedia.org/wiki/Mara_(demon)
#namespace slikland

#import slikland.utils.Prototypes
#import slikland.event.EventDispatcher
#import slikland.loader.API
#import slikland.mara.Block
#import slikland.mara.Templates
class Mara extends EventDispatcher
	@RENDERED: 'mara_rendered'
	@_rootPath = ''

	@globals = {}

	@setGlobalObject:(name, object)->
		@globals[name] = object
	@getGlobal:(name)->
		return @globals[name]

	@setRootPath:(path)->
		@_rootPath = path

	_children = []
	_name = null
	_id = null

	constructor:(rootPath = null)->
		@_templates = slikland.mara.Templates.getInstance(rootPath)

	@get name:()->
		return _name
	@get currentFile:()->
		file = @_renderData?.file.replace(/\>.*?$/, '')
		return file

	@get id:()->
		return _id

	@get children:()->
		return [].concat(_children)

	@get templates:()->
		return @_templates

	isCurrent:(file)->
		f = @_renderData?.file || @_block?.file || ''
		return file == f

	render:(file, data = {}, context = null, callback = null, clearContext = true)->
		if context?.element
			context = context.element
		@_renderData = {
			file: file
			data: data
			context: context
			callback: callback
			clearContext: clearContext
		}
		if context
			context.setAttribute('loading', 'true')
		@_templates.get(file, @_templateLoaded)
	reset:()->
		@_renderData = null
	_templateLoaded:(block)=>
		if !@_renderData
			return
		if @_renderData.context
			@_renderData.context.removeAttribute('loading')
			if @_renderData.clearContext
				@_resetContext(@_renderData.context)
			@_holdContextToRender(@_renderData.context)
		items = block.render(@_renderData.data, @_renderData.context)
		@_block = block
		@_renderData.callback?(items, @_block)
	_holdContextToRender:(context)=>
		context.style.visibility = 'hidden'
		setTimeout(@_showContext, 1, context)
	_showContext:(context)=>
		context.style.visibility = ''

	_resetContext:(target)->
		children = target.childNodes
		i = children.length
		items = []
		while i-- > 0
			items[i] = children[i]
			try
				if !items[i]?.removable is false
					items[i].style.display = 'none'
		setTimeout(@_removeChildren, 0, target, items)
	resetContext:(target)->
		children = target.childNodes
		i = children.length
		while i-- > 0
			if children[i]?.removable is false
				continue
			target.removeChild(children[i])
	_removeChildren:(target, children)=>
		i = children.length
		while i-- > 0
			if children[i].removable is false
				continue
			target.removeChild(children[i])

	renderBlockByReference:(reference, data, reset = false, callback = null, context)->
		@_renderData.callback = callback
		if /^\>/.test(reference)
			reference = @_renderData.file + reference
		@_templates.get(reference, @_referenceLoaded)
	_referenceLoaded:(block)=>
		if !@_renderData
			return
		items = block.render(@_renderData.data)
		@_renderData.context.appendChild(items[0][1])
		@_block = block
		@_renderData.callback?(items, @_block)
	renderBlock:(element, data, context = null, onlyChild = true)->
		if !(element instanceof HTMLElement) || !element.getAttribute('mara')
			return
		if !context
			@_resetContext(element)
			context = element
		block = slikland.mara.Block.findBlock(element.getAttribute('mara'))

		renderData = block.render(data, context, onlyChild)
		app.trigger('redraw')
		return renderData

	# update:(element, data)->
	# 	block = @_block
	# 	if element instanceof HTMLElement && element.getAttribute('mara')
	# 		block = 
	# 	@_block.update(data)

	find:()->

	findAll:()->


	# Just an alias for render
	@::vilha = @::render