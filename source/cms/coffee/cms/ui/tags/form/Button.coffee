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
			else if item.getAttribute('type')
				switch item.getAttribute('type').toLowerCase()
					when 'submit'
						@_plugins[item] = new Plugin(item)
	class Plugin extends BaseDOM
		@_destroyPlugin:(item)->

		constructor:(element)->
			super
			@element.on('click', @_click)

		_click:()=>
			if (form = @findParents('form'))
				@_clearButtons()
				item = document.createElement('input')
				item.setAttribute('_submit_data', '1')
				item.setAttribute('name', @element.getAttribute('name'))
				item.setAttribute('value', @element.getAttribute('value'))
				form.appendChild(item)

				setTimeout(@_clearButtons, 1000)
		_clearButtons:()=>
			if (form = @findParents('form'))
				items = form.querySelectorAll('_submit_data')
				i = items.length
				while i-- > 0
					item = items[i]
					form.removeChild(item)
