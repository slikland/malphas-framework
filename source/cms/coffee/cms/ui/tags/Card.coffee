#namespace cms.ui.tags
#import slikland.utils.MouseUtils
class Tooltip extends cms.ui.Base
	@SELECTOR: 'tooltip'
	constructor:()->
		super
		window.addEventListener('resize', @_resize)
	_update:(data)->
		@_resize()
	_resize:()=>
		cards = document.querySelectorAll('card.even-height')
		parents = []
		childs = []
		i = cards.length
		while i-- > 0
			card = cards[i]
			card.style.height = ''
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
				item.children[j].style.height = h + 'px'


