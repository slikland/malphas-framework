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
	@luminance:(rgbHex)->
		arr = @hexToRGBArray(rgbHex)
		return (arr[0] * 0.2126 + arr[1] * 0.7152 + arr[2] * 0.0722) / 0xFF

	@hexToRGB:(rgbHex)->
		arr = @hexToRGBArray(rgbHex)
		return {r: arr[0], g: arr[1], b: arr[2], a: arr[3]}
	@hexToRGBArray:(rgbHex)->
		rgbHex = Number(rgbHex.replace(/^\#?([0-9a-f]*?)$/i, '0x$1'))
		return [rgbHex >> 16 & 0xFF, rgbHex >> 8 & 0xFF, rgbHex & 0xFF, rgbHex >> 24 & 0xFF]

	@rgbToHex:(r, g, b, a = 0)->
		return @rgbArrayToHex([r, g, b, a])
	@rgbArrayToHex:(arr)->
		l = 6
		c = arr[0] << 16 | arr[1] << 8 | arr[2]
		if arr[3]
			l = 8
			c |= arr[3] << 24
		c = c.toString()
		while c.length < l
			c = '0' + c
		return c
