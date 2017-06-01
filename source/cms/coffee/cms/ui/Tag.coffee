#namespace cms.ui.tags
class Tag extends cms.ui.Base
	@SELECTOR: 'tag'
	_update:(data)->
		for item in data.add
			@_setupTag(item)

		for item in data.remove
			p = @_plugins[item]
			if p
				p.destroy?()

	_setupTag:(item)=>
		color = item.getAttribute('color')
		if color
			item.style['background-color'] = color
			item.style['border-color'] = color
			item.style['box-shadow'] = "inset 1px 1px 1px #{color}, inset -1px -1px 1px #{color}"


