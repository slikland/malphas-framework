#namespace cms.ui.tags
class Tooltip extends cms.ui.Base
	@SELECTOR: 'tooltip'
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
			@_parent = element.parentNode
			@_parent.on('mouseover', @_over)
			@_parent.on('mouseout', @_out)
		_over:()=>
			@addClass('show')
		_out:()=>
			@removeClass('show')
