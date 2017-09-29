#namespace cms.ui.attributes
class Size extends cms.ui.Base
	@SELECTOR: '[height],[width],[min-width],[min-height]'
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
			if item.hasAttribute('min-width')
				s = item.getAttribute('min-width')
				if /^\s*[\d\.]+\s*$/.test(s)
					s += 'px'
				item.style['min-width'] = s
			if item.hasAttribute('min-height')
				s = item.getAttribute('min-height')
				if /^\s*[\d\.]+\s*$/.test(s)
					s += 'px'
				item.style['min-height'] = s
