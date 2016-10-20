###*
Detections Class
@class Detections
@extends Class
###
class Detections
	matches: [
		{name: 'Opera', nick: /opera/i, test: /opera|opr/i, version: /(?:opera|opr)[\s\/](\d+(\.\d+)*)/i},
		{name: 'Windows Phone', nick: /WindowsPhone/i, test: /windows phone/i, version: /iemobile\/(\d+(\.\d+)*)/i},
		{name: 'Edge', nick: /edge|edgehtml/i, test: /edge|msapphost|edgehtml/i, version: /(?:edge|edgehtml)\/(\d+(\.\d+)*)/i},
		{name: 'Internet Explorer', nick: /explorer|internetexplorer|ie/i, test: /msie|trident/i, version: /(?:msie |rv:)(\d+(\.\d+)*)/i},
		{name: 'Chrome', nick: /Chrome/i, test: /chrome|crios|crmo/i, version: /(?:chrome|crios|crmo)\/(\d+(\.\d+)*)/i},
		{name: 'iPod', nick: /iPod/i, test: /ipod/i},
		{name: 'iPhone', nick: /iPhone/i, test: /iphone/i},
		{name: 'iPad', nick: /iPad/i, test: /ipad/i},
		{name: 'FirefoxOS', nick: /FirefoxOS|ffos/i, test: /\((mobile|tablet);[^\)]*rv:[\d\.]+\)firefox|iceweasel/i, version: /(?:firefox|iceweasel)[ \/](\d+(\.\d+)?)/i},
		{name: 'Firefox', nick: /Firefox|ff/i, test: /firefox|iceweasel/i, version: /(?:firefox|iceweasel)[ \/](\d+(\.\d+)?)/i},
		{name: 'Android', nick: /Android/i, test: /android/i},
		{name: 'BlackBerry', nick: /BlackBerry/i, test: /(blackberry)|(\bbb)|(rim\stablet)\d+/i, version: /blackberry[\d]+\/(\d+(\.\d+)?)/i},
		{name: 'WebOS', nick: /WebOS/i, test: /(web|hpw)os/i, version: /w(?:eb)?osbrowser\/(\d+(\.\d+)?)/i},
		{name: 'Safari', nick: /safari/i, test: /safari/i},
	]

	@getInstance:()=>
		@_instance ?= new @(arguments...)

	constructor:()->
		@matched = null
		@ua = navigator?.userAgent || ''
		@platform = @os = navigator?.platform || ''
		@version = getFirstMatch(/version\/(\d+(\.\d+)*)/i, @ua)
		
		@getBrowser()
		@versionArr = if !@version? then [] else @version.split('.')
		for k, v of @versionArr
			@versionArr[k] = Number(v)
		
		@orientation = if window?.innerWidth > window?.innerHeight then 'landscape' else 'portrait'
		@touch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)
		@tablet = /(ipad.*|tablet.*|(android.*?chrome((?!mobi).)*))$/i.test(@ua)
		@mobile = !@tablet && Boolean(getFirstMatch(/(ipod|iphone|ipad)/i, @ua) || /[^-]mobi/i.test(@ua))
		@desktop = !@mobile && !@tablet

		@canvas = testCanvas()
		@webgl = testWebGL()
		
	test:(value)->
		if !@matched
			return 0
		
		if !(m = value.match(/(?:(?:(\D.*?)(?:\s|$))?(\D.*?)(?:\s|$))?(?:([\d\.]+))?/))
			return 0
		result = 0
		if m[1]
			if new RegExp(m[1], 'i').test(@os)
				result = 1
			else
				return 0
		if m[2]
			if @matched.nick?.test(m[2])
				result = 1
			else
				return 0
		if m[3]
			v = m[3].split('.')
			l = v.length
			if l > @versionArr.length
				l = @versionArr.length
			for i in [0..l]
				if @versionArr[i] > v[i]
					return 2
				else if @versionArr[i] < v[i]
					return -1
		return result


	getBrowser:()->
		for m in @matches
			if m.test.test(@ua)
				@name = m.name
				@version = @version || getFirstMatch(m.version, @ua)
				@matched = m
				break
		return [@name, @version]
		
	testWebGL=()->
		try
			return !!window.WebGLRenderingContext && Boolean(document.createElement("canvas").getContext('webgl')) || Boolean(document.createElement("canvas").getContext('experimental-webgl'))
		catch err
			return false

	testCanvas=()->
		try
			return !!window.CanvasRenderingContext2D && Boolean(document.createElement("canvas").getContext('2d'))
		catch err
			return false

	getFirstMatch=(re, val)->
		m = val.match(re)
		return (m && m.length > 1 && m[1]) || null
