#namespace cms.ui.attributes
class Focus extends cms.ui.Base
	@SELECTOR: '[focus]'
	constructor:()->
		super

	_update:(data)->
		items = data.add
		i = items.length
		while i-- > 0
			item = items[i]
			item.focus()
