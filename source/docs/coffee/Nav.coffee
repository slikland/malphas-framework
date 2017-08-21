#import slikland.loader.API
#import slikland.utils.ArrayUtils
class Nav extends EventDispatcher
	constructor:()->
		@_target = document.querySelector('nav')
		API.call('data/nav.html', null, @_navLoaded)

	_navLoaded:(e, data)=>
		@_target.innerHTML = data
		@_parseLinks()

		@_content = document.querySelector('content')
		if !@_content
			@_content = document.createElement('content')
			@_target.appendChild(@_content)
		@_navEditor = new LiveEditor(@_content)
		@_navEditor.on('change', @_change)
		@_navEditor.addShortcutCommand('[cmd][', 'outdent')
		@_navEditor.addShortcutCommand('[cmd]]', 'indent')

		@trigger('ready')
	_change:()=>
		@_links = []
		@_parseNodes(@_content)
		pages = []
		id = (Date.now() - 1480096400000)
		for k, item of @_links
			obj = {}
			if item.getAttribute('href')
				obj['prev'] = item.getAttribute('href')
			if !item.hasAttribute('id')
				item.setAttribute('id', id.toString(16))
				id++
			obj['name'] = (Number(k) + 1).toString().padLeft(4, '0') + '.' + item.innerText.replace(/[^a-z0-9]/ig, '-')
			item.href = obj['name']
			pages.push(obj)
		data = {}
		data['pages'] = pages
		data['raw'] = @_target.innerHTML
		@_parseLinks()
		
		API.call('php/editNav.php', data, null, null, 'json')

	_parseNodes:(target)=>
		for child in target.childNodes
			if child.tagName?.toLowerCase() == 'a'
				if child.innerText.trim().length == 0
					target.removeChild(child)
				else
					@_links.push(child)
			else if child.nodeType == 3
				if child.data.trim().length == 0
					target.removeChild(child)
				else
					a = document.createElement('a')
					a.innerText = child.data
					@_links.push(a)
					target.replaceChild(a, child)
			else
				@_parseNodes(child)
	_parseLinks:()->
		@_links = ArrayUtils.toArray(@_target.querySelectorAll('a'))
		i = @_links.length
		while i-- > 0
			item = @_links[i]
			item.addEventListener('click', @_linkClick)
	_linkClick:(e)=>
		target = e.currentTarget
		if !e.metaKey
			e.preventDefault()
			e.stopImmediatePropagation()
		if !e.altKey
			app.router.goto(target.getAttribute('href'))

	isValid:(path)->
		i = @_links.length
		while i-- > 0
			item = @_links[i]
			href = item.getAttribute('href')
			if href == path
				return true
		return false
	select:(path)->
		i = @_links.length
		while i-- > 0
			item = @_links[i]
			href = item.getAttribute('href')
			cn = ''
			if href == path
				cn = 'selected'
			item.className = cn
