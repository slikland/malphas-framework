#namespace cms.ui.tags.interface
class NavLink extends cms.ui.Base
	@SELECTOR: 'nav ul a'
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

			app.router.on(NavigationRouter.CHANGE, @_routeChange)

			setTimeout(@_routeChange, 1)

		destroy:()->
			super
			app.router.off(NavigationRouter.CHANGE, @_routeChange)


		_parseItems:()=>
			# items = @findAll('a')
			# i = items.length
			# while i-- > 0
			# 	console.log(i)


		_routeChange:()=>
			p = app.router.getCurrentPath().trim('/')
			p2 = @attr('href').trim('/')
			@toggleClass('selected', p == p2)
