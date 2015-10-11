class ObjectUtils

	# Public: Return the length of a {Object} item.
	#
	# item - The {Object} object to count.
	#
	# Returns
	#     The resulting {Number} object.
	@count:(p_item)->
		result = 0
		for key of p_item
			result++
			# key = null
		return result

	# Public: Return a {Array} of a {Object} item.
	#
	# source -  The {Object} object.
	#
	# Returns
	#   The resulting {Array}.
	@toArray:(p_source)->
		result = []
		result.push(p_source[k]) for k,v of p_source
		return result

	@clone:(p_target)->
		return JSON.parse(JSON.stringify(p_target))


	@findChild:(obj, query = null)->
		if !query
			return obj
		query = query.split('.')
		if query.length == 0
			return obj
		obj = obj[query[0]]
		if query.length > 0
			obj = @findChild(obj, query.splice(1).join('.'))
		return obj
