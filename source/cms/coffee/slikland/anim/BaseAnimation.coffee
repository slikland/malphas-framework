# import slikland.anim.AnimationTicker

###*
BaseAnimation interface class for most frame / time based animation.<br>
Please do not instantiate this class. Use the extended classes.
@class BaseAnimation
@extends BaseDOM

###

class BaseAnimation extends BaseDOM

	###*
	Triggered when animation starts. Usually when {{#crossLink "BaseAnimation/play:method"}}{{/crossLink}} is called.
	@event PLAY
	###
	@PLAY: 'animation_play'

	###*
	Triggered when animation stops. Usually when {{#crossLink "BaseAnimation/stop:method"}}{{/crossLink}} is called.
	@event STOP
	###
	@STOP: 'animation_stop'

	###*
	Triggered when animation resumes. Usually when {{#crossLink "BaseAnimation/resume:method"}}{{/crossLink}} is called.
	@event RESUME
	###
	@RESUME: 'animation_resume'

	###*
	Triggered when animation pauses. Usually when {{#crossLink "BaseAnimation/pause:method"}}{{/crossLink}} is called.
	@event PAUSE
	###
	@PAUSE: 'animation_pause'

	###*
	Triggered when animation finishes.
	@event COMPLETE
	###
	@COMPLETE: 'animation_complete'

	###*
	Triggered when animation reached the end and repeats.
	@event REPEAT
	###
	@REPEAT: 'animation_repeat'

	###*
	Triggered when animation changes it's frame.
	@event UPDATE
	###
	@UPDATE: 'animation_update'

	_repeat: false
	_fps: 15

	#Inverted FPS value
	_iFps: 0

	_currentTime: 0
	_totalTime: 0
	_durationTime: 0
	_currentFrame: 0
	_totalFrames: 0
	_durationFrames: 0
	_currentLabel: null
	_animData: null
	_currentAnimData: null
	_labels: []

	constructor:()->
		if @constructor.name == 'BaseAnimation'
			throw new Error('Please extend me.')
		super({element: 'div', className: 'animation'})

	###*
	Return true if the animation was paused

	@attribute paused
	@type Boolean
	@readOnly
	###
	@get paused:()->
		return @_paused


	###*
	Define if the animation will repeat or not.<br>
	By default it's set to false.<br>
	If the value is set to true, it will repeat infinitely.<br>
	This value can also be changed when calling the {{#crossLink "BaseAnimation/play:method"}}{{/crossLink}} method.

	@attribute repeat
	@default false
	@type Boolean | Number
	###
	@get repeat:()->
		return @_repeat

	@set repeat:(value)->
		@_repeat = value

	###*
	Frame rate of animation.
	@attribute fps
	@type Number
	###
	
	@get fps:()->
		return @_fps
	@set fps:(value)->
		if isNaN(value)
			throw new Error('fps isNaN')
		@_fps = value
		@_iFps = 1 / @_fps
		@_dirty = true

	###*
	Current time of the animation in seconds.
	If it's playing a specific label, it refers to the portion of the label.
	
	@attribute currentTime
	@type Number
	###
	@get currentTime:()->
		return @_currentTime
	@set currentTime:(value)->
		if isNaN(value)
			throw new Error('currentTime isNaN')
		@_currentTime = value
		@_dirty = true

	###*
	Total time of the animation in seconds.
	If it's playing a specific label, it refers to the portion of the label.
	
	@attribute totalTime
	@type Number
	@readOnly
	###
	@get totalTime:()->
		return @_totalTime

	###*
	Current frame number of the animation.
	If it's playing a specific label, it refers to the portion of the label.
	
	@attribute currentFrame
	@type Number
	###
	
	@get currentFrame:()->
		return @_currentFrame
	@set currentFrame:(value)->
		if isNaN(value)
			throw new Error('currentFrame isNaN')
		@_currentFrame = value
		@_dirty = true

	###*
	Duration in frames of the animation.
	If it's playing a specific label, it refers to the portion of the label.
	
	@attribute durationFrames
	@type Number
	@readOnly
	###
	
	@get durationFrames:()->
		return @_durationFrames

	###*
	Total number of frames of the animation.
	
	@attribute totalFrames
	@type Number
	@readOnly
	###
	
	@get totalFrames:()->
		return @_totalFrames

	###*
	The name of label currently playing.
	
	@attribute currentLabel
	@type String
	@readOnly
	###
	
	@get currentLabel:()->
		return @_currentLabel

	@set _dirty:(value)->
		if !value
			return
		clearTimeout(@_dirtyTimeout)
		@_dirtyTimeout = setTimeout(@_redraw, 0)

	@set _labelsDirty:(value)->
		if !value
			return
		clearTimeout(@_labelsDirtyTimeout)
		@_labelsDirtyTimeout = setTimeout(@_updateLabels, 0)

	###*
	Add a section of frames with a label name.
	@method addLabel
	@param {String} name Name of the label
	@param {Number} start Number of frame that the animation should start
	@param {Number} [end] Last frame of the section. If this parameter is not set, will get the next label's `start` or the last frame of entire animation.
	###
	addLabel:(name, start, end = null)->
		@removeLabel(name)
		@_labels.push({name: name, start: start, end: end})
		@_labelsDirty = true

	###*
	Remove a label
	@method removeLabel
	@param {String} name Name of the label
	###
	removeLabel:(name)->
		i = @_labels.length
		while i-- > 0
			if @_labels[i].name == name
				@_labels.splice(i, 1)
		@_labelsDirty = true

	_updateLabels:()=>
		@_labels.sort(@_sortLabels)
		f0 = f1 = @_totalFrames - 1
		i = @_labels.length
		while i-- > 0
			labelData = @_labels[i]
			if labelData.end is null
				labelData.duration = f0 - labelData.start
			else
				labelData.duration = labelData.end - labelData.start
			if labelData.start != f1
				f0 = f1
				f1 = labelData.start

		@_numLabels = @_labels.length
	_sortLabels:(a, b)=>
		if a.start < b.start
			return -1
		if a.start > b.start
			return 1
		if a.end > b.end
			return -1
		if a.end < b.end
			return 1
		return 0

	###*
	Play the animation.<br>
	It receives a `data` object which is optional with some settings.
	@method play
	@param {Object} [data={}] Data with values explained below:
	Name |Type|Default|Description
	-----|----|:------|-----------
	delay|Number|0|Delay in seconds to start the animation
	{{#crossLink "BaseAnimation/repeat:attribute"}}{{/crossLink}}|Boolean&nbsp;\|&nbsp;Number|false|If the animation should repeat. If number is passed, will repeat the amount of number defined.
	label|String|null|The label of the animation to play. If nothing is passed, will play the entire animation.
	###
	play:(data = {})->
		@_paused = false
		@_repeat = data.repeat || false
		@_animData = @_getLabelData(data.label)
		@_durationFrames = @_animData.duration
		@_durationTime = @_durationFrames * @_iFps
		@_currentFrame = 0
		@_currentTime = 0
		AnimationTicker.add(@_update, {fps: @_fps, delay: data.delay || 0})
		@trigger(@constructor.PLAY)

	###*
	Resume the animation. If the {{#crossLink "BaseAnimation/play:method"}}{{/crossLink}} method was called with a label, it will resume the portion of the specified label
	@method resume
	###
	resume:()->
		if !@_animData
			throw new Error('Resume can only be called after a pause.')
		@_paused = false
		AnimationTicker.add(@_update, {fps: @_fps, initFrame: @_currentFrame})
		@trigger(@constructor.RESUME)

	###*
	Pause the animation.
	@method pause
	###
	pause:()->
		if !@_animData
			throw new Error('Can\'t pause an animation that is not playing.')
		@_paused = true
		AnimationTicker.remove(@_update)
		@trigger(@constructor.PAUSE)

	###*
	Stop the animation and goes to last frame.
	@method stop
	###
	stop:()->
		if !@_animData
			throw new Error('Can\'t stop an animation that is not playing.')
		@_paused = false
		AnimationTicker.remove(@_update)
		# @currentFrame = 0
		@trigger(@constructor.STOP)

	_getLabelData:(label = null)->
		data = {start: 0, end: @_totalFrames - 1, duration: @_totalFrames}
		if !@_numLabels?
			@_updateLabels()
		if label
			i = @_numLabels
			while i-- > 0
				if @_labels[i].name == label
					data = @_labels[i]
					break
		return data

	_update:(data)=>
		if !@_animData
			throw new Error('Can\'t update without _animData')
		f = data.frame
		nf = ((f % @_durationFrames) + @_durationFrames) % @_durationFrames
		if nf == @_currentFrame
			return

		@stackTrigger(@constructor.UPDATE)
		if f >= @_durationFrames
			if @_repeat
				@stackTrigger(@constructor.REPEAT)
			else
				@stackTrigger(@constructor.COMPLETE)
				@stop()
				f = @_durationFrames - 1

		@_currentFrame = ((f % @_durationFrames) + @_durationFrames) % @_durationFrames
		@_currentTime = @_currentFrame * @_iFps
		@_dirty = true

	_redraw:()=>
		throw new Error('Method _redraw not overwritten.')