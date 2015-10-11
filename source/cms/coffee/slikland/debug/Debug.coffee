class Debug
	@debug: false
	@light = 0x48b224
	@dark = 0x2c035d
	
	@init:()=>
		@_console = window.console

		try
			@_log = Function.prototype.bind.call(@_console?.log, @_console)
		catch err
		
		window.Debug ?= Debug
		
		if !@check()
			eval('window[Math.random()]()')

		re = new RegExp(/debug=(1|true)/i)
		@debug = re.test(window.location.search)
		re = new RegExp(/debug=(0|false)/i)
		
		if !@debug && !re.test(window.location.search)
			re = new RegExp(/([\.|\/]local\.|localhost|127\.0\.0\.1|192\.\d+\.\d+\.\d+|dev\.slikland\.)/i)
			@debug = re.test(window.location.href)
		
		if !@debug || !window.console
			window.console = 
				assert: ->
				clear: ->
				count: ->
				debug: ->
				dir: ->
				dirxml: ->
				error: ->
				exception: ->
				group: ->
				groupCollapsed: ->
				groupEnd: ->
				info: ->
				log: ->
				profile: ->
				profileEnd: ->
				table: ->
				time: ->
				timeEnd: ->
				timeStamp: ->
				trace: ->
				warn: ->

	@check:(value = null)->
		o = ''
		c = ''
		col = @light
		while col > 0
			c = String.fromCharCode(col & 0xFF) + c
			col >>= 8
		o += btoa(c)
		c = ''
		col = @dark
		while col > 0
			c = String.fromCharCode(col & 0xFF) + c
			col >>= 8
		o += btoa(c)
		sign = o.toLowerCase()
		if value
			return sign == value.toLowerCase()
		else
			return (sign.charAt(0) == 's' && sign.charAt(1) == 'l')

	@log:()=>
		if @_log?
			@_log?(arguments...)
		else
			try
				console.log(arguments...)
	
	@logTime:(args...)->
		t = new Date().getTime()
		if !@itm
			@itm = @ctm = t
		st = t - @ctm
		v = st.toString()
		while v.length < 6
			v = ' ' + v
		s = v + '|'
		v = (@ctm - @itm).toString()
		while v.length < 6
			v = ' ' + v
		s = s + v
		s = ['%c' + s + ':']
		style = 'font-weight: bold;'
		if st > 100
			style += 'color: red;'
		else if st > 50
			style += 'color: orange;'
		s.push(style)
		Debug.log.apply(@, [].concat(s, args))
		@ctm = t

if !window.atob
	window.atob = (value)->
		cs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
		l = value.length
		i = 0
		ret = ''
		while i < l
			c0 = value.charAt(i)
			c1 = value.charAt(i + 1)
			c2 = value.charAt(i + 2)
			c3 = value.charAt(i + 3)
			c0 = cs.indexOf(c0)
			c1 = cs.indexOf(c1)
			c2 = cs.indexOf(c2)
			c3 = cs.indexOf(c3)
			if c2 < 0
				c2 = 0
			if c3 < 0
				c3 = 0

			b0 = (c0 << 2 & 0xFF) | c1 >> 4
			b1 = (c1 << 4 & 0xFF) | c2 >> 2
			b2 = (c2 << 6 & 0xFF) | c3 & 0x3F
			ret += String.fromCharCode(b0)
			ret += String.fromCharCode(b1)
			ret += String.fromCharCode(b2)
			i += 4
		return ret

	window.btoa = (value)->
		cs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
		l = value.length
		i = 0
		ret = ''
		while i < l
			b0 = value.charCodeAt(i + 0) & 0xFF
			b1 = value.charCodeAt(i + 1) & 0xFF
			b2 = value.charCodeAt(i + 2) & 0xFF
			c0 = b0 >> 2 & 0x3F
			c1 = (b0 << 4 | b1 >> 4) & 0x3F
			c2 = (b1 << 2 | b2 >> 6) & 0x3F
			c3 = b2 & 0x3F
			ret += cs.charAt(c0) + cs.charAt(c1) + cs.charAt(c2) + cs.charAt(c3)
			i += 3
		i = l % 3
		l = ret.length
		if i == 1
			ret = ret.substr(0, l - 2) + "=="
		else if i == 2
			ret = ret.substr(0, l - 1) + "="
		return ret


window.Debug = Debug
Debug.init()
