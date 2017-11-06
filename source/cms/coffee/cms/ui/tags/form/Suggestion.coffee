#namespace cms.ui.tags.form
class Suggestion extends cms.ui.Base
	@SELECTOR: 'suggestion'
	_update:(data)->
		if !@_pluginInstances
			@_pluginInstances = []
		for item in data.add
			item.setAttribute('p_id', @constructor._ID++)
			@_pluginInstances.push(new Plugin(item))
		for item in data.remove
			p_id = item.getAttribute('p_id')
			i = @_pluginInstances.length
			while i-- > 0
				inst = @_pluginInstances[i]
				if inst.attr('p_id') == p_id
					inst.destroy()
					@_pluginInstances.splice(i, 1)

	class Plugin extends BaseDOM
		@_destroyPlugin:(item)->

		constructor:(element)->
			super({element: element})
			@_target = @findClosest(@attr('target'))
			@_service = @attr('service')

			if !@_target
				return
			if !@_service
				return

			@_api = new API(@_service)
			@_api.on(API.COMPLETE, @_apiLoaded)
			@_api.reuse = true

			@_templateBlock = @find('item')
			@removeChild(@_templateBlock)
			@_currentIndex = -1
			@_build()

		destroy:()->
			@_target.off('change', @_change)
			@_target.off('input', @_change)
			@_target.off('keydown', @_keyDown)
			@_target.off('focus', @_focus)
			@_target.off('blur', @_blur)

			window.removeEventListener('resize', @_resize)
			super
		_build:()=>
			@_target.on('change', @_change)
			@_target.on('input', @_change)
			@_target.on('keydown', @_keyDown)
			@_target.on('focus', @_focus)
			@_target.on('blur', @_blur)

			window.addEventListener('resize', @_resize)
			window.addEventListener('scroll', @_resize)
			document.body.addEventListener('scroll', @_resize)
			@_resize()

		_focus:()=>
			@_change()
		_blur:(e)=>
			@clear()

		_keyDown:(e)=>
			switch e.keyCode
				when 38
					e.preventDefault()
					@selectPrev()
				when 40
					e.preventDefault()
					@selectNext()
				when 13
					if @commit()
						e.preventDefault()
						e.stopImmediatePropagation()

		commit:(selectedItem = null)->
			if !@_hasSuggestions
				return
			items = ArrayUtils.toArray(@findAll('item'))
			if items[@_currentIndex]
				selectedItem = items[@_currentIndex]
				@_target.value = selectedItem.getAttribute('value')
			@clear()

			return true

		_click:(e)=>
			items = ArrayUtils.toArray(@findAll('item'))
			i = items.length
			while i-- > 0
				if items[i] == e.currentTarget
					@select(i)
					break
			@commit()

		clear:()->
			@removeAll()
			@_lastValue = ''
			@_clearRequestQueue()
			@_hasSuggestions = false

		select:(index)->
			items = ArrayUtils.toArray(@findAll('item'))
			l = items.length
			@_hasSuggestions = (l > 0)
			if !@_hasSuggestions
				return
			@css({display: 'block'})

			index = (((index % l) + l) % l)

			for i, item of items
				i = Number(i)
				cl = item.className?.toLowerCase().split(' ')
				if !cl
					cl = []
				if i == index
					if cl.indexOf('selected') < 0
						cl.push('selected')
				else
					while (p = cl.indexOf('selected')) >= 0
						cl.splice(p, 1)
				item.className = cl.join(' ')

			@_currentIndex = index
		selectNext:()->
			@select(@_currentIndex + 1)
		selectPrev:()->
			@select(@_currentIndex - 1)

		_change:()=>
			if @_target.value == @_lastValue
				return
			@_lastValue  = @_target.value
			@_queueRequest()

		_queueRequest:()->
			@_api.abort()
			@_clearRequestQueue()
			@_requestTimeout = setTimeout(@_request, 300)
		_clearRequestQueue:()->
			clearInterval(@_requestTimeout)

		_request:()=>
			@_api.submit({value: @_target.value})

		_resize:()=>
			bounds = @_target.getBoundingClientRect()
			pBounds = @_target.parentNode?.getBoundingClientRect()
			ww = window.innerWidth
			wh = window.innerHeight
			@css({
				top: (bounds.bottom - pBounds.top) + 'px'
				left: (bounds.left - pBounds.left) + 'px'
				width: (bounds.right - bounds.left) + 'px'
			})

		_apiLoaded:(e, data)=>
			@clear()
			app.template.renderBlock(@element, data, @element)
			items = ArrayUtils.toArray(@findAll('item'))
			i = items.length
			while i-- > 0
				items[i].on('mousedown', @_click)

			@select(0)

			# @_target.setSelectionRange(3, 10, 'backward')
