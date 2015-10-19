#import slikland.core.navigation.NavigationContainer
#
#############################
# 
# IMPORT ALL VIEWS BELLOW
# 
#############################
# 
#import project.views.HomeView
#import project.views.Test1View
#import project.views.Sub1View
#import project.views.Sub2View
#import project.views.Sub3View

class Main extends NavigationContainer
	create:(evt=null)=>
		# for k, v of app.config.views
		# 	color = Math.floor(Math.random()*16777215).toString(16)
		# 	@test = new BaseDOM('div')
		# 	@appendChild(@test)
		# 	@test.text = v.id
		# 	@test.css({
		# 		'width':'50px',
		# 		'height':'25px',
		# 		'display':'inline-block',
		# 		'cursor':'pointer',
		# 		'background-color': '#'+color
		# 	})
		# 	@test.element.on 'click', @go
		# setTimeout(@start, 1000) 
		super

	start:()=>
		@startNavigation()

	go:(evt)->
		app.navigation.goto(evt.srcElement.innerText)

	show:(evt=null)=>
		super

	hide:(evt=null)=>
		super

return new Main()
