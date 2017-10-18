#namespace cms.ui.tag.attributes
class Update extends cms.ui.Base
	@SELECTOR: ':not(modal)[update]'
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

			if @attr('update')
				@_updateParams = []
				updateData = @attr('update')
				paramsRE = /\[([^\[\]]+)\]/g
				while o = paramsRE.exec(updateData)
					@_updateParams.push(o[1].split(','))

				if @_updateParams.length > 0
					@element.on('change', @_change)
					@element.on('input', @_input)
					@element.on('update', @_input)
					setTimeout(@_updateTargets, 1)
		_updateTargets:()=>
			if @element.tagName.toLowerCase() == 'input' && @element.getAttribute('type') in ['radio', 'checkbox']
				if !@element.checked
					return
			li = @_updateParams.length
			i = -1
			while ++i < li
				params = @_updateParams[i]
				items = document.body.querySelectorAll(params[0])
				try
					v = null
					`with(this.element){v = eval(params[2])};`
					if v
						value = v
				catch
					value = @element.value
				if !v
					value = @element.value
				if !value || value is undefined
					value = @element.itemData
				if value is undefined
					return
				lj = items.length
				j = -1
				while ++j < lj
					items[j].trigger(params[1], value)
		_updateDelayed:()->
			clearTimeout(@_updateTimeout)
			@_updateTimeout = setTimeout(@_updateTargets, 250)
		_change:(e)=>
			@_updateTargets()

		_input:()=>
			@_updateDelayed()