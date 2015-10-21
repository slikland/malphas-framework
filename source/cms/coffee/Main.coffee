#import slikland.debug.Debug
#import slikland.utils.Prototypes
#import slikland.core.App
#import slikland.core.navigation.NavigationRouter

#import slikland.utils.ObjectUtils
#import slikland.utils.StringUtils
#import slikland.utils.JSONUtils

#import slikland.loader.AssetLoader
#import slikland.core.navigation.BaseView
#import slikland.core.template.Template
#import slikland.loader.API

#import cms.core.ServiceController
#import cms.core.ComponentController
#import cms.core.ViewController
#import cms.core.User

#import cms.ui.*
#import cms.components.*

class Main

	constructor:()->
		app.basePath = document.querySelector('base')?.href || ''
		Template.setRootPath(app.basePath + '../api/view/cms/')
		Template.setExtension('')

		app.blocker = new Blocker()

		API.ROOT_PATH = app.basePath + '../api/cms/'

		app.serviceController = ServiceController.getInstance()
		app.user = new User()

		app.router = new NavigationRouter()
		app.router.init(app.basePath)
		app.router.on(NavigationRouter.CHANGE, @_routeChange)

		app.componentController = ComponentController.getInstance()

		app.viewController = ViewController.getInstance()
		app.viewController.getInterface()

		app.componentController.parse()


		# API.call({url: 'user/getSession', onComplete: @_indexComplete, onError: @_error})
	_routeChange:()=>
		console.log(arguments)
	_indexComplete:()=>
		console.log(arguments)
	_error:()=>
		console.log("ERR")
	_loadComplete:()=>
		# @_template = AssetLoader.getInstance().getResult('template.yaml')

		# console.log(jsyaml.load(@_template))


app.on(App.WINDOW_LOAD, ()->
	new Main()
)