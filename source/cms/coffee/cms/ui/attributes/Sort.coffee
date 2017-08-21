#namespace cms.ui.tag.attributes
class Sort extends cms.ui.Base
	@SELECTOR: '[sort]'
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
			@_name = @attr('sort')
			@_element.setAttribute('name', 'sort')
			@_sortButton = document.createElement('span')
			@_sortButton.className = 'sort'
			@_icon = document.createElement('i')
			@_icon.className = 'fa icon'
			@_sortButton.appendChild(@_icon)
			@_sortOrder = document.createElement('sup')
			@_sortButton.appendChild(@_sortOrder)
			@_getTarget()
			@_parseParam()

			@_element.on('click', @_click)
			@_element.on('update', @_update)
			@appendChild(@_sortButton)
		_getTarget:()->
			if @attr('for')
				@_target = document.querySelector('#' + @attr('for'))
				@_parentTarget = @_target.parentNode
			else
				@_target = @findParents('[service]')
				@_parentTarget = @_target

		_parseParam:()=>
			if (targetId = @_target.getAttribute('id'))
				data = app.router.getParam(targetId)
				if !data
					return
				if data['sort']
					data = [].concat(data['sort'])
					if (index = data.indexOf(@_name)) >= 0
						if data.length > 1
							@_element.sortOrder = index
						@_element.value = @_name
					else if (index = data.indexOf('-' + @_name)) >= 0
						if data.length > 1
							@_element.sortOrder = index
						@_element.value = '-' + @_name
				@_element.setAttribute('for', targetId)
				@_update()

		_resetOthers:()=>
			items = @_parentTarget.querySelectorAll('[sort]')
			i = items.length
			while i-- > 0
				items[i].sortOrder = null
				delete items[i].sortOrder
				if items[i] == @_element
					continue
				items[i].value = null
		_updateAll:()->
			items = @_parentTarget.querySelectorAll('[sort]')
			i = items.length
			while i-- > 0
				items[i].trigger('update')

		_update:()=>
			@_getTarget()
			if !@_element.value
				@_element.removeAttribute('value')
			else
				@_element.setAttribute('value', @_element.value)

			if !isNaN(@_element.sortOrder)
				@_element.setAttribute('sortOrder', @_element.sortOrder)
				@_sortOrder.innerHTML = @_element.sortOrder
			else
				@_element.removeAttribute('sortOrder')
				@_sortOrder.innerHTML = ''

		_click:(e)=>
			value = @_element.value
			if value && !(/^\-/.test(value))
				value = '-' + @_name
			else
				value = @_name

			if e.metaKey
				items = ArrayUtils.toArray(@_parentTarget.querySelectorAll('[sort][value]'))
				items.sort(@_sortByOrder)
				index = items.length
				i = items.length
				while i-- > 0
					items[i].sortOrder = i
					if items[i] == @_element
						index = i
				@_element.sortOrder = index
			else
				@_resetOthers()
			@_element.value = value
			@_updateAll()
			@_target.trigger('update')
		_sortByOrder:(a, b)=>
			if a.sortOrder < b.sortOrder
				return -1
			else if a.sortOrder > b.sortOrder
				return 1
			return 0