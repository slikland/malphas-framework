class StandaloneBase extends BaseDOM

	@parseDOM:()->
		@_parsedItems ?= []
		items = app.body.findAll(@SELECTOR)
		newItems = []
		for item in items
			newItems.push(item)
			if (i = @_parsedItems.indexOf(item)) >= 0
				@_parsedItems.splice(i, 1)
				continue
			if !item.getAttribute('standalone.' + @.name)
				new @({element: item})
		@_parsedItems = newItems

	constructor:(params)->
		instance = params?.__instance__ || params?.element?.getInstance?()
		super
		@element.setAttribute('standalone.' + @constructor.name, 'true')
		if instance
			@_element.__instance__ = instance
