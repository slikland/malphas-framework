@createjs = @createjs or {}
do ->
	MediaRequest = (loadItem, tag, srcAttribute) ->
		@fullBuffer = loadItem.fullBuffer

		@AbstractRequest_constructor loadItem
		@_tag = tag
		@_tagSrcAttribute = srcAttribute
		
		@_complete = createjs.proxy(@_handleTagComplete, @)
		return

	'use strict'
	p = createjs.extend(MediaRequest, createjs.TagRequest)
	s = MediaRequest

	p.load = ->
		_progress = createjs.proxy(@_handleProgress, @)
		@_handleProgress = _progress

		_stalled = createjs.proxy(@_handleStalled, @)
		@_handleStalled = _stalled

		_error = createjs.proxy(@_handleError, @)
		@_handleError = _error
		
		_timeout = createjs.proxy(@_handleTimeout, @)
		@_handleTimeout = _timeout

		@____timer = setInterval _progress, 10
		if @_tag.addEventListener
			@_tag.addEventListener 'progress', _progress
			@_tag.addEventListener 'stalled', _stalled
			@_tag.addEventListener 'error', _error
		else
			@_tag.onprogress = _progress
			@_tag.onstalled = _stalled
			@_tag.onerror = _error

		if @fullBuffer || @fullBuffer is undefined
			if @_tag.addEventListener
				@_tag.addEventListener 'ended', @_complete, false
				@_tag.addEventListener 'complete', @_complete, false
			else
				@_tag.onended = @_tag.oncomplete = @_complete
		else
			if @_tag.addEventListener
				@_tag.addEventListener 'canplaythrough', @_complete, false
			else
				@_tag.oncanplaythrough = @_complete

		@TagRequest_load()
		return

	p._handleTimeout = ->
		return

	p._handleStalled = ->
		#Ignore, let the timeout take care of it. Sometimes its not really stopped.
		return

	p._handleError = (evt) ->
		try
			console.log evt.data
			throw new Error(evt.title)
		catch err
			console.log err.stack

	p._handleProgress = () ->
		try
			loaded = @_tag.buffered.end(@_tag.buffered.length - 1)
			total = @_tag.duration
			
			@_tag.currentTime = loaded

			@dispatchEvent new (createjs.ProgressEvent)(loaded, total)
		catch err
			# console.log err.stack
		
		if Math.round(loaded) >= Math.round(total)
			@_complete()
		return

	p.destroy = ->
		# console.log 'destroy'
		@TagRequest_destroy()
		return

	p._handleTagComplete = ->
		# console.log 'complete'
		@TagRequest__handleTagComplete()
		return

	p._clean = ->
		try
			loaded = @_tag.buffered.end(@_tag.buffered.length - 1)
			total = @_tag.duration
		catch err
			# console.log err.stack

		if Math.round(loaded) >= Math.round(total)
			clearInterval @____timer
			@____timer = null

			if @_tag.removeEventListener
				@_tag.removeEventListener 'progress', @_handleProgress
				@_tag.removeEventListener 'stalled', @_handleStalled
				@_tag.removeEventListener 'error', @_handleError
				@_tag.removeEventListener 'ended', @_complete
				@_tag.removeEventListener 'complete', @_complete
				@_tag.removeEventListener 'canplaythrough', @_complete
			else
				@_tag.onended = null
				@_tag.oncanplaythrough = null
				@_tag.onprogress = null
				@_tag.onstalled = null
				@_tag.onerror = null

			@_tag?.currentTime = 0.0001

			@TagRequest__clean()
		return

	createjs.MediaRequest = createjs.promote(MediaRequest, 'TagRequest')
	return
