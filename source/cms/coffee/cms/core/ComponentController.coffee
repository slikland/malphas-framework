components = {}
components.standalone = {}
class ComponentController
	@getInstance:()=>
		@_instance ?= new @(arguments...)
	constructor:(target = document.body)->
		@_target = target

		@_listComponents()

		if MutationObserver
			@_mutationObserver = new MutationObserver(@_mutationChanged)
			@_mutationObserver.observe(target, {childList: true, subtree: true})
		else
			target.addEventListener('DOMSubtreeModified', @_domInserted)
	_listComponents:()=>
		@_components = []
		for k, component of components
			if k == 'standalone'
				continue
			@_components.push(component)
		@_components = @_components.sort(@_sortComponents)
		@_standalones = []
		for k, component of components.standalone
			@_standalones.push(component)
	_sortComponents:(a, b)=>
		sortOrder = 0
		if a.ORDER?
			if b.ORDER?
				if a.ORDER > b.ORDER
					sortOrder = -1
				else if a.ORDER < b.ORDER
					sortOrder = 1
				else
					sortOrder = 0
			else
				sortOrder = -1
		else
			if b.ORDER?
				sortOrder = 1
			else
				sortOrder = 0
		return sortOrder

	parse:(target = null)->
		return
		if !target
			target = @_target

		for component in @_components
			items = target.querySelectorAll(component.SELECTOR)
			for item in items
				if !item.getInstance()
					new component({element: item})
		setTimeout(@_parseStandalones, 0)
	_mutationChanged:(mutation)=>
		for k, component of @_components
			items = @_target.querySelectorAll(component.SELECTOR)
			for item in items
				if !item.getInstance()
					new component({element: item})
		setTimeout(@_parseStandalones, 0)
		for mut in mutation
			for item in mut.removedNodes
				item.getInstance()?.destroy()
	_domChanged:()=>
		@_items ?= []
		for k, component of @_components
			items = target.querySelectorAll(component.SELECTOR)
			for item in items
				if !item.getInstance()
					@_parseStandalones(item)
					@_items.push(new component({element: item}))

		i = @_items.length
		while i-- > 0
			item = @_items[i]
			if !item.element.parentNode
				item.destroy()
				@_items[i].splice(i, 1)
	_parseStandalones:(item)=>
		for st in @_standalones
			st.parseDOM()
