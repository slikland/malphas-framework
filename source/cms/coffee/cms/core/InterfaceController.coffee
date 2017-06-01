#import slikland.display.BaseDOM
#namespace cms.core
class InterfaceController
	@getInstance:()=>
		@_instance ?= new @(arguments...)

	constructor:()->
		app.user.on(User.STATUS_CHANGE, @_loginStatusChange)
		API.intercept(/.*/g, @_apiRedirectInterceptor)

	@get context:()->
		return @_context

	_apiRedirectInterceptor:(data, url)=>
		if data?.goto
			app.router.goto(data.goto)
		else if data?.redirect
			app.router.goto(data.redirect)
		else if data?.refresh
			1

	show:(page = null)->
		if !app.user.logged
			return
		if !@_interfaceShown
			@_showInterface()
			return
		if !page
			page = app.router.getCurrentPath()

		page = page.trim('/')
		if page.length == 0
			page = 'index'
		@_showPage(page)
	_showPage:(page)->
		if !@_loading
			@_loading = new cms.ui.Loading()
		@_context.appendChildAt(@_loading, 0)
		@_loading.show()
		@_loading.progress = 0.5

		validPage = @_findValidPage(page)
		if !validPage
			return
		pathObj = {}
		parsedPath = app.router.getParsedPath()
		page = page.replace(/(\?|\#).*?$/, '')
		pageParts = page.substr(page.indexOf(validPage) + validPage.length).trim('/').split('/')
		for k, v of pageParts
			pathObj[k] = v
		for k, v of parsedPath.params
			pathObj[k] = v
		slikland.Mara.setGlobalObject('$', pathObj)
		slikland.Mara.setGlobalObject('#', parsedPath.hashes)
		app.template.render('pages/' + validPage, {}, @_context.element, @_pageShown)
	_pageShown:()=>
		@_loading.progress = 1
		@_loading.hide()


	_findValidPage:(page = '')->
		page = page.trim('/')
		i = @_availPages.length
		while i-- > 0
			p = @_availPages[i].path
			if page.indexOf(p) == 0
				return p
		return null

	_showInterface:()->
		if !app.user.logged
			return
		@_interfaceShown = true

		API.call(app.rootPath + 'api/cms/cms/getInterface', null, @_interfaceLoaded)
	_interfaceLoaded:(e, data)=>
		@_availPages = data.pages
		@_availPages.sort(@_sortPages)
		iData = {
			user: app.user.data
			interface: data
		}
		app.template.render('interface/interface', iData, document.body, @_interfaceRendered)

	_sortPages:(a, b)->
		a = a.path.trim('/')
		b = b.path.trim('/')
		aal = a.split('/').length
		bal = b.split('/').length
		if aal < bal
			return -1
		else if aal > bal
			return 1
		asl	= a.length
		bsl = b.length
		if asl < bsl
			return -1
		else if asl > bsl
			return 1
		return 0
	_interfaceRendered:(items, block)=>
		context = items[0][1]
		@_header = context.querySelector('header')
		@_menu = context.querySelector('nav')
		@_context = new BaseDOM({element: context.querySelector('main')})
		@show()


	_loginStatusChange:()=>
		@_interfaceShown = false

