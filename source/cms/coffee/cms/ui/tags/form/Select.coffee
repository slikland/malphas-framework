#namespace cms.ui.tags.form
class Select extends cms.ui.Base
	@SELECTOR: 'select'
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
			super
			@element.on('updated', @_updated)

			if @attr('update')
				@_updateParams = []
				updateData = @attr('update')
				paramsRE = /\[([^\[\]]+)\]/g
				while o = paramsRE.exec(updateData)
					@_updateParams.push(o[1].split(','))

				if @_updateParams.length > 0
					@element.on('change', @_updateTargets)
					setTimeout(@_updateTargets, 1)

		_updated:()=>
			setTimeout(@_updateTargets, 1)

		_updateTargets:()=>
			if !@_updateParams
				return
			i = @_updateParams.length
			value = @element.value
			while i-- > 0
				params = @_updateParams[i]
				items = document.body.querySelectorAll(params[0])
				j = items.length
				while j-- > 0
					items[j].trigger(params[1], value)

