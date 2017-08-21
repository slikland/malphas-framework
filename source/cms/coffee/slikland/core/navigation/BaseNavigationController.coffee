#import slikland.core.navigation.ViewsData

###*
BaseNavigationController is a base class for any type of navigation controller.<br>
Please do not instantiate this class. Use the extended classes.

@class BaseNavigationController
@extends EventDispatcher
###
class BaseNavigationController extends EventDispatcher
	###*
	@event CHANGE
	@static
	###
	@CHANGE : 'base_navigation_controller_change'
	###*
	@event CHANGE_VIEW
	@static
	###
	@CHANGE_VIEW : 'base_navigation_controller_change_view'
	###*
	@event CHANGE_SUBVIEW
	@static
	###
	@CHANGE_SUBVIEW : 'base_navigation_controller_change_subview'

	###*
	@class BaseNavigationController
	@constructor
	###
	constructor: () ->
		super

	###*
	@method setup
	@param {Object} p_data
	@protected
	###
	setup: (p_data) ->
		@_views = new ViewsData(p_data)
		if app.navigation?.instantiateViews || app.navigation?.instantiateViews is undefined
			@_views.createAll()
		false

	###*
	@method start
	@param {String} [p_id=null]
	###
	start:(p_id=null)->
		if @_started then throw new Error('The instance of BaseNavigationController already started')
		@_started = true

		if !app.config.navigation?.defaultView? then throw new Error('The property "defaultView" in config file is null or undefined.')
		if !p_id
			view = app.config.navigation.defaultView
		else
			view = p_id

		@goto(view)
		false
		
	###*
	@method goto
	@param {String} p_id
	###
	goto:(p_id)->
		if !@_started then throw new Error('The instance of BaseNavigationController is not started')
		@change(p_id)
		false

	###*
	__This getter must be overridden with a type of navigation controller it will be a extended.__<br>
	Returns the type of navigation controller.
	@attribute type
	@type {String}
	@readOnly
	###
	@get type:->
		throw new Error('Override the visibleViews getter in '+@constructor.type+' class')

	###*
	__This getter must be overridden with a current visible views of navigation controller it will be a extended.__<br>
	Returns the current visible views in DOM.
	@attribute visibleViews
	@type {Array}
	@readOnly
	###
	@get visibleViews:->
		throw new Error('Override the visibleViews getter in '+@constructor.name+' class')

	###*
	__This getter must be overridden with a current view of navigation controller it will be a extended.__<br>
	Returns the current view.
	@attribute currentView
	@type {BaseView}
	@readOnly
	###
	@get currentView:->
		throw new Error('Override the currentView getter in '+@constructor.name+' class')

	###*
	__This getter must be overridden with a previous view of navigation controller it will be a extended.__<br>
	Returns the previous view.
	@attribute previousView
	@type {BaseView}
	@readOnly
	###
	@get previousView:->
		throw new Error('Override the previousView getter in '+@constructor.name+' class')

	###*
	__This getter must be overridden with a data object of navigation controller it will be a extended.__<br>
	Returns the data.
	@attribute data
	@type {Object}
	@readOnly
	###
	@get data:->
		throw new Error('Override the data getter in '+@constructor.name+' class')

	###*
	__This getter must be overridden with a change method of navigation controller it will be a extended.__<br>
	This method trigger the event {{#crossLink "BaseNavigationController/CHANGE_VIEW:event"}}{{/crossLink}} after complete.
	@method data
	@param {String} p_id
	@protected
	###
	change:(p_id)=>
		@trigger(BaseNavigationController.CHANGE_VIEW, {data:@data})
		false
	
	###*
	@method _appendToWrapper
	@param {BaseView} p_view
	@private
	###
	_appendToWrapper:(p_view)=>
		# attach subview to parent
		wrapper = p_view.parentView

		if p_view.parentView.subviewsWrapper?
			if !p_view.attachToParentWrapper?
				# attach subview to default subviews wrapper
				wrapper = p_view.parentView.subviewsWrapper
			else
				# attach subview to particular subviews wrapper
				wrapper = p_view.parentView.find(p_view.attachToParentWrapper)
		
		if !wrapper?
			throw new Error('The instance of wrapper is not attached on the parent view')
		else
			wrapper.appendChild(p_view)
		false
	
	###*
	@method _removeFromWrapper
	@param {BaseView} p_view
	@private
	###
	_removeFromWrapper:(p_view)=>
		# remove subview from parent
		wrapper = p_view?.parent || p_view?.parentView

		try
			wrapper?.removeChild(p_view)
		catch err
			console.log err.stack
		false
