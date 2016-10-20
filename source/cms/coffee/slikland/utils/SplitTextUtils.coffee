class SplitTextUtils
	@splitHTMLChars:(target, opt = {}, className = 'split-chunk')->
		return @_splitHTML(target, className, opt, @_replaceChars)

	@splitHTMLWords:(target, opt = {}, className = 'split-chunk')->
		return @_splitHTML(target, className, opt, @_replaceWords)

	@_splitHTML:(target, className, opt, type)->
		if target instanceof BaseDOM
			target = target.element

		html = target.innerHTML
		@_currentClassName = className
		replacedHTML = html.replace(/([^\<\>]*)?(\<[^\>]*\>)?/ig, type)

		target.innerHTML = replacedHTML
		return target.querySelectorAll('.' + className)
		# return new SplitText(target.querySelectorAll('.' + className), opt)

	@_replaceChars:(match, text, tag)=>
		ret = ''
		if text
			ret = text.replace(/(.)/g, '<span class="'+@_currentClassName+'">$1</span>')
		if tag
			ret += tag
		return ret

	@_replaceWords:(match, text, tag)=>
		ret = ''
		if text
			ret = text.replace(/([^\s]+)/g, '<span class="'+@_currentClassName+'">$1</span>')
		if tag
			ret += tag
		return ret
