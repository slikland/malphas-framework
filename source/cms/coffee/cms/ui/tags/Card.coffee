#namespace cms.ui.tags
#import slikland.utils.MouseUtils
class Card extends cms.ui.Base
	@SELECTOR: 'card'
	constructor:()->
		super
		window.addEventListener('resize', @_resize)
		app.on('redraw', @_update)
	_update:(data)=>
		setTimeout(@_resize, 0)
		setTimeout(@_resize, 500)
	_resize:()=>
		cards = document.querySelectorAll('card.even-height')
		parents = []
		childs = []
		i = cards.length
		while i-- > 0
			card = cards[i]
			card.style.height = ''
			header = card.querySelector('header')
			footer = card.querySelector('footer')
			content = card.querySelector('content')
			header?.style.height = ''
			content?.style.height = ''
			footer?.style.height = ''
			parent = card.parentNode
			if parents.indexOf(parent) < 0
				parents.push(parent)
			p = parents.indexOf(parent)
			if !childs[p]
				childs[p] = {height: 0, children: []}
			b = card.getBoundingClientRect()
			h =  b.bottom - b.top
			if childs[p].height < h
				childs[p].height = h
			childs[p].children.push(card)

		i = parents.length
		while i-- > 0
			item = childs[i]
			j = item.children.length
			h = item.height
			while j-- > 0
				child = item.children[j]
				child.style.height = h + 'px'
				header = child.querySelector('header')
				footer = child.querySelector('footer')
				content = child.querySelector('content')
				hh = 0
				fh = 0
				if header
					hh = header.getBoundingClientRect()
					hh = hh.bottom - hh.top

				if footer
					fh = footer.getBoundingClientRect()
					fh = fh.bottom - fh.top

				if content
					content.style.height = h - hh - fh + 'px'