#namespace components.quill
class MediaGallery
	@NAME: 'media-gallery'
	@ORDER: 0
	constructor:(editor, options)->

		@_editor = editor
		@_options = options
		@class = '123'
		@_editor.addFormat('media-gallery', {format: 'embed', tag: 'div', attributes: 'className'})
		# @_editor.addContainer('ql-' + @constructor.NAME)

		# @_container = document.querySelector(options.container)
		console.log(options.container)
		console.log(@)





		# editor.on('change', change1);
		# editor.on('ql-link', change1);
		# editor.addFormat('image-gallery', {tag: '.ql-image-gallery', prepare: 'image-gallery'});
		# console.log(editor.modules.toolbar)
		# console.log(arguments)
		#     editor.onModuleLoad('toolbar', (function() {
		#       return function(toolbar) {
		#       	toolbar.constructor.formats.TOGGLE['image-gallery'] = 'image-gallery';
		#         return toolbar.initFormat('image-gallery', test2);
		#       };
		#     })(this));

		console.log(arguments)
		@_addEventListeners()
	_addEventListeners:()->
		@_editor.onModuleLoad('toolbar', @_toolbarLoaded)

	_toolbarLoaded:(toolbar)=>
		@_toolbar = toolbar
		toolbar.initFormat('media-gallery', @_onToolbar)
	_add:(node)=>
		console.log("ADD")
		console.log(node)
		return node
	_remove:()->


	_onToolbar:(range, value)=>
		console.log("TOOLBAR")
		index = range?.start || 0
		console.log(range.insert)
		@_editor.insertText(index, '', {'media-gallery': true})
		@_toggle(range, value)
	_toggle:(range, value)->
		if !range
			return
		if !value
			@_remove()
			return
		console.log(range, value)



# LinkTooltip = ((superClass) ->

#   LinkTooltip = (quill, options) ->
#     @quill = quill
#     @options = options
#     @options = _.defaults(@options, Tooltip.DEFAULTS)
#     LinkTooltip.__super__.constructor.call this, @quill, @options
#     dom(@container).addClass 'ql-link-tooltip'
#     @textbox = @container.querySelector('.input')
#     @link = @container.querySelector('.url')
#     @initListeners()
#     return

#   extend LinkTooltip, superClass
#   LinkTooltip.DEFAULTS =
#     maxLength: 50
#     template: '<span class="title">Visit URL:&nbsp;</span> <a href="#" class="url" target="_blank" href="about:blank"></a> <input class="input" type="text"> <span>&nbsp;&#45;&nbsp;</span> <a href="javascript:;" class="change">Change</a> <a href="javascript:;" class="remove">Remove</a> <a href="javascript:;" class="done">Done</a>'
#   LinkTooltip.hotkeys = LINK:
#     key: 'K'
#     metaKey: true

#   LinkTooltip::initListeners = ->
#     @quill.on @quill.constructor.events.SELECTION_CHANGE, ((_this) ->
#       (range) ->
#         anchor = undefined
#         if !(range != null and range.isCollapsed())
#           return
#         anchor = _this._findAnchor(range)
#         if anchor
#           _this.setMode anchor.href, false
#           return _this.show(anchor)
#         else if _this.container.style.left != Tooltip.HIDE_MARGIN
#           _this.range = null
#           return _this.hide()
#         return
#     )(this)
#     dom(@container.querySelector('.done')).on 'click', _.bind(@saveLink, this)
#     dom(@container.querySelector('.remove')).on 'click', ((_this) ->
#       ->
#         _this.removeLink _this.range
#     )(this)
#     dom(@container.querySelector('.change')).on 'click', ((_this) ->
#       ->
#         _this.setMode _this.link.href, true
#     )(this)
#     @initTextbox @textbox, @saveLink, @hide
#     @quill.onModuleLoad 'toolbar', ((_this) ->
#       (toolbar) ->
#         _this.toolbar = toolbar
#         toolbar.initFormat 'link', _.bind(_this._onToolbar, _this)
#     )(this)
#     @quill.onModuleLoad 'keyboard', ((_this) ->
#       (keyboard) ->
#         keyboard.addHotkey LinkTooltip.hotkeys.LINK, _.bind(_this._onKeyboard, _this)
#     )(this)

#   LinkTooltip::saveLink = ->
#     anchor = undefined
#     end = undefined
#     url = undefined
#     url = @_normalizeURL(@textbox.value)
#     if @range != null
#       end = @range.end
#       if @range.isCollapsed()
#         anchor = @_findAnchor(@range)
#         if anchor != null
#           anchor.href = url
#       else
#         @quill.formatText @range, 'link', url, 'user'
#       @quill.setSelection end, end
#     @setMode url, false

#   LinkTooltip::removeLink = (range) ->
#     if range.isCollapsed()
#       range = @_expandRange(range)
#     @hide()
#     @quill.formatText range, 'link', false, 'user'
#     if @toolbar != null
#       return @toolbar.setActive('link', false)
#     return

#   LinkTooltip::setMode = (url, edit) ->
#     text = undefined
#     if edit == null
#       edit = false
#     if edit
#       @textbox.value = url
#       _.defer ((_this) ->
#         ->
#           _this.textbox.focus()
#           _this.textbox.setSelectionRange 0, url.length
#       )(this)
#     else
#       @link.href = url
#       url = @link.href
#       text = if url.length > @options.maxLength then url.slice(0, @options.maxLength) + '...' else url
#       dom(@link).text text
#     dom(@container).toggleClass 'editing', edit

#   LinkTooltip::_findAnchor = (range) ->
#     leaf = undefined
#     node = undefined
#     offset = undefined
#     ref = undefined
#     ref = @quill.editor.doc.findLeafAt(range.start, true)
#     leaf = ref[0]
#     offset = ref[1]
#     if leaf != null
#       node = leaf.node
#     while node != null and node != @quill.root
#       if node.tagName == 'A'
#         return node
#       node = node.parentNode
#     null

#   LinkTooltip::_expandRange = (range) ->
#     end = undefined
#     leaf = undefined
#     offset = undefined
#     ref = undefined
#     start = undefined
#     ref = @quill.editor.doc.findLeafAt(range.start, true)
#     leaf = ref[0]
#     offset = ref[1]
#     start = range.start - offset
#     end = start + leaf.length
#     {
#       start: start
#       end: end
#     }

#   LinkTooltip::_onToolbar = (range, value) ->
#     @_toggle range, value

#   LinkTooltip::_onKeyboard = ->
#     range = undefined
#     range = @quill.getSelection()
#     @_toggle range, !@_findAnchor(range)

#   LinkTooltip::_toggle = (range, value) ->
#     nativeRange = undefined
#     if !range
#       return
#     if !value
#       return @removeLink(range)
#     else if !range.isCollapsed()
#       @setMode @_suggestURL(range), true
#       nativeRange = @quill.editor.selection._getNativeRange()
#       return @show(nativeRange)
#     return

#   LinkTooltip::_normalizeURL = (url) ->
#     if !/^(https?:\/\/|mailto:)/.test(url)
#       url = 'http://' + url
#     url

#   LinkTooltip::_suggestURL = (range) ->
#     text = undefined
#     text = @quill.getText(range)
#     @_normalizeURL text

#   LinkTooltip
# )(Tooltip)

# # ---
# # generated by js2coffee 2.2.0