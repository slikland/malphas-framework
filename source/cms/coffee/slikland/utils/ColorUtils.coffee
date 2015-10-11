class ColorUtils
	@lightenColor:(p_color, p_amount)->
		usePound = false
		if p_color[0] == "#"
			p_color = p_color.slice(1)
			usePound = true

		num = parseInt(p_color, 16)
		r = (num >> 16) + p_amount
		if r > 255
			r = 255
		else if r < 0
			r = 0

		b = ((num >> 8) & 0x00FF) + p_amount
		if b > 255
			b = 255
		else if b < 0
			b = 0

		g = (num & 0x0000FF) + p_amount
		if g > 255
			g = 255
		else if g < 0
			g = 0

		if usePound
			return "#" + (g | (b << 8) | (r << 16)).toString(16)
		else 
			return (g | (b << 8) | (r << 16)).toString(16)
