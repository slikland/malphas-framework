#import slikland.debug.Debug
#import slikland.utils.Prototypes
#import slikland.core.App
#import slikland.core.navigation.NavigationRouter
#import slikland.anim.KTween

#import slikland.utils.ObjectUtils
#import slikland.utils.StringUtils
#import slikland.utils.JSONUtils

#import slikland.loader.AssetLoader
#import slikland.core.navigation.BaseView
#import slikland.core.template.Template
#import slikland.loader.API

#import cms.core.*
#import cms.ui.*

#import slikland.mara.Mara

class Main
	@RENDER_TEMPLATE: 'app_renderTemplate'
	constructor:()->
		app.body = new BaseDOM({element: document.body})
		app.template = new slikland.Mara('templates/')
		slikland.Mara.setGlobalObject('@', app)
		app.templateContext = document.body
		app.user = new User()
		app.interface = new cms.core.InterfaceController()

		setTimeout(@_init, 0)

		app.on(Main.RENDER_TEMPLATE, @_renderTemplate)

		# app.basePath = document.querySelector('base')?.getAttribute('href') || ''
		# Template.setRootPath(app.basePath + '../api/view/cms/')
		# Template.setExtension('')

		# app.blocker = new Blocker()

		# API.ROOT_PATH = app.basePath + '../api/cms/'

		# app.serviceController = ServiceController.getInstance()
		# app.user = new User()

		app.router = new NavigationRouter(app.basePath)
		app.router.on(NavigationRouter.CHANGE, @_routeChange)
		app.router.setup(app.basePath)

		# app.componentController = ComponentController.getInstance()
		
		# app.viewController = ViewController.getInstance()
		# app.viewController.getInterface()

		# app.notification = new Notification()
		# app.componentController.parse()

		# API.call({url: 'user/getSession', onComplete: @_indexComplete, onError: @_error})

	_init:()=>
		app.body.css('visibility', '')

	_routeChange:(e, data)=>
		app.interface.show()
	_indexComplete:()=>
		# console.log(arguments)
	_error:()=>
		# console.log("ERR")
	_loadComplete:()=>
		# @_template = AssetLoader.getInstance().getResult('template.yaml')

		# console.log(jsyaml.load(@_template))

	_renderTemplate:(e, data)=>
		if data.target && data.currentTarget
			target = data.currentTarget.findParents(data.target)
			if !target
				target = document.body.querySelector(data.target)
		app.template.render(data.template, data.data || {}, target || app.templateContext)

app.on('windowLoad', ()->
	new Main()
)