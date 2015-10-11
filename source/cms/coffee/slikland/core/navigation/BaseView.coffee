#import slikland.display.BaseDOM

class BaseView extends BaseDOM

	@CREATE_START: 'create_start'
	@CREATE: 'create'
	@CREATE_COMPLETE: 'create_complete'

	@SHOW_START: 'show_start'
	@SHOW: 'show'
	@SHOW_COMPLETE: 'show_complete'

	@HIDE_START: 'hide_start'
	@HIDE: 'hide'
	@HIDE_COMPLETE: 'hide_complete'

	@DESTROY: 'destroy'
	@DESTROY_COMPLETE: 'destroy_complete'

	constructor: (p_data=null, p_className=null) ->
		@_created = false
		
		@_data = if p_data then p_data else {}
		@_id = if @_data.id? then @_data.id
		@_content = if @_data.content? then @_data.content
		@_route = if @_data.route? then @_data.route
		@_parent = if @_data.parent? then @_data.parent
		@_subviews = if @_data.subviews? then @_data.subviews
		@_destroyable = if @_data.destroyable? then @_data.destroyable

		super({element:'div', className:p_className+'-view'})

	@get data:->
		return @_data
	@set data:(p_value)->
		@_data = ObjectUtils.clone(p_value)

	@get id:->
		return @_id
	@set id:(p_value)->
		@_id = p_value

	@get content:->
		return @_content
	@set content:(p_value)->
		@_content = p_value

	@get route:->
		return @_route
	@set route:(p_value)->
		@_route = p_value

	@get parent:->
		return @_parent
	@set parent:(p_value)->
		@_parent = p_value

	@get loader:->
		return if @_id? then app?.loader?.getGroup(@id)

	@get created:->
		return @_created

	@get subviews:->
		return @_subviews
	@set subviews:(p_value)->
		@_subviews = p_value

	@get destroyable:->
		return @_destroyable
	@set destroyable:(p_value)->
		@_destroyable = p_value

	@get type:->
		return @_type
	@set type:(p_value)->
		@_type = p_value

	@get meta:->
		return if @content?.meta? then @content.meta
	@set meta:(p_value)->
		@_meta = p_value

	@get progress:->
		return @_progress
	@set progress:(p_value)->
		@_progress = p_value

	@get openedSubview:->
		return @_openedSubviewID
	@set openedSubview:(p_value)->
		@_openedSubviewID = p_value

	@get reverseParentPath:->
		@getReverseParentList(@)
		return @_parentPath.reverse()

	@get parentPath:->
		@getReverseParentList(@)
		return @_parentPath

	getReverseParentList:(p_subview=null)=>
		@_parentPath = []
		if p_subview?.parent?
			@getReverseParentList(p_subview.parent)
			@_parentPath.push p_subview.id
		false

	createStart:(evt=null)=>
		@trigger(BaseView.CREATE_START, @)
		@create()
		false
		
	create:(evt=null)=>
		@trigger(BaseView.CREATE, @)
		@createComplete()
		false

	createComplete:(evt=null)=>
		@_created = true
		@trigger(BaseView.CREATE_COMPLETE, @)
		false
		
	showStart:(evt=null)=>
		@trigger(BaseView.SHOW_START, @)
		@show()
		false

	show:(evt=null)=>
		@trigger(BaseView.SHOW, @)
		@showComplete()
		false

	showComplete:(evt=null)=>
		@trigger(BaseView.SHOW_COMPLETE, @)
		false

	hideStart:(evt=null)=>
		@trigger(BaseView.HIDE_START, @)
		@hide()
		false

	hide:(evt=null)=>
		@trigger(BaseView.HIDE, @)
		@hideComplete()
		false

	hideComplete:(evt=null)=>
		@trigger(BaseView.HIDE_COMPLETE, @)
		false
	
	destroy:(evt=null)=>
		@removeAll()

		@_parentPath?.length = 0
		@_parentPath = null

		@_data = null

		@trigger(BaseView.DESTROY, @)
		@destroyComplete()
		false

	destroyComplete:(evt=null)=>
		@_created = false
		@trigger(BaseView.DESTROY_COMPLETE, @)
		@off()
		false
