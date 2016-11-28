#import slikland.loader.API
class Content
	constructor:()->
		@_target = document.querySelector('main')
		@_api = new API()
		@_api.on(API.COMPLETE, @_contentLoaded)
		@_api.reuse = true

		@_contentEditor = new LiveEditor(@_target)
		@_contentEditor.on('change', @_change)
		@_contentEditor.addShortcutCommand('[cmd][', 'outdent')
		@_contentEditor.addShortcutCommand('[cmd]]', 'indent')
		@_contentEditor.addShortcutCommand('[cmd][alt]1', 'formatBlock', 'h1')
		@_contentEditor.addShortcutCommand('[cmd][alt]2', 'formatBlock', 'h2')
		@_contentEditor.addShortcutCommand('[cmd][alt]3', 'formatBlock', 'h3')
		@_contentEditor.addShortcutCommand('[cmd][alt]4', 'formatBlock', 'h4')
		@_contentEditor.addShortcutCommand('[cmd][alt]5', 'formatBlock', 'h5')
		@_contentEditor.addShortcutCommand('[cmd][alt]6', 'formatBlock', 'h6')
		@_contentEditor.addShortcutCommand('[cmd][alt]-', 'insertHorizontalRule')
		@_contentEditor.addShortcutCommand('[cmd][alt]e', 'formatBlock', 'pre')
		@_contentEditor.addShortcutCommand('[cmd][alt]o', 'insertOrderedList')
		@_contentEditor.addShortcutCommand('[cmd][alt]l', 'insertUnorderedList')
		@_contentEditor.addShortcutCommand('[tab]', 'insertText', '\t')
		@_contentEditor.addShortcutCommand('[alt][click]', @_linkCallback)

		@_target.addEventListener('paste', @_onPaste)
	_linkCallback:(e, data)=>
		target = e.target
		if target.matches('a[href]')
			html = target.outerHTML
			if target.hasAttribute('id')
				target = target.cloneNode(true)
				target.removeAttribute('href')
				html = target.outerHTML
			@_contentEditor.execCommand('insertHTML', false, html)

	_onPaste:(e)=>
		for item in e.clipboardData.items
			console.log(item)

	_contentLoaded:(e, data)=>
		@_target.scrollTop = 0
		@_target.innerHTML = data
		@_parseLinks()

	_change:()=>
		data = {}
		content = @_target.innerHTML
		content = content.replace(/\[\[(http.*?)\]\]/ig, '<a href="$1" target="_blank">$1</a>')
		data['content'] = @_target.innerHTML = content
		data['page'] = @_currentPage
		@_parseLinks()
		API.call('php/editPage.php', data, null, null, 'json')

	_parseLinks:()=>
		anchors = @_target.querySelectorAll('a[id]')
		for a in anchors
			nav = document.querySelector('nav a[id="'+a.getAttribute('id')+'"]')
			if nav
				a.removeEventListener('click', @_linkClick)
				a.addEventListener('click', @_linkClick)
				a.setAttribute('href', nav.getAttribute('href'))

	_linkClick:(e)=>
		target = e.currentTarget
		if !e.metaKey
			e.preventDefault()
			e.stopImmediatePropagation()
		if !e.altKey
			app.router.goto(target.getAttribute('href'))


	show:(path)->
		@_api.abort()
		@_currentPage = path
		@_api.load('data/pages/' + path + '.html')
