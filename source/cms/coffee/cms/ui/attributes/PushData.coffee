#namespace cms.ui.tag.attributes
class PushData extends cms.ui.Base
	@SELECTOR: '[pushData]'
	_update:(data)->
		if !@_pluginInstances
			@_pluginInstances = []
		for item in data.add
			item.setAttribute('p_id', @constructor._ID++)
			@_pluginInstances.push(new Plugin(item))
		for item in data.remove
			p_id = item.getAttribute('p_id')
			i = @_pluginInstances.length
			while i-- > 0
				inst = @_pluginInstances[i]
				if inst.attr('p_id') == p_id
					inst.destroy()
					@_pluginInstances.splice(i, 1)

	class Plugin extends BaseDOM
		@_destroyPlugin:(item)->

		constructor:(element)->
			super({element: element})
			@_items = []
			if element.itemData?.items
				@_items = element.itemData.items
			@_element.on('update', @_update)
			@_element.on('remove', @_remove)
		_update:(e)=>
			pushData = @attr('pushData')
			data = API.parseJSON(@element)
			# @_items = data
			@_items.push(e.data)
			app.template.renderBlock(@element, {items: @_items})

		_remove:(e)=>
			if e.data?.target?
				i = @_items.length
				while i-- > 0
					if @_items[i] == e.data.target.itemData
						@_items.splice(i, 1)
