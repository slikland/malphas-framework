class DOMUtils
	@addCSSClass:(el, name)->
		if !el
			return
		clss = el.className.split(' ')
		if @hasCSSClass(el, name)
			return
		clss.push(name)
		el.className = clss.join(' ')
	@removeCSSClass:(el, name)->
		if !el
			return
		clss = el.className.split(' ')
		while (i = clss.indexOf(name)) >= 0
			clss.splice(i, 1)
		el.className = clss.join(' ')
	
	@toggleCSSClass:(el, name, toggle = null)->
		if !el
			return
		has = @hasCSSClass(el, name)
		if toggle is null
			toggle= !has
		if toggle
			@addCSSClass(el, name)
		else
			@removeCSSClass(el, name)
	
	@hasCSSClass:(el, name)->
		if !el
			return
		name = name.replace('.', '')
		clss = el.className.split(' ')
		if clss.indexOf(name) >= 0
			return true
		return false


	@findParentQuerySelector:(target, selector)->
		if !target.parentNode || target.parentNode == target
			return false
		items = target.parentNode.querySelectorAll(selector)
		i = items.length
		while i-- > 0
			if items[i] == target
				return target
		return @findParentQuerySelector(target.parentNode, selector)

	@removeAllChildren:(target)->
		while target.childNodes.length
			target.removeChild(target.firstChild)