#namespace cms.ui.attributes
#import slikland.utils.ColorUtils
class Background extends cms.ui.Base
	@SELECTOR: '[background]'
	constructor:()->
		super

	_update:(data)->
		items = data.add
		i = items.length
		while i-- > 0
			item = items[i]

			c = item.getAttribute('background')

			try
				l = ColorUtils.luminance(c)
				if !isNaN(l)
					if l > 0.75
						item.style.color = '#666666'
					else
						item.style.color = '#FFFFFF'

			# 0.299*R^2 + 0.587*G^2 + 0.114*B^2			
			item.style.background = c
