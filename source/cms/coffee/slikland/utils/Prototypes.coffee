###*
This is actually not a Class. It's a bunch of helper methods adding prototype methods to native classes.

@class Prototypes
###

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

###*
This method is a decorator to create constant variable to a class.  
A extending class cannot override this constant either can't be reassigned.  
  
* Please ignore de backslash on \\\@ as the code formatter doesn't escape atmarks.

@method @const
@example
	class A
		\@const PI: 3.14
	console.log(A.PI) // 3.14
	class B extends A
		\@const PI: 3.14159 // Will throw error
	console.log(B.PI) // Already thrown error before, but will be 3.14
###
Function::const = (p_prop) ->
	__scope = if __scopeIE8 then __scopeIE8 else @
	for name, value of p_prop
		o = {}
		o.get = () ->
			return value
		o.set = () ->
			throw new Error("Can't set const " + name)
		o.configurable = true
		o.enumerable = true
		Object.defineProperty __scope, name, o
	null


###*
Getter decorator for a class instance.  
With this decorator you're able to assign a getter method to a variable.  
  
Also for a special case, you can assign a scope to the getter so you can create static getter to a class.  
  
* Please ignore de backslash on \\\@ as the code formatter doesn't escape atmarks.

@method @get
@example

	// Instance getter
	class A
		\@get test:()->
			return 'Hello world!'
	a = new A()
	console.log(a.test) // Hello world!

	// Static getter
	class A
		\@get \@, TEST:()->
			return 'Hello world!'
	console.log(A.TEST) // Hello world!
###
Function::get = (scope, p_prop) ->
	enumerable = false
	if !p_prop
		p_prop = scope
		__scope = if __scopeIE8 then __scopeIE8 else @::
	else
		enumerable = true
		__scope = scope
	for name, getter of p_prop
		Object.defineProperty __scope, name, get: getter, configurable: true, enumerable: enumerable
	null

###*
Setter decorator for a class instance.  
With this decorator you're able to assign a setter method to a variable.  
  
Also for a special case, you can assign a scope to the setter so you can create static setter to a class.  
  
* Please ignore de backslash on \\\@ as the code formatter doesn't escape atmarks.

@method @set
@example

	// Instance getter / stter
	class A
		\@get test:()->
			return \@_test
		\@set test:(value)->
			\@_test = value
	a = new A()
	a.test = 'Hello setter'
	console.log(a.test) // Hello setter

	// Static getter / setter
	class A
		\@get \@, TEST:()->
			return @_TEST
		\@set \@, TEST:(value)->
			\@_TEST = value
	A.TEST = 'Hello setter'
	console.log(A.TEST) // Hello setter
###

Function::set = (scope, p_prop) ->
	enumerable = false
	if !p_prop
		p_prop = scope
		__scope = if __scopeIE8 then __scopeIE8 else @::
	else
		enumerable = true
		__scope = scope
	for name, setter of p_prop
		Object.defineProperty __scope, name, set: setter, configurable: true, enumerable: enumerable
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

String::padLeft = (length, char = ' ') ->
	if char.length == 0
		char = ' '
	text = @
	while text.length < length
		text = char + text
	return text

String::padRight = (length, char = ' ') ->
	if char.length == 0
		char = ' '
	text = @
	while text.length < length
		text += char
	return text	

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
Node::trigger = (event, data) ->
	e = new Event(event)
	e.data = data
	@dispatchEvent(e)

##------------------------------------------------------------------------------
#
# ADDED OLDER BROWSERS SUPPORT
# 
navigator.mediaDevices ?= {}
navigator.getUserMedia = navigator.mediaDevices.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia

