#import slikland.core.navigation.Navigation

class NavigationContainer extends BaseView
	constructor: () ->
		super null, 'nav-container'

	setupNavigation:(p_data)=>
		navigation = new Navigation()
		navigation.setup(p_data)
