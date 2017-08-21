#import slikland.utils.keyboard.Shortcut
#import slikland.event.EventDispatcher
class LiveEditor extends EventDispatcher
	constructor:(target)->
		@_target = target
		@_target.addEventListener('dblclick', @_startEdit)
		@_shortcut = new slikland.utils.keyboard.Shortcut(@_target)
		@_shortcutCommands = {}

	_startEdit:()=>
		if @_editting
			return
		@_editting = true
		@_initialContent = @_target.innerHTML
		@_addEventListeners()
		@_target.contentEditable = true
		@_target.focus()
	_stopEdit:()=>
		if !@_editting
			return
		@_editting = false
		@_removeEventListeners()
		@_target.contentEditable = false

	_commitChanges:()=>
		@_stopEdit()
		@_target.normalize?()
		@_initialContent = null
		@trigger('change')
	_discardChanges:()=>
		@_stopEdit()
		@_target.innerHTML = @_initialContent


	_addEventListeners:()=>
		@_target.addEventListener('blur', @_commitChanges)
		@_shortcut.addShortcut('[cmd][enter]', @_commitChanges)
		@_shortcut.addShortcut('[esc]', @_discardChanges)

	_removeEventListeners:()=>
		@_target.removeEventListener('blur', @_commitChanges)
		@_shortcut.removeShortcut('[cmd][enter]', @_commitChanges)
		@_shortcut.removeShortcut('[esc]', @_discardChanges)

	_shortcutCommand:(e, data)=>
		if !@_editting
			return
		if @_shortcutCommands[data.shortcut]
			if @_shortcutCommands[data.shortcut].command instanceof Function
				@_shortcutCommands[data.shortcut].command(e, data)
			else
				document.execCommand(@_shortcutCommands[data.shortcut].command, true, @_shortcutCommands[data.shortcut].value)

	execCommand:(name, useUI, value)->
		document.execCommand(name, useUI, value)

	addShortcutCommand:(shortcut, command, value = null)->
		@_shortcutCommands[shortcut] = {command: command, value: value}
		@_shortcut.addShortcut(shortcut, @_shortcutCommand)

