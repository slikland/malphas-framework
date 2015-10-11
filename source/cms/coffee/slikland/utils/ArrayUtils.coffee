#import slikland.utils.NumberUtils

# Public: Bunch of utilities methods for {Array}
class ArrayUtils

	# Public: Removes an item from an {Array}.
	#
	# array - The {Array} that contains the item that should be removed.
	# item  - The item to be removed from the {Array}.
	# clone - Apply and return changes to a cloned {Array}.
	#
	# Returns
	#    An {Array} with the removed items.
	@removeItem:(p_array, p_item, p_clone=false)->
		result = if p_clone then p_array.slice(0) else p_array
		for k,v in result
			if k is p_item then result.splice(v, 1)
		return result

	# Public: Removes an item by index from an {Array}.
	#
	# array - The {Array} that contains the item that should be removed.
	# index - The index to be removed from the {Array}.
	# clone - Apply and return changes to a cloned {Array}.
	#
	# Returns
	#    An {Array} with the removed item.
	@removeItemByIndex:(p_index, p_array, p_clone=false)->
		result = if p_clone then p_array.slice(0) else p_array
		result.splice(p_index, 1)
		return result

	# Public: Removes all strings duplicated from an {Array}.
	#
	# array - The {Array} where the duplicates string should be removed.
	@removeDuplicateStrings:(p_array, p_clone=false)->
		return p_array.filter((el,pos,self)-> return self.indexOf(el) is pos )

	# Public: Finds element in {Array} and returns {Boolean} value
	#
	# array - The {Array} where the duplicates should be removed.
	#
	# Returns
	#    The resulting {Boolean}.
	@hasItem:(p_value, p_array)->
		return p_array.indexOf(p_value) > -1

	# Public: Returns a new merged {Array}.
	#
	# array - The {Array} to be used as reference.
	#
	# Returns
	#    Returns a new merged {Array}.
	@merge:(p_arrayA, p_arrayB)->
		result = []
		i = 0
		j = 0
		while (i < p_arrayA.length) || (j < p_arrayB.length)
				if i < p_arrayA.length
						result.push(p_arrayA[i])
						i++

				if j < p_arrayB.length
						result.push(p_arrayB[j])
						j++
		return result

	# Public: Returns a random index inside the range of the {Array}.
	#
	# array - The {Array} to be used as reference.
	#
	# Returns
	#    A random {Number} valid index.
	@randomIndex:(p_array)->
		return NumberUtils.rangeRandom(0, p_array.length-1, true)

	# Public: Returns a random item within an {Array}.
	#
	# array - The {Array} to be used as reference.
	#
	# Returns
	#    The resulting {Object}.
	@randomItem:(p_array)->
		return p_array[ArrayUtils.randomIndex(p_array)]

	# Public: Shuffles the order of the items in an {Array}.
	#
	# array - The {Array} to shuffled.
	# clone - Apply and return changes to a cloned {Array}.
	#
	# Returns
	#    The resulting object.
	@shuffle:(p_array, p_clone=false)->
		result = if p_clone then p_array.slice(0) else p_array
		for item,i in result
			random = Math.floor(Math.random() * result.length)
			temp = result[i]
			result[i] = result[random]
			result[random] = temp
		return result

	# Public: Move some item to another position in an {Array}.
	#
	# array - The {Array} to Array.
	# oldIndex - The {Number} to old index.
	# newIndex - The {Number} to new index.
	# clone - Apply and return changes to a cloned {Array}.
	#
	# Returns
	#    The resulting object.
	@move:(p_array, p_oldIndex, p_newIndex, p_clone=false)->
		result = if p_clone then p_array.slice(0) else p_array
		if p_newIndex >= result.length
			k = new_index - result.length
			while (k--) + 1
				result.push(undefined)
		result.splice(p_newIndex, 0, result.splice(p_oldIndex, 1)[0])
		return result

	@fromMiddleToEnd:(p_array) ->
		len = p_array.length
		midLen = Math.floor(len * 0.5)
		first = p_array.slice(midLen, len)
		last = p_array.slice(0, midLen).reverse()
		merged = @merge first, last
		merged

	@fromEndToMiddle:(p_array) ->
		newArray = @fromMiddleToEnd p_array
		newArray.reverse()


	@lastIndexOf:(p_array, p_value)->
		i = 0
		total = p_array.length
		index = -1
		while i != total
			if p_array[i] == p_value
				index = i
			i++
		return index
