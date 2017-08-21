#import slikland.core.navigation.MetaController
#import slikland.display.BaseDOM

###*
Base View
@class BaseView
@extends BaseDOM
@uses MetaController
###
class BaseView extends BaseDOM

	###*
	Triggered before the create routine view starts. Triggered when {{#crossLink "BaseView/createStart:method"}}{{/crossLink}} is called.
	@event CREATE_START
	@static
	###
	@CREATE_START: 'create_start'
	###*
	Triggered when the create routine view starts. Triggered when {{#crossLink "BaseView/create:method"}}{{/crossLink}} is called.
	@event CREATE
	@static
	###
	@CREATE: 'create'
	###*
	Triggered when the create routine view is finished. Triggered when {{#crossLink "BaseView/createComplete:method"}}{{/crossLink}} is called.
	@event CREATE_COMPLETE
	@static
	###
	@CREATE_COMPLETE: 'create_complete'

	###*
	Triggered before the showing routine view starts. Triggered when {{#crossLink "BaseView/showStart:method"}}{{/crossLink}} is called.
	@event SHOW_START
	@static
	###
	@SHOW_START: 'show_start'
	###*
	Triggered when the showing routine view starts. Triggered when {{#crossLink "BaseView/show:method"}}{{/crossLink}} is called.
	@event SHOW
	@static
	###
	@SHOW: 'show'
	###*
	Triggered when the showing routine view is finished. Triggered when {{#crossLink "BaseView/showComplete:method"}}{{/crossLink}} is called.
	@event SHOW_COMPLETE
	@static
	###
	@SHOW_COMPLETE: 'show_complete'

	###*
	Triggered before the hiding routine view starts. Triggered when {{#crossLink "BaseView/hideStart:method"}}{{/crossLink}} is called.
	@event HIDE_START
	@static
	###
	@HIDE_START: 'hide_start'
	###*
	Triggered when the hiding routine view starts. Triggered when {{#crossLink "BaseView/hide:method"}}{{/crossLink}} is called.
	@event HIDE
	@static
	###
	@HIDE: 'hide'
	###*
	Triggered when the hiding routine view is finished. Triggered when {{#crossLink "BaseView/hideComplete:method"}}{{/crossLink}} is called.
	@event HIDE_COMPLETE
	@static
	###
	@HIDE_COMPLETE: 'hide_complete'

	###*
	Triggered when the destroy routine view starts. Triggered when {{#crossLink "BaseView/destroy:method"}}{{/crossLink}} is called.
	@event DESTROY
	@static
	###
	@DESTROY: 'destroy'
	###*
	Triggered when the destroy routine view is finished. Triggered when {{#crossLink "BaseView/destroyComplete:method"}}{{/crossLink}} is called.
	@event DESTROY_COMPLETE
	@static
	###
	@DESTROY_COMPLETE: 'destroy_complete'

	###*
	Triggered when the view pauses. Usually when {{#crossLink "BaseView/pause:method"}}{{/crossLink}} is called.
	@event PAUSE
	@static
	###
	@PAUSE: 'pause'
	###*
	Triggered when the view resumes. Usually when {{#crossLink "BaseView/resume:method"}}{{/crossLink}} is called.
	@event RESUME
	@static
	###
	@RESUME: 'resume'

	###*
	@class BaseView
	@constructor	
	@param {Object} [p_data=null] 
	Data object sets the default and/or custom values of properties of view for navigation controller.<br>
	If this object it's not null, some default properties are not required explained below:
	Default Key|Type|Required
	-|-|-
	id|{{#crossLink "String"}}{{/crossLink}}|__Yes__
	class|{{#crossLink "String"}}{{/crossLink}}|__Yes__
	route|{{#crossLink "String"}}{{/crossLink}} / {{#crossLink "RegExp"}}{{/crossLink}}|__No__
	content|{{#crossLink "String"}}{{/crossLink}} / {{#crossLink "JSON"}}{{/crossLink}}|__No__
	cache|{{#crossLink "Boolean"}}{{/crossLink}}|__No__
	parentView|{{#crossLink "String"}}{{/crossLink}}|__No__
	destroyable|{{#crossLink "Boolean"}}{{/crossLink}}|__No__
	loadContent|{{#crossLink "Boolean"}}{{/crossLink}}|__No__
	snap *(only for scroll navigation type)*|{{#crossLink "Boolean"}}{{/crossLink}}|__No__
	subviewsWrapper|<a href="//developer.mozilla.org/en-US/docs/Web/Guide/CSS/Getting_Started/Selectors" target="_blank" class="crosslink">Selectors</a>|__No__
	attachToParentWrapper|<a href="//developer.mozilla.org/en-US/docs/Web/Guide/CSS/Getting_Started/Selectors" target="_blank" class="crosslink">Selectors</a>|__No__
	@example
	```
	{
		"id":"home",
		"class":"template-home-view", //the valid formats are "ClassName", "class-name", "class name" or "class_name"
		"route":"/", //valid formats are String or RegExp
		"content":"data/home.json",
		"cache":true,
		"parentView":"someViewID", //the unique ID of parent view
		"destroyable":true,
		"loadContent":true,
		"snap":true, //only for scroll navigation type
		"subviewsWrapper":"CSSSelector", //like #ID or .className etc
		"attachToParentWrapper":"CSSSelector" //like #ID or .className etc
	}
	```
	@param {String} [p_CSSClassName=null]
	###
	_meta = null
	constructor: (p_data=null, p_CSSClassName=null) ->
		@_created = false
		@_showed = false
		
		@data = if p_data then p_data else {}
		@id = if @_data.id? then @_data.id
		@content = if @_data.content? then @_data.content
		@route = if @_data.route? then @_data.route
		@routeData = if !@_routeData then null
		@parentView = if @_data.parentView? then @_data.parentView
		@subviews = if @_data.subviews? then @_data.subviews
		@destroyable = if @_data.destroyable? then @_data.destroyable
		
		_meta = MetaController.getInstance()
		super({element:'div', className:p_CSSClassName})

	###*
	Returns the loader queue of this specific view.
	@attribute loader
	@type {createjs.LoadQueue}
	@default null
	@readOnly
	###
	@get loader:->
		return if @_id? then app?.loader?.getGroup(@_id) else null

	###*
	Returns true if the view was created.
	@attribute created
	@type {Boolean}
	@default false
	@protected
	@readOnly
	###
	@get created:->
		return @_created

	###*
	Returns true if the view was shown.
	@attribute showed
	@type {Boolean}
	@default false
	@protected
	@readOnly
	###
	@get showed:->
		return @_showed

	###*
	Sets/gets a clone of data object with default and/or custom values of properties of view.
	@attribute data
	@type {Object}
	@default {}
	###
	@get data:->
		return @_data
	@set data:(p_value)->
		@_data = ObjectUtils.clone(p_value)

	###*
	Sets/gets the unique ID of view.
	@attribute id
	@type {String}
	@default null
	###
	@get id:->
		return @_id
	@set id:(p_value)->
		@_id = p_value

	###*
	Sets/gets the unique ID of view.
	@attribute content
	@type {String|Object|JSON}
	@default null
	###
	@get content:->
		return @_content
	@set content:(p_value)->
		@_content = p_value

	###*
	Sets/gets the route of view.
	@attribute route
	@type {String|RegExp}
	@default null
	###
	@get route:->
		return @_route
	@set route:(p_value)->
		@_route = p_value

	###*
	Sets/gets the actual route data.
	@attribute routeData
	@type {Object}
	@protected
	@default null
	###
	@get routeData:->
		return @_routeData
	@set routeData:(p_value)->
		@_routeData = p_value

	###*
	Sets/gets the parent view of this view.
	@attribute parentView
	@type {BaseView}
	@default null
	###
	@get parentView:->
		return @_parentView
	@set parentView:(p_value)->
		@_parentView = p_value

	###*
	Sets/gets a array of {{#crossLink "BaseView"}}{{/crossLink}} instances of subviews of this view.
	@attribute subviews
	@type {Array}
	@default null
	###
	@get subviews:->
		return @_subviews
	@set subviews:(p_value)->
		@_subviews = p_value

	###*
	Sets/gets if this views is destroyable.
	@attribute destroyable
	@type {Boolean}
	@default false
	###
	@get destroyable:->
		return @_destroyable
	@set destroyable:(p_value)->
		@_destroyable = p_value

	###*
	Sets/gets the type is a 'view' or a 'sub-view'.
	@attribute type
	@type {String}
	@protected
	@default null
	###
	@get type:->
		return @_type
	@set type:(p_value)->
		@_type = p_value

	###*
	Returns the meta object of his content.
	@attribute meta
	@type {Object}
	@default null
	@readOnly
	###
	@get meta:()->
		return if @_content?.meta? then @_content?.meta

	###*
	Sets/gets the loading progress of this view.
	@attribute progress
	@type {Number}
	@protected
	###
	@get progress:->
		return if @_progress? then @_progress else @loader.progress
	@set progress:(p_value)->
		@_progress = p_value

	###*
	Returns the reverse path of his parent view.
	@attribute reverseParentPath
	@type {Array}
	@protected
	@readOnly
	###
	@get reverseParentPath:->
		@getReverseParentList(@)
		return @_parentPath.reverse()

	###*
	Returns the path of his parent view.
	@attribute parentPath
	@type {Array}
	@protected
	@readOnly
	###
	@get parentPath:->
		@getReverseParentList(@)
		return @_parentPath

	###*
	Returns the wrapper container for the sub-views of this view.
	@attribute subviewsWrapper
	@type {HTMLElement}
	@default null
	@readOnly
	###
	@get subviewsWrapper:()->
		return if @_data?.subviewsWrapper? then @find(@_data.subviewsWrapper)

	###*
	Returns the CSS Selector of the wrapper container for attach this view.
	@attribute attachToParentWrapper
	@type {String}
	@default null
	@readOnly
	###
	@get attachToParentWrapper:()->
		return if @_data?.attachToParentWrapper? then @_data.attachToParentWrapper

	###*
	Returns a reverse list of the parent path of this view.
	@method getReverseParentList
	@param {Object|JSON} [p_subview=null]
	@private
	@readOnly
	###
	getReverseParentList:(p_subview=null)=>
		@_parentPath = []
		if p_subview?.parentView?
			@getReverseParentList(p_subview.parentView)
			@_parentPath.push p_subview.id
		false

	###*
	Usually starts before the creation routine of view calling by the navigation controller.<br>
	Callback the method {{#crossLink "BaseView/create:method"}}{{/crossLink}} and trigger the event {{#crossLink "BaseView/CREATE_START:event"}}{{/crossLink}} after complete.
	@method createStart
	@param {Event} [evt=null]
	###
	createStart:(evt=null)=>
		@trigger(BaseView.CREATE_START, @)
		@create()
		false

	###*
	Usually starts when the creation routine of view calling by the navigation controller.<br>
	Callback the method {{#crossLink "BaseView/createComplete:method"}}{{/crossLink}} and trigger the event {{#crossLink "BaseView/CREATE:event"}}{{/crossLink}} after complete.
	@method create
	@param {Event} [evt=null]
	###
	create:(evt=null)=>
		@trigger(BaseView.CREATE, @)
		@createComplete()
		false

	###*
	Usually starts when finished the creation routine of view calling by the navigation controller and trigger the event {{#crossLink "BaseView/CREATE_COMPLETE:event"}}{{/crossLink}} after complete the routine.
	@method createComplete
	@param {Event} [evt=null]
	###
	createComplete:(evt=null)=>
		@_created = true
		@trigger(BaseView.CREATE_COMPLETE, @)
		false
		
	###*
	Usually starts before the showing routine of view calling by the navigation controller.<br>
	Callback the method {{#crossLink "BaseView/show:method"}}{{/crossLink}} and trigger the event {{#crossLink "BaseView/SHOW_START:event"}}{{/crossLink}} after complete.
	@method showStart
	@param {Event} [evt=null]
	###
	showStart:(evt=null)=>
		@trigger(BaseView.SHOW_START, @)
		_meta.change(@meta)
		@show()
		false

	###*
	Usually starts when the showing routine of view calling by the navigation controller.<br>
	Callback the method {{#crossLink "BaseView/showComplete:method"}}{{/crossLink}} and trigger the event {{#crossLink "BaseView/SHOW:event"}}{{/crossLink}} after complete.
	@method show
	@param {Event} [evt=null]
	###
	show:(evt=null)=>
		@trigger(BaseView.SHOW, @)
		@showComplete()
		false

	###*
	Usually when finished the showing routine of view calling by the navigation controller and trigger the event {{#crossLink "BaseView/SHOW_COMPLETE:event"}}{{/crossLink}} after complete the routine.
	@method showComplete
	@param {Event} [evt=null]
	###
	showComplete:(evt=null)=>
		@_showed = true
		@trigger(BaseView.SHOW_COMPLETE, @)
		false

	###*
	Usually starts before the hiding routine of view calling by the navigation controller.<br>
	Callback the method {{#crossLink "BaseView/hide:method"}}{{/crossLink}} and trigger the event {{#crossLink "BaseView/HIDE_START:event"}}{{/crossLink}} after complete.
	@method hideStart
	@param {Event} [evt=null]
	###
	hideStart:(evt=null)=>
		@trigger(BaseView.HIDE_START, @)
		@hide()
		false

	###*
	Usually starts when the hiding routine of view calling by the navigation controller.<br>
	Callback the method {{#crossLink "BaseView/hideComplete:method"}}{{/crossLink}} and trigger the event {{#crossLink "BaseView/HIDE:event"}}{{/crossLink}} after complete.
	@method hide
	@param {Event} [evt=null]
	###
	hide:(evt=null)=>
		@_showed = false
		@trigger(BaseView.HIDE, @)
		@hideComplete()
		false

	###*
	Usually when finished the hiding routine of view calling by the navigation controller and trigger the event {{#crossLink "BaseView/HIDE_COMPLETE:event"}}{{/crossLink}} after complete the routine.
	@method hideComplete
	@param {Event} [evt=null]
	###
	hideComplete:(evt=null)=>
		@trigger(BaseView.HIDE_COMPLETE, @)
		false

	###*
	Usually used to pauses animations or something else in looping in view.
	Trigger the event {{#crossLink "BaseView/PAUSE:event"}}{{/crossLink}} after complete.
	@method pause
	###
	pause:()=>
		@trigger(BaseView.PAUSE, @)
		false

	###*
	Usually used to resumes animations or something else in view.
	Trigger the event {{#crossLink "BaseView/RESUME:event"}}{{/crossLink}} after complete.
	@method pause
	###
	resume:()=>
		@trigger(BaseView.RESUME, @)
		false
	
	###*
	Usually starts when the destroying routine of view calling by the navigation controller.<br>
	Callback the method {{#crossLink "BaseView/destroyComplete:method"}}{{/crossLink}} and trigger the event {{#crossLink "BaseView/DESTROY:event"}}{{/crossLink}} after complete.
	@method destroy
	@param {Event} [evt=null]
	###
	destroy:(evt=null)=>
		@_created = false

		@removeAll()

		@_parentPath?.length = 0
		@_parentPath = null

		@_routeData = null
		@_data = null

		@trigger(BaseView.DESTROY, @)
		@destroyComplete()
		false

	###*
	Usually when finished the destroying routine of view calling by the navigation controller and trigger the event {{#crossLink "BaseView/DESTROY_COMPLETE:event"}}{{/crossLink}} after complete the routine.
	@method destroyComplete
	@param {Event} [evt=null]
	###
	destroyComplete:(evt=null)=>
		@trigger(BaseView.DESTROY_COMPLETE, @)
		@off()
		false
