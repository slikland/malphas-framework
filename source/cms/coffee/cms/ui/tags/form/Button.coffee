#namespace cms.ui.tags.form
class Button extends cms.ui.Base
	@SELECTOR: 'button'
	@_IGNORE_ATTRIBUTES: ['action', 'href', 'duplicate', 'template', 'showModal']
	_update:(data)->
		for item in data.add
			ignore = false
			for a in @constructor._IGNORE_ATTRIBUTES
				if item.hasAttribute(a)
					ignore = true
					break
			if ignore
				if !item.hasAttribute('type')
					item.setAttribute('type', 'button')
