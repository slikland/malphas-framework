#namespace cms.ui.tags.interface
class Tabs extends cms.ui.Base
	@SELECTOR: 'tabs'
	_update:(data)->
		for item in data.add
			@_plugins[item] = new Plugin(item)

		for item in data.remove
			p = @_plugins[item]
			if p
				p.destroy?()

	class Plugin extends BaseDOM
		constructor:(element)->
			super({element: element})

			if @attr('update')
				@_updateParams = []
				updateData = @attr('update')
				paramsRE = /\[([^\[\]]+)\]/g
				while o = paramsRE.exec(updateData)
					@_updateParams.push(o[1].split(','))

				if @_updateParams.length > 0
					@element.on('change', @_updateTargets)
					setTimeout(@_updateTargets, 1)
			@_parseTabs()

		_updateTargets:()=>
			i = @_updateParams.length
			value = @element.value
			while i-- > 0
				params = @_updateParams[i]
				items = document.body.querySelectorAll(params[0])
				j = items.length
				while j-- > 0
					items[j].trigger(params[1], value)

		_parseTabs:()->
			tabName = 'tab_' + Date.now() + '_' + Math.random()
			tabs = @_element.querySelectorAll('tab')
			i = tabs.length
			@_tabs = []
			while i-- > 0
				tab = tabs[i]
				tab.on('click', @_tabClick)
				@_tabs[i] = tab
			@_select(@_tabs[0].getAttribute('name'))
				

		_tabClick:(e)=>
			@_select(e.currentTarget.getAttribute('name'))

		_select:(name)->
			i = @_tabs.length
			while i-- > 0
				if @_tabs[i].getAttribute('name') == name
					@_tabs[i].className = 'selected'
				else
					@_tabs[i].className = ''
			@element.value = name
			@_updateTargets()

		_update:()=>

