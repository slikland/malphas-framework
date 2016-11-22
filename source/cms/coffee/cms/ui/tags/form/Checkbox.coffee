#namespace cms.ui.tags.form
class Checkbox extends cms.ui.Base
	@SELECTOR: 'input[type="checkbox"]'
	_update:(data)->
		for item in data.add
			@_buildCheckbox(item)

	_buildCheckbox:(item)->
		if item.getAttribute('checked') in [0, '0', false, 'false', null, 'null']
			item.removeAttribute('checked')
		toggle = document.createElement('toggle')
		def = document.createElement('default')
		selected = document.createElement('selected')

		i = document.createElement('i')
		i.className = 'fa fa-square-o'
		def.appendChild(i)

		i = document.createElement('i')
		i.className = 'fa fa-check-square-o'
		selected.appendChild(i)

		toggle.append(def)
		toggle.append(selected)

		parent = item.parentNode
		if item.parentNode.tagName.toLowerCase() == 'field'
			children = ArrayUtils.toArray(parent.children)
			for child in children
				toggle.appendChild(child)
			parent.appendChild(toggle)
		else if	label = item.parentNode.querySelector('label')
			toggle.appendChild(label)
			parent.insertBefore(toggle, item)
			toggle.appendChild(item)
