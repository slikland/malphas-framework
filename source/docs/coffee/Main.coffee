#import slikland.core.App
#import slikland.loader.API
#import wysiwyg.LiveEditor
#import Nav
#import Content
#import slikland.core.navigation.NavigationRouter
#import slikland.utils.keyboard.Shortcut

class Main
	constructor:()->
		@_nav = new Nav()
		@_content = new Content()

		@_nav.on('ready', @_navReady)

		@_shortcutPrevent = new slikland.utils.keyboard.Shortcut(window)
		@_shortcutPrevent.addShortcut('[cmd]s', @_emptyCallback)

	_emptyCallback:()=>

	_navReady:()=>
		app.router = new NavigationRouter(app.basePath)
		app.router.on(NavigationRouter.CHANGE, @_routeChange)
		app.router.setup(app.basePath)

	_routeChange:(e, data)=>
		path = data.path
		path = path.trim('/')
		if !@_nav.isValid(path)
			if path.length > 0
				app.router.goto('/')
				return
		if path.length == 0
			path = 'index'
		@_nav.select(path)
		@_content.show(path)

app.on('windowLoad', ()->
	new Main()
)