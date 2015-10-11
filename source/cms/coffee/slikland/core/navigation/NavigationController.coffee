#import slikland.core.navigation.ViewsData

class NavigationController extends EventDispatcher
	@CHANGE : "change"
	@CHANGE_VIEW : "change_view"

	@HIDE_ALL_SUBVIEWS: 'hide_all_subviews'
	@SHOW_ALL_SUBVIEWS: 'show_all_subviews'

	_currentView: null
	_previousView: null

	constructor: () ->
		super

	setup: (p_data) ->
		@_views = new ViewsData(p_data)
		false

	start:(p_id=null)->
		if @_started
			throw new Error('This instance of NavigationController already started')
			return
		@_started = true

		if app.navigation?.instantiateViews || app.navigation?.instantiateViews is undefined
			@_views.createAll()

		if !p_id
			view = app.config.navigation.defaultView
		else
			view = p_id

		@goto(view)
		false
		
	goto:(p_id)->
		@_change(p_id)
		false

	_change:(p_id)=>
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
			else
				# hide all views or subviews and show next current view
				@indexView = 0
				@maxIndexView = @_previousView.parentPath.length-1
				@on(NavigationController.HIDE_ALL_SUBVIEWS, @_hideAllCallback)
				@_hide()
		else
			# show first view or subview
			@_currentView = @_views.create(p_id)
			@indexView = 0
			@maxIndexView = @_currentView.parentPath.length-1
			@_create()
		@trigger(NavigationController.CHANGE_VIEW, {currentView:@_currentView, previousView:@_previousView})
		false
	
	_create:(evt=null)=>
		evt?.currentTarget?.off?(evt?.type, @_create)

		view = @_views.create(@_currentView.parentPath[@indexView])
		@_appendToParent(view)
		
		if !view.created
			view.on(BaseView.CREATE_COMPLETE, @_show)
			view.createStart()
		else
			@_show(view)
		false
	
	_show:(evt=null)=>
		view = if !evt.currentTarget? then evt else evt.currentTarget
		view.off(BaseView.CREATE_COMPLETE, @_show)

		view.on(BaseView.SHOW_COMPLETE, @_showComplete)
		view.showStart()
		false

	_showComplete:(evt)=>
		view = evt.currentTarget
		view.off(BaseView.SHOW_COMPLETE, @_showComplete)
		@_showNext(view)
		false

	_showNext:(p_view)=>
		if @indexView<@maxIndexView
			@indexView++
			@_create()
			
			@trigger(NavigationController.CHANGE, {view:p_view})
		else
			@trigger(NavigationController.SHOW_ALL_SUBVIEWS)
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
			@_removeFromParent(view)
			@_hideNext(view)
		false
	
	_hideNext:(p_view)=>
		if @indexView<@maxIndexView
			@indexView++
			@_hide()
			
			@trigger(NavigationController.CHANGE, {view:p_view})
		else
			@trigger(NavigationController.HIDE_ALL_SUBVIEWS)
		false

	_destroyComplete:(evt)=>
		view = evt.currentTarget
		view.off(BaseView.DESTROY_COMPLETE, @_destroyComplete)
		
		@_removeFromParent(view)
		@_views.remove(view.id)
		@_hideNext(view)
		false

	_appendToParent:(p_view)=>
		if p_view
			try
				p_view.parent.appendChild(p_view)
			catch err
				console.log err.stack
		
	_removeFromParent:(p_view)=>
		if p_view
			try
				p_view.parent.removeChild(p_view)
			catch err
				console.log err.stack

