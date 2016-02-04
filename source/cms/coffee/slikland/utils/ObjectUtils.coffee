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
		try
			return JSON.parse(JSON.stringify(p_target))
		catch err
			if !p_target or typeof p_target isnt 'object'
				return p_target

			copy = null
			if p_target instanceof Array
				copy = []
				i = 0
				len = p_target.length
				while i < len
					copy[i] = @clone(p_target[i])
					i++
				return copy
			if p_target instanceof Object
				copy = {}
				for k, v of p_target
					if v isnt 'object'
						copy[k] = v
					else
						copy[k] = @clone(v)
				return copy
			throw new Error('Unable to copy')

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


	# Public: Return a mapped {Array} of a {Array} item.
	#
	# source -  The {Array} object.
	#
	# Returns
	#   The resulting {Array}.
	#
	# Example
	#	ObjectUtils.parseLinkedArray([['id', 'name'], [0, 'name1'], [1, 'name2']])
	#	// [{id: 0, 'name': 'name1'}, {id: 1, 'name': 'name2'}]
	@parseLinkedArray:(p_source)->
		if !p_source or (p_source and p_source.length < 1)
			return []
		i = p_source.length
		names = p_source[0]
		numNames = names.length
		ret = []
		while i-- > 1
			o = {}
			j = numNames
			item = p_source[i]
			while j-- > 0
				o[names[j]] = item[j]
			ret[i - 1] = o
		return ret

	@merge:(a, b)->
		for k of b
			if !a.hasOwnProperty(k)
				a[k] = b[k]
		return a

