#import slikland.core.navigation.Navigation
#import slikland.navigation.display.BaseView

###*
NavigationContainer Class
@class NavigationContainer
@extends BaseView
###
class NavigationContainer extends BaseView

	###*
	@class NavigationContainer
	@constructor
	###
	constructor: () ->
		super null, 'nav-container'

	###*
	@method setupNavigation
	@param {Object} p_data
	###
	setupNavigation:(p_data)=>
		@_navigation = new Navigation(@controller)
		@_navigation.setup(p_data)
		false

	###*
	Returns the current instance of {{#crossLink "Navigation"}}{{/crossLink}}
	@attribute navigation
	@type {Navigation}
	@readOnly
	###
	@get navigation:()->
		return @_navigation

	###*
	__This getter must be overridden with a instance of {{#crossLink "BaseNavigationController"}}{{/crossLink}}.__<br>
	Returns the current navigation controller instance.
	@attribute controller
	@type {BaseNavigationController}
	@readOnly
	###
	@get controller:=>
		throw new Error('Override this method with a instance of BaseNavigationController.')
