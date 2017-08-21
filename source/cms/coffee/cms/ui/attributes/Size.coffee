#namespace cms.ui.attributes
class Size extends cms.ui.Base
	@SELECTOR: '[height],[width]'
	constructor:()->
		super

	_update:(data)->
		items = data.add
		i = items.length
		while i-- > 0
			item = items[i]
			if item.hasAttribute('width')
				s = item.getAttribute('width')
				if /^\s*[\d\.]+\s*$/.test(s)
					s += 'px'
				item.style.width = s
			if item.hasAttribute('height')
				s = item.getAttribute('height')
				if /^\s*[\d\.]+\s*$/.test(s)
					s += 'px'
				item.style.height = s
