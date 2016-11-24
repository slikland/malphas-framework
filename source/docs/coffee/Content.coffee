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

		@_target.addEventListener('paste', @_onPaste)
	_onPaste:(e)=>
		for item in e.clipboardData.items
			console.log(item)

	_contentLoaded:(e, data)=>
		@_target.innerHTML = data

	_change:()=>
		data = {}
		data['content'] = @_target.innerHTML
		data['page'] = @_currentPage
		API.call('php/editPage.php', data, null, null, 'json')

	show:(path)->
		@_api.abort()
		@_currentPage = path
		@_api.load('data/pages/' + path + '.html')