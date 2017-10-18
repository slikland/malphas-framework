#namespace slikland.crypt

class Philo
	@chars:()->
		if !@_charMap
			charCodes = [[33, 59], [63, 126], [161, 172], [174, 255]]
			@_charMap = []
			ci = 0
			i = -1
			l = charCodes.length
			while ++i < l
				cc = charCodes[i]
				j = -1
				jl = cc[1] - cc[0]
				while ++j <= jl
					@_charMap[ci++] = String.fromCharCode(j + cc[0])
		return @_charMap
	@encode:(value)->
		isJson = false
		if typeof(value) != 'string' || Number.isNaN(value)
			value = JSON.stringify(value)
			isJson = true
		value = value.toString()
		vl = value.length
		ts = (((new Date().getTime() * 0.001) % (365.25 * 24 * 60 * 60))) / (60 * 60 * 24) >> 0
		chars = @chars()

		bi = 0
		bytes = []
		bytes[bi++] = (vl >> 0) & 0xFF
		bytes[bi++] = (vl >> 8) & 0xFF
		bytes[bi++] = (vl >> 16) & 0xFF
		bytes[bi++] = (vl >> 24) & 0xFF
		bytes[bi++] = ts & 0xFF
		bytes[bi++] = (ts >> 8) & 0xFF

		i = -1
		l = value.length
		bin = ''
		while ++i < l
			bytes[bi++] = value.charCodeAt(i)

		i = -1
		l = bytes.length
		while ++i < l
			b = bytes[i].toString(2)
			bin += @_lpad(b, 8)

		cl = chars.length
		skipper = Math.random() * cl >> 0
		sider = Math.random() * cl >> 0
		siderStr = @_lpad(sider.toString(2), 8)

		si = skipper
		i = 0
		l = bin.length
		c = 0
		res = ''
		while i < l
			b = @_rpad(bin.substr(i, 7), 7)
			sn = ((sider >> (c % 8) & 1) << 1) - 1
			b = Number('0b' + b) + si * sn
				
			b = (((b % cl) + cl) % cl)
			si = b % cl
			res += chars[b]
			i += 7
			c++

		res = chars[skipper] + res + chars[sider]
		return res

	@_lpad:(value, size = 0, char = '0')->
		value = value.toString()
		if !char
			char = '0'
		while value.length < size
			value = char + value
		return value
	@_rpad:(value, size = 0, char = '0')->
		value = value.toString()
		if !char
			char = '0'
		while value.length < size
			value += char
		return value
