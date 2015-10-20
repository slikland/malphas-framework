components = {}
class ComponentController
	@getInstance:()=>
		@_instance ?= new @(arguments...)
	constructor:(target = document.body)->
		@_target = target

		if MutationObserver
			@_mutationObserver = new MutationObserver(@_mutationChanged)
			@_mutationObserver.observe(target, {childList: true, subtree: true})
		else
			target.addEventListener('DOMSubtreeModified', @_domInserted)
	parse:(target = null)->
		return
		if !target
			target = @_target

		for k, component of components
			items = target.querySelectorAll(component.SELECTOR)
			for item in items
				if !item.getInstance()
					new component({element: item})
					# @_mutationObserver.observe(item.parentNode, {childList: true})
	_mutationChanged:(mutation)=>
		for k, component of components
			items = @_target.querySelectorAll(component.SELECTOR)
			for item in items
				if !item.getInstance()
					new component({element: item})
		for mut in mutation
			for item in mut.removedNodes
				item.getInstance()?.destroy()
	_domChanged:()=>
		@_items ?= []
		for k, component of components
			items = target.querySelectorAll(component.SELECTOR)
			for item in items
				if !item.getInstance()
					@_items.push(new component({element: item}))

		i = @_items.length
		while i-- > 0
			item = @_items[i]
			if !item.element.parentNode
				item.destroy()
				@_items[i].splice(i, 1)
