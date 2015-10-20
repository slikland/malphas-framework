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

#import cms.core.ComponentController
#import cms.core.ViewController

#import cms.components.*

class Main

	constructor:()->
		app.basePath = document.querySelector('base')?.href || ''
		Template.setRootPath(app.basePath + '../api/view/cms/')
		Template.setExtension('')

		API.ROOT_PATH = app.basePath + '../api/cms/'

		app.router = new NavigationRouter()
		app.router.init(app.basePath)

		app.componentController = ComponentController.getInstance()

		app.viewController = ViewController.getInstance()
		app.viewController.getInterface()

		app.componentController.parse()

		# API.call({url: 'index/index', onComplete: @_indexComplete})
	_indexComplete:()=>
		console.log(arguments)
	_loadComplete:()=>
		# @_template = AssetLoader.getInstance().getResult('template.yaml')

		# console.log(jsyaml.load(@_template))


app.on(App.WINDOW_LOAD, ()->
	new Main()
)