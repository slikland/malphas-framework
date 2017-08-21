#import slikland.core.navigation.BaseNavigationController
#import slikland.utils.ArrayUtils

class ScrollNavigationController extends BaseNavigationController
	@SCROLL: 'navigation_controller_scroll'

	viewScrollPercent = 0

	constructor: () ->
		super

	@get type:->
		return 'scroll'

	@get visibleViews:->
		return @_visibleViews

	@get currentView:->
		return @_currentView

	@get previousView:->
		return @_previousView

	@get data:()->
		return {currentView:@currentView, previousView:@previousView, visibleViews:@_visibleViews}

	start:(p_id=null)->
		if app.config.navigation.options?
			@_options = app.config.navigation.options
		else
			throw new Error('The options object in config.json file must be created to use this navigation type, see a example in source code.')
			###
			"navigation":{
				"type":"scroll",
				"options":{
					"orientation":"vertical",
					"scrollToTime":0,
					"pauseInvisibleViews":true,
					"percentToShow":0.5,
					"snap":{
						"delay":0
					}
				}
			}
			###

		@_visibleViews = @_visibleViews || []
		@_autoScrolling = false

		@_orientation = if @_options.orientation? && (@_options.orientation == 'vertical' || @_options.orientation == 'horizontal') then @_options.orientation else 'vertical'
		@_snapDelay = if @_options.snap?.delay? && @_options.snap.delay > 0 then @_options.snap.delay else 0
		@_scrollToTime = if @_options.scrollToTime >= 0 then @_options.scrollToTime else .5
		@_percentToShow = if @_options.percentToShow >= 0 || @_options.percentToShow <= 1 then @_options.percentToShow else .5
		@_pauseInvisibleViews = if @_options.pauseInvisibleViews? then @_options.pauseInvisibleViews else true

		for k, v of app.config.views
			view = @_views.create(k)
			view.data.snap ?= true
			@_appendToWrapper(view)
			view.createStart()
		
		window.addEventListener "scroll", @_onScroll
		@_onScroll(null)
		
		super(p_id)

	change:(p_id)=>
		# returns if target view is the same
		if @_currentView?.id is p_id then return
		if @_currentView? then @_previousView = @_currentView
		@_currentView = @_views.create(p_id)

		@_scrollToView(p_id)
	
	_onScroll:(evt)=>
		@_visibleViews = @_visibleViews || []
		currentView = null

		for k, v of app.config.views
			view = @_views.create(k)
			
			if @_orientation == 'vertical'
				viewOffset = (view.height + view.element.offsetTop)
			else
				viewOffset = (view.width + view.element.offsetLeft)

			viewBounds = viewOffset - @scrollValue

			if @_isVisible(view)
				if @_visibleViews.indexOf(view) < 0 then @_visibleViews.push view
			else
				index = @_visibleViews.indexOf(view)
				if index >= 0 then ArrayUtils.removeItemByIndex(index, @_visibleViews)
			
			# TODO: add option of percentToShow for each view 
			# percentToShow = if view.percentToShow? then view.percentToShow else @_percentToShow
			if viewBounds > (@windowValue*@_percentToShow) and currentView == null
				currentView = view
				@_snapping(view)

				if @_currentView?.id is view.id then continue
				if @_currentView? then @_previousView = @_currentView
				@_currentView = @_views.create(view.id)

				@_show(view)
			else
				@_hide(view)
		@trigger(ScrollNavigationController.SCROLL, {percent:@scrollPercent, value:@scrollValue})
		
	_isVisible:(p_view)=>
		if @_orientation == 'vertical'
			elementTop = p_view.element.offsetTop
			elementBottom = elementTop + p_view.height
			return (@scrollValue + window.innerHeight) > elementTop && @scrollValue + window.innerHeight < (elementBottom + window.innerHeight)
		else
			elementLeft = p_view.element.offsetLeft
			elementRight = elementLeft + p_view.width
			return (@scrollValue + window.innerWidth) > elementLeft && @scrollValue + window.innerWidth < (elementRight + window.innerWidth)

	_snapping:(p_view)=>
		if !@_autoScrolling && @_snapDelay> 0
			TweenMax.killDelayedCallsTo @_scrollToView

			if p_view.data.snap || p_view.snap
				TweenMax.delayedCall @_snapDelay, @_scrollToView, [p_view.id]

	_show:(p_view)=>
		@trigger(BaseNavigationController.CHANGE_VIEW, {data:@data})
		if !p_view.showed
			p_view.showStart()
		else
			if @_pauseInvisibleViews then p_view.resume()

	_hide:(p_view)=>
		if !@_isVisible(p_view)
			if @_pauseInvisibleViews then p_view.pause()
		
		if p_view.id != @_currentView.id
			if p_view.showed
				p_view.hideStart()

	_scrollToView:(p_id)=>
		view = @_views.create(p_id)

		TweenMax.killDelayedCallsTo @_scrollToView
		TweenMax.killTweensOf window
		
		if @_orientation == 'vertical'
			orientation = {
				y:view.element.offsetTop,
				onAutoKill:@_onAutoKill
			}
		else
			orientation = {
				x:view.element.offsetLeft,
				onAutoKill:@_onAutoKill
			}

		TweenMax.to window, @_scrollToTime, {
			scrollTo:orientation, 
			ease:Quad.easeOut, 
			onStart:@_onStartAutoScroll, 
			onComplete:@_onCompleteAutoScroll,
			onCompleteParams:[view]
		}

	_onStartAutoScroll:()=>
		@_autoScrolling = true
	
	_onCompleteAutoScroll:(p_view)=>
		@_autoScrolling = false
		@_show(p_view)

	_onAutoKill:(evt)=>
		@_autoScrolling = false

	@get scrollPercent:()->
		body = document.body
		doc = document.documentElement
		if @_orientation == 'vertical'
			return ((doc.scrollTop + body.scrollTop) / (doc.scrollHeight - doc.clientHeight))
		else
			return ((doc.scrollLeft + body.scrollLeft) / (doc.scrollWidth - doc.clientWidth))

	@get scrollValue:->
		body = document.body
		doc = document.documentElement
		if @_orientation == 'vertical'
			if typeof pageYOffset != 'undefined'
				return pageYOffset
			else
				doc = if doc.clientHeight then doc else body
				return doc.scrollTop
		else
			if typeof pageXOffset != 'undefined'
				return pageXOffset
			else
				doc = if doc.clientWidth then doc else body
				return doc.scrollLeft
	
	@get windowValue:->
		return if @_orientation == 'vertical' then window.innerHeight else window.innerWidth

