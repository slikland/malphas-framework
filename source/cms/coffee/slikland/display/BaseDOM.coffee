#import slikland.utils.Prototypes
#import slikland.event.EventDispatcher

# 
# Helper for adding BaseDOM into any DOM element
# 
# TODO: FIX IE8+
# 
Node::__appendChild__ = Node::appendChild
Node::appendChild = (node) ->
	el = node
	if node instanceof BaseDOM
		el = node.element
		node.parent = @
	Node::__appendChild__.call(@, el)

Node::__removeChild__ = Node::removeChild
Node::removeChild = (node) ->
	el = node
	if node instanceof BaseDOM
		el = node.element
		node.parent = @
	try
		@__removeChild__.call(@, el)
Element::matches = Element::matches || Element::webkitMatchesSelector || Element::mozMatchesSelector || Element::msMatchesSelector || Element::oMatchesSelector
Node::findParents = (query) ->
	if @parentNode?.matches?
		if @parentNode.matches(query)
			return @parentNode
		else
			return @parentNode.findParents(query)
	return null

# 
# TODO: FIX IE8+
# Node.get({instance: ()-> return @__instance__})

# BaseDOM: SlikLand DOM
###*
Base DOM manipulation class
@class BaseDOM
###

class BaseDOM extends EventDispatcher
	# 
	# Deprecated params: constructor:(element = 'div', className = null, namespace = null)->
	# 
	constructor:(p_options...)->
		super
		# 
		# Default params:
		# 
		element = 'div'
		className = null
		namespace = null

		if typeof(p_options[0]) == 'string' || p_options[0] instanceof HTMLElement
			element = p_options[0]
		else

			i = p_options.length
			while i--
				option = p_options[i]
				if option.element? then element = option.element
				if option.className? then className = option.className
				if option.namespace? then namespace = option.namespace
		if typeof(element) == 'string'
			if namespace
				@_namespace = namespace
				@_element = document.createElementNS(@_namespace, element)
			else
				@_element = document.createElement(element)
		else if element instanceof HTMLElement
			@_element = element
		if className
			@addClass(className)
		@_element.__instance__ = @


	##------------------------------------------------------------------------------
	##
	##	GETTER / SETTER
	##
	##------------------------------------------------------------------------------

	##--------------------------------------
	##	Base element getter. Read-only
	##--------------------------------------
	@get element: ()->
		return @_element

	##--------------------------------------
	##	Base namespace getter. Read-only
	##--------------------------------------
	@get namespace: ()->
		return @_namespace

	##--------------------------------------
	##	Childnodes array
	##--------------------------------------
	@get childNodes:()->
		return @element.childNodes

	##--------------------------------------
	##	Instance bounds. Only getters.
	##	If changing size, use CSS.
	##--------------------------------------

	@get width:()->
		return @getBounds().width
	@get height:()->
		return @getBounds().height
	
	@get left:()->
		return @getBounds().left
	@get top:()->
		return @getBounds().top

	@get x:()->
		return @getBounds().left
	@get y:()->
		return @getBounds().top


	##--------------------------------------
	##	Parent instance. Can be HTMLElement
	##--------------------------------------
	@get parent: ()->
		return @_parent

	@set parent: (value)->
		if !(value instanceof BaseDOM) && !(value instanceof Node)
			throw new Error('Parent instance is not either Node or BaseDOM')
		return @_parent = value

	##--------------------------------------
	##	CSS Class Name
	##--------------------------------------
	@get className:()->
		return @element.className

	@set className:(value)->
		@element.className = value.trim()

	@get text:()->
		return @html
	@set text:(value)->
		@html = value

	##--------------------------------------
	##	InnerHTML
	##--------------------------------------
	@get html:()->
		return @element.innerHTML
	@set html:(value)->
		@element.innerHTML = value


	##--------------------------------------
	##	DOM Manipulation
	##--------------------------------------

	@get isAttached:()->
		return document.contains?(@element) || document.body.contains(@element)

	@get attributes:()->
		return @element.attributes

	appendChild:(child)->
		@appendChildAt(child)

	appendChildAt:(child, index = -1)->
		el = child
		if child instanceof BaseDOM
			el = child.element
		if index == -1 || index >= @childNodes.length
			@element.appendChild(el)
		else
			@element.insertBefore(el, @childNodes[index])
		if child instanceof BaseDOM
			child.parent = @
		return child

	remove:()->
		@parent?.removeChild?(@)

	removeChild:(child)->
		el = child
		if child instanceof BaseDOM
			el = child.element
		try
			return @element.removeChild(el)

	removeChildAt:(index = -1)->
		if index < @childNodes.length
			return @removeChild(@childNodes[i])

	removeAll:()->
		childs = @childNodes
		i = childs.length
		while i-- > 0
			@removeChild(childs[i])

	##--------------------------------------
	##	Check if the instance matches a query selector
	##--------------------------------------
	matches:(query)->
		return @element.matches(query)
	##--------------------------------------
	##	Find parent nodes for a matching query selector
	findParents:(query)->
		return @element.findParents(query)
	##--------------------------------------
	##	Query selector
	##	@onlyInstances: If return only BaseDOM instances
	##--------------------------------------
	find:(query, onlyInstances = false)->
		element = @element.querySelector(query)
		if onlyInstances
			return element?.__instance__
		else
			return element

	##--------------------------------------
	##	Query selector find all
	##	@onlyInstances: If return only BaseDOM instances
	##--------------------------------------
	findAll:(query, onlyInstances = false)->
		elements = @element.querySelectorAll(query)
		if onlyInstances
			els = []
			i = -1
			l = elements.length
			p = 0
			while ++i < l
				if elements[i].__instance__
					els[p++] = elements[i].__instance__
			elements = els
		return elements

	##--------------------------------------
	##	Set / Get element attribute
	##	Accepts object:
	##	@example:
	##	attr({id: 1, name: 2})
	##--------------------------------------
	attr:(name, value = 'nonenonenone', namespace = false)->
		if typeof(name) == 'string'
			return @_attr(name, value, namespace)
		else if typeof(name) == 'object'
			for k, v of name
				@_attr(k, v, namespace)

	_attr:(name, value = 'nonenonenone', namespace = false)->
		if namespace is false
			namespace = @namespace

		# Default valus is 'nonenonenone' because of when setting null or false
		if value != 'nonenonenone'
			if namespace
				@element.setAttributeNS(namespace, name, value)
			else
				@element.setAttribute(name, value)
		if namespace
			return @element.getAttributeNS(namespace, name)
		else
			return @element.getAttribute(name)

	##--------------------------------------
	##	Set / Get element CSS
	##	Accepts object:
	##	@example:
	##	css({color: 1, width: 2})
	##--------------------------------------
	_css:(name, value = null)->
		if value isnt null
			@element.style[name] = value
		return @element.style[name]

	css:(name, value = null)->
		if typeof(name) == 'string'
			return @_css(name, value)
		else if typeof(name) == 'object'
			for k, v of name
				@_css(k, v)

	##--------------------------------------
	##	CSS Class name manipulation
	##--------------------------------------

	addClass:(className)->
		if typeof(className) is 'string'
			className = className.replace(/\s+/ig, ' ').split(' ')
		else if typeof(className) isnt 'Array'
			return

		classNames = @className.replace(/\s+/ig, ' ').split(' ')
		p = classNames.length
		i = className.length
		while i-- > 0
			if classNames.indexOf(className[i]) >= 0
				continue
			classNames[p++] = className[i]
		@className = classNames.join(' ')


	removeClass:(className)->
		if typeof(className) is 'string'
			className = className.replace(/\s+/ig, ' ').split(' ')
		else if typeof(className) isnt 'Array'
			return

		classNames = @className.replace(/\s+/ig, ' ').split(' ')
		i = className.length
		while i-- > 0
			if (p = classNames.indexOf(className[i])) >= 0
				classNames.splice(p, 1)
		@className = classNames.join(' ')

	toggleClass:(className, toggle = null)->
		if toggle isnt null
			if toggle
				@addClass(className)
			else
				@removeClass(className)
			return
		if typeof(className) is 'string'
			className = className.replace(/\s+/ig, ' ').split(' ')
		else if typeof(className) isnt 'Array'
			return
		i = className.length
		while i-- > 0
			if @hasClass(className[i])
				@removeClass(className[i])
			else
				@addClass(className[i])
	hasClass:(className)->
		if typeof(className) is 'string'
			className = className.replace(/\s+/ig, ' ').split(' ')
		else if typeof(className) isnt 'Array'
			return

		classNames = @className.replace(/\s+/ig, ' ').split(' ')
		i = className.length

		hasClass = true

		while i-- > 0
			hasClass &= (classNames.indexOf(className[i]) >= 0)
		return hasClass
		

	##--------------------------------------
	##	Get elements bounds as rectangle.
	##	{top, left, bottom, right, width, height}
	##--------------------------------------
	getBounds:(target = null)->
		boundsObj = {}
		bounds = @element.getBoundingClientRect()
		for k, v of bounds
			boundsObj[k] = v
		if target
			if (target instanceof BaseDOM)
				tbounds = target.getBounds()
			else if (target instanceof HTMLElement)
				tbounds = target.getBoundingClientRect()
		if tbounds
			boundsObj.top -= tbounds.top
			boundsObj.left -= tbounds.left
			boundsObj.bottom -= tbounds.top
			boundsObj.right -= tbounds.left
		boundsObj.width = boundsObj.right - boundsObj.left
		boundsObj.height = boundsObj.bottom - boundsObj.top

		return boundsObj

	destroy:()->
		@off?()
		@remove?()
