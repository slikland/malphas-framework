#namespace cms.ui
class Base
	@_ID: 0
	constructor:()->
		@_instances = []
		@_plugins = {}

	update:()->
		if !@constructor.SELECTOR
			return
		setTimeout(@_updateItems, 0)
	_updateItems:()=>
		foundElements = document.body.querySelectorAll(@constructor.SELECTOR)
		elements = []

		for el in foundElements
			if el.matches('[cloned]')
				continue
			elements.push(el)

		i = elements.length
		addElements = []
		removeElements = []
		unchangedElements = []
		aI = 0
		rI = 0
		uI = 0
		while i-- > 0
			el = elements[i]
			if (j = @_instances.indexOf(el)) >= 0
				unchangedElements[uI++] = @_instances[j]
				@_instances.splice(j, 1)
			else
				addElements[aI++] = el
		removeElements = [].concat(@_instances)

		@_instances = [].concat(addElements, unchangedElements)
		@_update({add: addElements, remove: removeElements, unchanged: unchangedElements, current: elements})

	_update:()->
		throw new Error('Please override this method.')
