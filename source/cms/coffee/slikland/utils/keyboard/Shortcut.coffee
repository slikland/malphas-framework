#namespace slikland.utils.keyboard
class Shortcut

	@MODIFIERS: ['alt', 'ctrl', 'meta', 'shift', 'click']
	@MAP: ['tab', 'enter', 'esc']
	@KEY_MAP: {
		9: 'tab'
		13: 'enter'
		27: 'esc'
	}
	@CODE_MAP: {
		189: '-'
		219: '['
		221: ']'
	}
	@MODIFIER_CODES: [16, 18, 17, 91]

	constructor:(target = null)->
		if !target
			target = window
		@_target = target

		@_shortcuts = []

		@_target.addEventListener('keydown', @_keyDown)
		@_target.addEventListener('keyup', @_keyUp)
		window.addEventListener('mousedown', @_mouseDown)
	destroy:()->
		@_target?.removeEventListener('keydown', @_keyDown)
		@_target?.removeEventListener('keyup', @_keyUp)
		window.removeEventListener('mousedown', @_mouseDown)
		@_shortcuts.length = 0
		delete @_shortcuts
		delete @_target

	_mouseDown:(e)=>
		key = ''
		mapped = []
		modifiers = ['click']
		for k in @constructor.MODIFIERS
			if e[k + 'Key']
				modifiers.push(k)
		modifiers.sort()
		mapped.sort()
		shortcut = '[' + modifiers.join('][') + ']' + '[' + mapped.join('][') + ']' + key
		items = @_findShortcut(shortcut)
		for item in items
			item.callback?(e, item)
			if item.preventDefault
				e.preventDefault()
	_keyDown:(e)=>
		keyCode = e.keyCode
		key = ''
		mapped = []
		if @constructor.KEY_MAP[keyCode]
			mapped.push(@constructor.KEY_MAP[keyCode])
		else if !(keyCode in @constructor.MODIFIER_CODES)
			if @constructor.CODE_MAP[keyCode]
				key = @constructor.CODE_MAP[keyCode].toLowerCase()
			else
				key = String.fromCharCode(keyCode).toLowerCase()
		modifiers = []
		for k in @constructor.MODIFIERS
			if e[k + 'Key']
				modifiers.push(k)
		modifiers.sort()
		mapped.sort()
		shortcut = '[' + modifiers.join('][') + ']' + '[' + mapped.join('][') + ']' + key
		items = @_findShortcut(shortcut)
		for item in items
			item.callback?(e, item)
			if item.preventDefault
				e.preventDefault()

	_normalizeShortcut:(shortcut)->
		shortcut = shortcut.toLowerCase()
		modRE = /\[(.*?)\]/g
		modifiers = []
		mapped = []
		while (o = modRE.exec(shortcut))
			mod = o[1]
			if mod == 'cmd'
				mod = 'meta'
			if mod in @constructor.MODIFIERS
				modifiers.push(mod)
			if mod in @constructor.MAP
				mapped.push(mod)
		shortcut = shortcut.replace(/\[.*?\]/g, '').split('')
		shortcut.sort()
		modifiers.sort()
		mapped.sort()
		return '[' + modifiers.join('][') + ']' + '[' + mapped.join('][') + ']' + shortcut.join('')

	_findShortcut:(shortcut)->
		found = []
		i = @_shortcuts.length
		while i-- > 0
			if @_shortcuts[i].normalized == shortcut
				found.push(@_shortcuts[i])
		return found

	addShortcut:(shortcut, callback, preventDefault = true)->
		normalized = @_normalizeShortcut(shortcut)
		i = @_shortcuts.length
		while i-- > 0
			if @_shortcuts[i].normalized == normalized && @_shortcuts[i].callback == callback
				return
		@_shortcuts.push({normalized: normalized, shortcut: shortcut, callback: callback, preventDefault: preventDefault})

	removeShortcut:(shortcut, callback)->
		normalized = @_normalizeShortcut(shortcut)
		i = @_shortcuts.length
		while i-- > 0
			if @_shortcuts[i].normalized == normalized
				if !callback || (callback && @_shortcuts[i].callback == callback)
					@_shortcuts.splice(i, 1)