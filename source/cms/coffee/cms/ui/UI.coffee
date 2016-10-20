#namespace cms.ui
#import cms.ui.Base
class UI
	constructor:()->
		@_instances = []
		setTimeout(@_registerUIs, 0)

	@set _dirty:(value)->
		if !value
			return
		clearTimeout(@_dirtyTimeout)
		@_dirtyTimeout = setTimeout(@_updateInstances, 0)

	_registerUIs:()=>
		@_parseUIs(cms.ui, true)
		# # if cms.ui.base
		# # 	@_parseUIs(cms.ui.base)
		# # if cms.ui.attributes
		# # 	@_parseUIs(cms.ui.attributes)

		# console.log(cms.ui.attributes instanceof Function)
		# cms.ui.Base

		@_initListeners()
	_parseUIs:(classes, onlyChild = false)->
		for n, c of classes
			if c instanceof Function
				if !onlyChild
					@_instances.push(new c())
			else
				@_parseUIs(c)


	_initListeners:()=>
		if MutationObserver
			@_mutationObserver = new MutationObserver(@_domChanged)
			@_mutationObserver.observe(document.body, {childList: true, subtree: true})
		else
			target.addEventListener('DOMSubtreeModified', @_domChanged)

		@_domChanged()

	_domChanged:()=>
		@_dirty = true

	_updateInstances:()=>
		i = @_instances.length
		while i-- > 0
			@_instances[i].update()

	# Init UI
	new @()
