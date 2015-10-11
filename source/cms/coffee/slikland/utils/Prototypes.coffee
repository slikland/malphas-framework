##--------------------------------------
##	Getter / Setter
##	@example
##	class A
##		constructor:()->
##			@_a = 1
##		@get a:()->
##			return @_a
##		@set a:(value)->
##			return @_a = value
##--------------------------------------
# TODO: Fix/Add override 
# 
isIE= ->
	nav = navigator.userAgent.toLowerCase()
	return if (nav.indexOf('msie') != -1) then parseInt(nav.split('msie')[1]) else false

if isIE() == 8
	__scopeIE8 = document.createElement("IE8_" + Math.random())

Function::get = (p_prop) ->
	__scope = if __scopeIE8 then __scopeIE8 else @::
	for name, getter of p_prop
		Object.defineProperty __scope, name, get: getter, configurable: true
	null
Function::set = (p_prop) ->
	__scope = if __scopeIE8 then __scopeIE8 else @::
	for name, setter of p_prop
		Object.defineProperty __scope, name, set: setter, configurable: true
	null

##------------------------------------------------------------------------------
##
##	FUNCTION PROTOTYPE
##
##------------------------------------------------------------------------------
#
# Add ECMA262-5 method binding if not supported natively
#
unless "bind" of Function::
	Function::bind = (owner) ->
		that = this
		if arguments_.length <= 1
			->
				that.apply owner, arguments_
		else
			args = Array::slice.call(arguments_, 1)
			->
				that.apply owner, (if arguments_.length is 0 then args else args.concat(Array::slice.call(arguments_)))

##------------------------------------------------------------------------------
##
##	STRING PROTOTYPE
##
##------------------------------------------------------------------------------
#
# Add ECMA262-5 string trim if not supported natively
#
unless "trim" of String::
	String::trim=(char = null)->
		return @ltrim(char).rtrim(char)

String::ltrim=(char = null)->
	if !char
		char = '\\s'
	re = new RegExp('^' + char + '*')
	re.global = true
	re.multiline = true
	return @replace(re, '')
String::rtrim=(char = null)->
	if !char
		char = '\\s'
	re = new RegExp(char + '*$')
	re.global = true
	re.multiline = true
	return @replace(re, '')

##------------------------------------------------------------------------------
##
##	ARRAY PROTOTYPE
##
##------------------------------------------------------------------------------
#
# Add ECMA262-5 Array methods if not supported natively
#
unless "isArray" of Array::
	Array.isArray = (arg) ->
		Object::toString.call(arg) == '[object Array]'

unless "indexOf" of Array::
	Array::indexOf = (find, i) -> #opt
		i = 0  if i is undefined
		i += @length  if i < 0
		i = 0  if i < 0
		n = @length

		while i < n
			return i  if i of @ and @[i] is find
			i++
		-1
unless "lastIndexOf" of Array::
	Array::lastIndexOf = (find, i) -> #opt
		i = @length - 1  if i is undefined
		i += @length  if i < 0
		i = @length - 1  if i > @length - 1
		i++ # i++ because from-argument is sadly inclusive
		while i-- > 0
			return i  if i of @ and @[i] is find
		-1
unless "forEach" of Array::
	Array::forEach = (action, that) -> #opt
		i = 0
		n = @length

		while i < n
			action.call that, @[i], i, @  if i of @
			i++
unless "map" of Array::
	Array::map = (mapper, that) -> #opt
		other = new Array(@length)
		i = 0
		n = @length

		while i < n
			other[i] = mapper.call(that, @[i], i, @)  if i of @
			i++
		other
unless "filter" of Array::
	Array::filter = (filter, that) -> #opt
		other = []
		v = undefined
		i = 0
		n = @length

		while i < n
			other.push v  if i of @ and filter.call(that, v = @[i], i, @)
			i++
		other
unless "every" of Array::
	Array::every = (tester, that) -> #opt
		i = 0
		n = @length

		while i < n
			return false  if i of @ and not tester.call(that, @[i], i, @)
			i++
		true
unless "some" of Array::
	Array::some = (tester, that) -> #opt
		i = 0
		n = @length

		while i < n
			return true  if i of @ and tester.call(that, @[i], i, @)
			i++
		false

##------------------------------------------------------------------------------
#
# ADDED IE9+ SUPPORT
# TODO: FIX IE8
# 
Node::on = Node::addEventListener
Node::off = Node::removeEventListener
