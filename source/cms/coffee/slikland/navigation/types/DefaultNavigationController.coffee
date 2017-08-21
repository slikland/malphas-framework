#import slikland.core.navigation.BaseNavigationController

class DefaultNavigationController extends BaseNavigationController
	@HIDE_ALL_SUBVIEWS: 'navigation_controller_hide_all_subviews'
	@SHOW_ALL_SUBVIEWS: 'navigation_controller_show_all_subviews'

	constructor: () ->
		super

	@get type:->
		return 'default'

	@get visibleViews:->
		return [@_currentView]

	@get currentView:->
		return @_currentView

	@get previousView:->
		return @_previousView

	@get data:->
		return {currentView:@currentView, previousView:@previousView, visibleViews:@visiblesViews}

	change:(p_id)=>
		# returns if target view is the same
		if @_currentView?.id is p_id then return

		if @_currentView?
			@_previousView = @_currentView
			@_currentView = @_views.create(p_id)

			if @_currentView.parentPath.indexOf(@_previousView.id) isnt -1
				# shows the subview of up level of parent path
				@indexView = @_currentView.parentPath.indexOf(@_previousView.id)+1
				@maxIndexView = @_currentView.parentPath.length-1
				@_create()
			else if @_previousView.parentPath.indexOf(p_id) isnt -1
				# hide the subviews of down level of parent path
				@indexView = 0
				@maxIndexView = (@_previousView.parentPath.length-1)-(@_previousView.parentPath.indexOf(p_id)+1)
				@_hide()
			else if @_currentView.parentPath.indexOf(@_previousView.parentView.id) isnt -1
				# hide subview and show current view of same level
				# 
				# TODO: Fix hide and show when the level of parent not is 0
				# 
				@indexView = 0
				@maxIndexView = @_currentView.parentPath.indexOf(@_previousView.parentView.id)
				
				@on(DefaultNavigationController.HIDE_ALL_SUBVIEWS, @_hideAllCallback)
				@_hide()
			else if @_previousView.parentPath.indexOf(@_currentView.parentView.id) isnt -1
				# hide subview and show current view of same level
				# 
				# TODO: Fix hide and show when the level of parent not is 0
				# 
				@indexView = 0
				@maxIndexView = (@_previousView.parentPath.length-1)-(@_previousView.parentPath.indexOf(@_currentView.parentView.id)+1)
				
				@on(DefaultNavigationController.HIDE_ALL_SUBVIEWS, @_hideAllCallback)
				@_hide()
			else
				# hide all views or subviews and show next current view
				@indexView = 0
				@maxIndexView = @_previousView.parentPath.length-1
				@on(DefaultNavigationController.HIDE_ALL_SUBVIEWS, @_hideAllCallback)
				@_hide()
		else
			# show first view or subview
			@_currentView = @_views.create(p_id)
			@indexView = 0
			@maxIndexView = @_currentView.parentPath.length-1
			@_create()
		super
	
	_create:(evt=null)=>
		evt?.currentTarget?.off?(evt?.type, @_create)

		view = @_views.create(@_currentView.parentPath[@indexView])
		@_appendToWrapper(view)
		
		if !view.created
			view.on(BaseView.CREATE_COMPLETE, @_show)
			view.createStart()
		else
			@_show(view)
		false
	
	_show:(evt=null)=>
		view = if !evt.currentTarget? then evt else evt.currentTarget
		view.off(BaseView.CREATE_COMPLETE, @_show)

		if !view.showed
			view.on(BaseView.SHOW_COMPLETE, @_showComplete)
			view.showStart()
		else
			@_showComplete(view)
		false

	_showComplete:(evt=null)=>
		view = if !evt.currentTarget? then evt else evt.currentTarget
		view.off(BaseView.SHOW_COMPLETE, @_showComplete)
		@_showNext(view)
		false

	_showNext:(p_view)=>
		if @indexView<@maxIndexView
			@indexView++
			@_create()
		else
			@trigger(DefaultNavigationController.SHOW_ALL_SUBVIEWS)
		@trigger(BaseNavigationController.CHANGE, {view:p_view, transition:'show'})
		false
		
	_hideAllCallback:(evt)=>
		evt?.currentTarget?.off?(evt?.type, @_hideAllCallback)

		@indexView = 0
		@maxIndexView = @_currentView.parentPath.length-1
		@_create()
		false

	_hide:(evt=null)=>
		evt?.currentTarget?.off?(evt?.type, @_hide)

		view = @_views.create(@_previousView.reverseParentPath[@indexView])
		view.on(BaseView.HIDE_COMPLETE, @_hideComplete)
		view.hideStart()
		false

	_hideComplete:(evt=null)=>
		view = evt.currentTarget
		view.off(BaseView.HIDE_COMPLETE, @_hideComplete)
		
		if view.destroyable
			view.on(BaseView.DESTROY_COMPLETE, @_destroyComplete)
			view.destroy()
		else
			@_removeFromWrapper(view)
			@_hideNext(view)
		false
	
	_hideNext:(p_view)=>
		if @indexView<@maxIndexView
			@indexView++
			@_hide()
		else
			@trigger(DefaultNavigationController.HIDE_ALL_SUBVIEWS)
		@trigger(BaseNavigationController.CHANGE, {view:p_view, transition:'hide'})
		false

	_destroyComplete:(evt)=>
		view = evt.currentTarget
		view.off(BaseView.DESTROY_COMPLETE, @_destroyComplete)
		
		@_removeFromWrapper(view)
		@_views.remove(view.id)
		@_hideNext(view)
		false
