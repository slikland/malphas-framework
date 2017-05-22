#namespace cms.ui.tags.interface
class Viewstack extends cms.ui.Base
	@SELECTOR: 'viewstack'
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

			@element.on('show', @_showView)

			@_parseViews()

		destroy:()->
			super

		_showView:(e)=>
			data = e.data
			@show(data)


		_parseViews:()->
			@_views = {}
			views = @findAll('view[name]')
			i = views.length
			while i-- > 0
				view = views[i]
				parent = view.findParents('viewstack')
				if parent != @_element
					continue
				name = view.getAttribute('name')
				view.name = name
				if view.getAttribute('default')
					@_defaultView = view
				@_views[name] = view
			if !@_defaultView
				@_defaultView = view
			@reset()

		reset:()->
			@show(@_defaultView.name)

		show:(name)->
			selectedView = null
			for n, view of @_views
				if n == name
					selectedView = view
					if view == @_selectedView
						continue
					view.style['display'] = ''
					app.template.renderBlock(view, view.itemData)
				else
					view.style['display'] = 'none'
			@_selectedView = selectedView
			return selectedView

		getView:(name)->
			return @_views[name]

		getViews:()->
			return @_views
