class JSONUtils
	@parseJSON:(json)=>
		stringfied = false
		if typeof(json) == 'string'
			stringfied = true
			json = @replaceMultiline(json)
		json = @removeComments(json)
		if stringfied
			json = JSON.parse(json)
		return json

	@replaceMultiline:(json)->
		if typeof(json) != 'string'
			return json
		json = json.replace(/^(\s*.*?""")(?:[\s\t]*\n)?([\t\s]*)(\S[\s\S]*)\n?[\s]*(""")/igm, @_replaceMultilinePart)
		json = json.replace(/^(\s*.*?)"""([\s\S]*?)"""/igm, @_replaceEmptyMultiline)
		return json

	@_replaceMultilinePart:(match, prefix, spaces, value, suffix)->
		re = new RegExp(spaces + '?([^\n]*)', 'g')
		value = value.replace(re, '$1')
		return prefix + value + suffix
	@_replaceEmptyMultiline:(match, prefix, value)->
		value = value.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t')
		return prefix + '"' + value + '"'
	@removeComments:(json)->
		stringfied = true
		if typeof(json) != 'string'
			stringfied = false
			json = JSON.stringify(json)
		json = json.replace(/(^|\s)(\/\/.*$)|(\/\*(.|\s)*?\*\/?)/igm, '')

		if stringfied
			return json
		else
			return JSON.parse(json)

	@filterObject:(data, name, type = null, ignore = null, getParent = false)->
		resp = []
		name = [].concat(name)
		if ignore
			ignore = [].concat(ignore)
		for k, v of data
			if ignore
				if ignore.indexOf(k) >= 0
					continue
			if name.indexOf(k) >= 0
				add = true
				if type
					if typeof(v) != type
						add = false
				if add
					if getParent
						if resp.indexOf(data) < 0
							resp.push(data)
					else
						resp.push(v)
			if typeof(v) == 'array' || typeof(v) == 'object'
				resp = [].concat(resp, @filterObject(v, name, type, ignore, getParent))
		return resp
	@fromHTML:(element)->
		data = @_parseHTMLToJSON(element)
		console.log(data)
		return data

	@_parseHTMLToJSON:(element)->
		if element.nodeType != 1
			return element.toString()
		children = element.childNodes
		data = {}
		arrayData = []
		for child in children
			if child.nodeType == 1
				childData = @_parseHTMLToJSON(child)
				for attr in child.attributes
					if attr.name.toLowerCase() == 'mara'
						continue
					if attr.value.toString().length == 0
						continue
					childData[attr.name] = attr.value
				if child.localName == '_'
					arrayData.push(childData)
				else
					if data[child.localName]
						if !Array.isArray(data[child.localName])
							data[child.localName] = [data[child.localName]]
						data[child.localName].push(childData)
					else
						data[child.localName] = childData
			else
				return child.data
		for k, v of arrayData
			data[Number(k)] = v
		return data