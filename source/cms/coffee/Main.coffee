#import slikland.debug.Debug
#import slikland.utils.Prototypes
#import slikland.core.App

#import slikland.utils.ObjectUtils
#import slikland.utils.StringUtils
#import slikland.utils.JSONUtils

#import slikland.loader.AssetLoader
#import slikland.core.navigation.BaseView
#import slikland.core.template.Template
#import slikland.loader.API

class Main

	constructor:()->
		app.basePath = document.querySelector('base')?.href || ''
		Template.setRootPath(app.basePath + '../api/view/cms/')
		Template.setExtension('')

		Template.render('index', document.body)
	_loadComplete:()=>
		# @_template = AssetLoader.getInstance().getResult('template.yaml')

		# console.log(jsyaml.load(@_template))


app.on(App.WINDOW_LOAD, ()->
	new Main()
)