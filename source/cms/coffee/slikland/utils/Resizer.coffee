#import slikland.event.EventDispatcher

class Resizer extends EventDispatcher

	@RESIZE: 'resize_resizer'
	@ORIENTATION_CHANGE: 'orientation_change_resizer'
	@BREAKPOINT_CHANGE: 'breakpoint_changed_resizer'

	_bounds = null
	_body = null

	@getInstance:(p_start=true)=>
		@_instance ?= new @(p_start)

	constructor:(p_start=true)->
		_body = document.querySelector("body")
		_bounds = {"top":0, "bottom":0, "left":0, "right":0}
		if p_start? then @start()
		
	@get width:->
		return window.innerWidth

	@get height:->
		return window.innerHeight

	@get orientation:->
		return if window.innerWidth > window.innerHeight then 'landscape' else 'portrait'

	@get bounds:->
		return _bounds

	@set bounds:(p_value)->
		_bounds = p_value

	start:()=>
		window.addEventListener 'resize', @change
		window.addEventListener 'orientationchange', @change
		@change()

	stop:()=>
		window.removeEventListener 'resize', @change
		window.removeEventListener 'orientationchange', @change

	change:(evt)=>
		evt?.preventDefault()
		evt?.stopImmediatePropagation()
		
		_data = {
			"width": @width,
			"height": @height,
			"bounds": @bounds,
			"orientation": @orientation
		}

		if evt?.type == "resize" then @trigger Resizer.RESIZE, _data
		if evt?.type == "orientationchange" then @trigger Resizer.ORIENTATION_CHANGE, _data
		if app.conditions?
			for k, v of app.conditions.list
				if v['size']? || v['orientation']?
					if app.conditions.test(k)
						if !@hasClass(k) then @addClass(k)
					else
						if @hasClass(k) then @removeClass(k)
			
			for k, v of app.conditions.list
				if v['size']? || v['orientation']?
					if app.conditions.test(k)
						_data['breakpoint'] = {key:k, values:v}
						if @latestKey != k
							@latestKey = k
							@trigger Resizer.BREAKPOINT_CHANGE, _data
						break

				
	addClass:(className)->
		if typeof(className) is 'string'
			className = className.replace(/\s+/ig, ' ').split(' ')
		else if typeof(className) isnt 'Array'
			return
		classNames = _body.className.replace(/\s+/ig, ' ').split(' ')
		p = classNames.length
		i = className.length
		while i-- > 0
			if classNames.indexOf(className[i]) >= 0
				continue
			classNames[p++] = className[i]
		_body.className = classNames.join(' ')
		false

	removeClass:(className)->
		if typeof(className) is 'string'
			className = className.replace(/\s+/ig, ' ').split(' ')
		else if typeof(className) isnt 'Array'
			return

		classNames = _body.className.replace(/\s+/ig, ' ').split(' ')
		i = className.length
		while i-- > 0
			if (p = classNames.indexOf(className[i])) >= 0
				classNames.splice(p, 1)
		_body.className = classNames.join(' ')
		false

	hasClass:(className)->
		if typeof(className) is 'string'
			className = className.replace(/\s+/ig, ' ').split(' ')
		else if typeof(className) isnt 'Array'
			return

		classNames = _body.className.replace(/\s+/ig, ' ').split(' ')
		i = className.length

		hasClass = true

		while i-- > 0
			hasClass &= (classNames.indexOf(className[i]) >= 0)
		return hasClass
	
