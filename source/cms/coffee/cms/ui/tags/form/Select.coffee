# #namespace cms.ui.tags.form
# class Select extends cms.ui.Base
# 	@SELECTOR: 'select'
# 	_update:(data)->
# 		for item in data.add
# 			@_plugins[item] = new Plugin(item)

# 		for item in data.remove
# 			p = @_plugins[item]
# 			if p
# 				p.destroy?()

# 	class Plugin extends BaseDOM
# 		@_destroyPlugin:(item)->

# 		constructor:(element)->
# 			super({element: 'dropdown'})
# 			element.parentNode.insertBefore(@_element, element)
# 			@appendChild(element)

