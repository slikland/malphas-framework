# https://en.wikipedia.org/wiki/Mara_(demon)
#namespace slikland

#import slikland.utils.Prototypes
#import slikland.event.EventDispatcher
#import slikland.net.API
#import slikland.mara.Block
#import slikland.mara.Templates
class Mara extends EventDispatcher
	@_rootPath = ''

	@setRootPath:(path)->
		@_rootPath = path

	_children = []
	_name = null
	_id = null

	constructor:(rootPath = null)->
		@_templates = slikland.mara.Templates.getInstance(rootPath)

	@get name:()->
		return _name

	@get id:()->
		return _id

	@get children:()->
		return [].concat(_children)

	render:(file, data, context = null)->
		if context?.element
			context = context.element
		@_renderData = {
			file: file
			data: data
			context: context
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
			@_resetContext(@_renderData.context)
			@_holdContextToRender(@_renderData.context)
		items = block.render(@_renderData.data, @_renderData.context)
		@_block = block
	_holdContextToRender:(context)=>
		context.style.visibility = 'hidden'
		setTimeout(@_showContext, 2, context)
	_showContext:(context)=>
		context.style.visibility = ''

	_resetContext:(target)->
		children = target.childNodes
		i = children.length
		while i-- > 0
			target.removeChild(children[i])

	update:(data)->
		@_block.update(data)

	find:()->

	findAll:()->


	# Just an alias for render
	@::vilha = @::render