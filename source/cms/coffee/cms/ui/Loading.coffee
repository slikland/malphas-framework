#namespace cms.ui
class Loading extends BaseDOM
	@HIDE_COMPLETE: 'loading_hideComplete'
	constructor:()->
		super({element: 'loading'})
		@_progress = @_currentPosition = 0
		@_showPosition = 0
		@_element.removable = false
		@_background = new BaseDOM({element:'div', className: 'background'})
		@_progressBar = new BaseDOM({element:'div', className: 'progress-bar'})

		@appendChild(@_background)
		@appendChild(@_progressBar)

	@get progress:()->
		return @_progress
	@set progress:(value)->
		if value < 0
			value = 0
		else if value > 1
			value = 1
		@_progress = value
		KTween.remove(@, '_position')
		KTween.tween(@, {_position: @_progress}, 'easeOutQuart', 0.3)

	@get _position:()->
		return @_currentPosition
	@set _position:(value)->
		if value < 0
			value = 0
		else if value > 1
			value = 1
		@_currentPosition = value
		@_progressBar.css({width: (value * 100) + '%'})
	@get showPosition:()->
		return @_showPosition
	@set showPosition:(value)->
		if value < 0
			value = 0
		else if value > 1
			value = 1
		@_showPosition = value

		op = value * 2 - 1
		if op < 0
			op = 0
		else if op > 1
			op = 1


		@_background.css({opacity: op})
		@_progressBar.css({height: (value * 4) + 'px'})

	reset:()->
		KTween.remove(@)
		@showPosition = 0
		@progress = @_position = 0
	show:()->
		@css({visibility: '', display: ''})
		@reset()
		@removeClass('disabled')
		KTween.tween(@, {showPosition: 1}, 'easeOutQuart', 0.1)

	hide:()->
		@addClass('disabled')
		@progress = 1
		KTween.remove(@, '_position')
		KTween.tween(@, {_position: @_progress, onComplete: @_hideStart}, 'easeOutQuart', 0.2)
	
	_hideStart:()=>
		KTween.remove(@, 'showPosition')
		KTween.tween(@, {showPosition: 0, onComplete: @_hideComplete}, 'easeOutQuart', 0.1)
	_hideComplete:()=>
		@css({visibility: 'hidden'})
		@trigger(@HIDE_COMPLETE)
		# if @_element.parentNode
		# 	@_element.parentNode.removeChild(@_element)
