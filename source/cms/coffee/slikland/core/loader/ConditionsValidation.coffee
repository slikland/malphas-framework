#import slikland.utils.ObjectUtils
#import slikland.utils.Detections

###*
Singleton ConditionsValidation class
@class ConditionsValidation
###
class ConditionsValidation

	_list = null
	_detections = null

	@getInstance:(p_data)=>
		@_instance ?= new @(p_data)

	###*
	@class ConditionsValidation
	@constructor
	@param {Object} p_data
	###
	constructor:(p_data)->
		_detections = app.detections
		_list = ObjectUtils.clone(p_data)

	###*
	Add object condition in internal list.
	@method add
	@param {Object} p_obj
	@return {Boolean}
	###
	add:(p_obj)->
		if ObjectUtils.hasSameKey(p_obj, _list) || ObjectUtils.isEqual(p_obj, _list)
			throw new Error('The object ' + JSON.stringify(p_obj) + ' already exists in validations list.')
		for k, v of p_obj
			_list[k] = v
		return true

	###*
	Returns the internal list of registered conditions.
	@attribute list
	@type {Object}
	@readOnly
	###
	@get list:()->
		return _list

	###*
	Returns the object condition of internal list.
	@method get
	@param {String} p_keyID
	@return {Object}
	###
	get:(p_keyID)->
		return if @has(p_keyID) then _list[p_keyID] else throw new Error("The key " + p_keyID + " does not exists in validations list.")

	###*
	Checks the conditions already added in internal list.
	@method has
	@param {String} p_keyID
	@return {Boolean}
	###
	has:(p_keyID)->
		return if _list[p_keyID] then true else false
		
	###*
	Removes the object condition of internal list.
	@method remove
	@param {String} p_keyID
	@return {Boolean}
	###
	remove:(p_keyID)->
		if _list[p_keyID]
			delete _list[p_keyID]
			return true
		else
			throw new Error("The key " + p_keyID + " does not exists in validations list.")
		return false

	###*
	This method accepts the ID of a condition object or a group of ID with a <a href="//developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators" target="_blank" class="crosslink">default operators</a>, to returns if only one condition is a valid condition or a group with a sum of conditions are valid.
	@method test
	@param {String} p_args The ID of a condition or a group with a sum of conditions.
	@return {Boolean}
	@example
	```
	//Example of conditions list in config file
	...
	"conditions": {
		"small": {
			"browser":{
				"mobile": true
			},
			"size": {
				"min-width":300
			}
		},
		"medium": {
			"browser":{
				"tablet": true
			},
			"orientation":"landscape",
			"size": {
				"min-width":992
			}
		},
		"large": {
			"browser":{
				"desktop": true
			},
			"size": {
				"min-width":1200
			}
		},
		"xtra_large": {
			"size": {
				"min-width":1500
			}
		},
		"full": {
			"size": {
				"min-width":1910
			}
		}
	}

	...
	//Example condition with operators in some content file
	...
	"src":[
		{
			"condition":"xtra_large && full",
			"file":"file.json"
		},
		{
			"condition":"medium || xtra_large",
			"file":"file.json"
		},
		{
			"condition":"small < medium",
			"file":"file.json"
		},
		{
			"condition":"(small > medium) || medium",
			"file":"file.json"
		}
	]

	//Example single condition in some content file
	...
	"src":[
		{
			"condition":"default",
			"file":"{base}data/home.json"
		}
	]
	...
	```	
	###
	test:(p_args)->
		parsed = p_args.replace(new RegExp(/[a-zA-Z0-9-_]+/g), "validate('$&')")
		validate = @validate
		return eval('(function(){return (' + parsed + ');})();')

	validate:(p_keyID)=>
		result = []
		for k, v of @get(p_keyID)
			switch k
				when "size"
					matchSize = true
					for key, value of v
						switch key
							when "max-width"
								if window.innerWidth > value
									matchSize = false
									break
							when "min-width"
								if window.innerWidth < value
									matchSize = false
									break
							when "max-height"
								if window.innerHeight > value
									matchSize = false
									break
							when "min-height"
								if window.innerHeight < value
									matchSize = false
									break
					result.push(matchSize)
				when "browser"
					for key, value of v
						switch key
							when "ua"
								result.push(new RegExp(value).test(_detections.ua))
							when "version"
								a = value.match(/\d+/g)
								total = a.length
								if total > _detections.versionArr.length
									total = _detections.versionArr.length
								for i in [0..total]
									if a[i] == undefined then continue
									match = 0
									if  a[i] > _detections.versionArr[i]
										match = 1
										break
									else if a[i] < _detections.versionArr[i]
										match = -1
										break
								r = value.match(/[<>=]+/g)?[0] || '=='
								if r.lengh == 0
									r = '=='
								result.push(eval('0' + r + 'match'))
							else
								try
									if _detections[key]?
										result.push(value == _detections[key])
								catch err
									
				when "domain"
					result.push(v.toLowerCase() == window.location.hostname.toLowerCase())
				when "platform"
					result.push(v.toLowerCase() == _detections.platform.toLowerCase())
		return if result.indexOf(false) == -1 then true else false

	customTest:(p_callback, p_args...)->
		return p_callback.call(undefined, p_args)
