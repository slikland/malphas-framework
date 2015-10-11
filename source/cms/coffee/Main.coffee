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
		Template.setRootPath('template/')

		obj = {
			list: [
				{link: 'http://www.google.com.br', label: 'GOOGLE'},
				{link: 'http://www.yahoo.com.br', label: 'YAHOO!'},
				{link: 'http://www.bing.com.br', label: 'Bing'}
			]
		}

		Template.render('template', document.body, obj)
	_loadComplete:()=>
		# @_template = AssetLoader.getInstance().getResult('template.yaml')

		# console.log(jsyaml.load(@_template))


app.on(App.WINDOW_LOAD, ()->
	new Main()
)