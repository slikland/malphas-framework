#namespace cms.ui.tag.attributes
class Remove extends cms.ui.Base
	@SELECTOR: '[remove]'
	_update:(data)->
		for item in data.add
			@_plugins[item] = new Plugin(item)

		for item in data.remove
			p = @_plugins[item]
			if p
				p.destroy?()

	class Plugin extends BaseDOM
		@_destroyPlugin:(item)->

		constructor:(element)->
			super({element: element})
			@_element.on('click', @_click)
		_click:(e)=>
			e.preventDefault()
			# e.stopImmediatePropagation()
			target = @findParents(@attr('remove'))
			if target
				target.parentNode.removeChild(target)
