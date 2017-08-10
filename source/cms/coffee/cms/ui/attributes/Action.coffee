#namespace cms.ui.tag.attributes
class Action extends cms.ui.Base
	@SELECTOR: ':not(form)[action]'
	_update:(data)->
		for item in data.add
			if item.hasAttribute('action') && !item.getAttribute('target')
				action = item.getAttribute('action')
				if /\/api\/.*?$/.test(action)
					@_plugins[item] = new Plugin(item)

		for item in data.remove
			p = @_plugins[item]
			if p
				p.destroy?()

	class Plugin extends BaseDOM
		@_destroyPlugin:(item)->

		constructor:(element)->
			super({element: element})
			setTimeout(@_addEventListener, 1)
		_addEventListener:()=>
			@_element.on('click', @_click)
			@_element.on('abort', @_abort)
		_click:(e)=>
			@_api = API.call(@_element.getAttribute('action'), null, @_apiComplete, @_apiError)
			if @_element.getAttribute('globalLoading')
				@_api.on(API.PROGRESS, @_progress)
				@_loading = new cms.ui.Loading()
				@_loading.css({'position': 'fixed'})
				@_loading.show()
				window.addEventListener('resize', @_loadingResize)

				app.interface.context.appendChildAt(@_loading, 0)
				setTimeout(@_loadingResize, 0)
			if @attr('prevent') && @attr('prevent') == 'false'
				return
			e.preventDefault()
			e.stopImmediatePropagation()

		_abort:()=>
			@_api?.abort()
			@_hideLoading()

		_hideLoading:()=>
			if @_loading
				@_loading?.progress = 1
				@_loading.on(cms.ui.Loading.HIDE_COMPLETE, @_loadingHideComplete)
				@_loading.hide()

		_loadingHideComplete:()=>
			if @_loading.element.parentNode
				@_loading.element.parentNode.removeChild(@_loading.element)
			@_loading.remove()
			@_loading.off(cms.ui.Loading.HIDE_COMPLETE, @_loadingHideComplete)
			@_loading.destroy?()
			@_loading = null
			window.removeEventListener('resize', @_loadingResize)
			delete @_loading
		_progress:(e)=>
			p = e.loaded / e.total
			@_loading?.progress = p
		_loadingResize:()=>
			if !@_loading
				return
			bounds = app.interface.context.getBounds()
			@_loading.css({
				'top': bounds.top + 'px'
				'left': bounds.left + 'px'
				'height': bounds.height + 'px'
				'width': bounds.width + 'px'
			})
		_apiComplete:(e, data)=>
			success = @attr('success')
			if success && success.length > 0
				switch success
					when 'update'
						@_element.trigger('update')
					when 'refresh'
						app.interface.show()
					when 'reload'
						window.location.reload()
					else
						if o = /^update\:(.*?)$/.exec(success)
							items = document.body.querySelectorAll(o[1])
							i = items.length
							while i-- > 0
								items[i].trigger('update')
						else
							app.interface.show(success)
			if data?.notification?.message?.length > 0
				if !data.notification.type
					data.notification.type = 3
				app.notification.showNotification(data.notification)
			@_hideLoading()
		_apiError:(e, data)=>
			error = @attr('error')
			if error && error.length > 0
				switch error
					when 'refresh'
						app.interface.show()
					when 'reload'
						window.location.reload()
					else
						app.interface.show(error)
			else if data?.message?.length > 0
				
				if data?.message?.length > 0
					if !data.type
						data.type = 1
					app.notification.showNotification(data)

			@_hideLoading()
