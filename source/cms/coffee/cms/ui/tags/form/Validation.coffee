#namespace cms.ui.tags.form
class Validation extends cms.ui.Base
	@SELECTOR: 'field validation'
	@_ID: 0

	@_validate_email:(value)->
		return /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+)+(\.[a-zA-Z0-9]{2,63})+$/.test(value)
	@_validate_required:(value)->
		if !value || value.trim()?.length == 0
			return false
		return true
	@_validate_regex:(value, data)->
		regex = data?.item?.getAttribute('pattern')
		if !regex
			return false
		o = /^(\/?)(.*?)(?:\1([a-z]*))?$/.exec(regex)
		if !o
			return false
		regex = new RegExp(o[2], o[3])

		return regex.test(value)
	@_validate_match:(value, data, form)->
		field = data?.item?.getAttribute('field')

		field = form[field]

		if !field
			field = data?.item?.getAttribute('field')
			field = form.querySelector(field)
		if !field
			return false
		if field.getAttribute('encode')?.toLowerCase?() == 'philo'
			field.trigger('cleanup')
			fvalue = field.rawValue
		else
			fvalue = field.value
		return fvalue == value

	_update:(data)->
		if !@_pluginInstances
			@_pluginInstances = []
		for item in data.add
			item.setAttribute('p_id', @constructor._ID++)
			@_pluginInstances.push(new Plugin(item))
		for item in data.remove
			p_id = item.getAttribute('p_id')
			i = @_pluginInstances.length
			while i-- > 0
				inst = @_pluginInstances[i]
				if inst.attr('p_id') == p_id
					inst.destroy()
					@_pluginInstances.splice(i, 1)
	class Plugin extends BaseDOM
		@_destroyPlugin:(item)->

		constructor:(element)->
			super({element: element})
			@_parseValidations()
			@_form = @findParents('form')
			@_field = new BaseDOM(@findParents('field'))
			@_input = @_field.find('input,textarea')

			@_input.on('blur', @_blur)
			@_input.on('change', @_change)
			@_input.on('input', @_change)
			@_form?.on('submit', @_submit, true)
		destroy:()=>
			@_input?.off('blur', @_blur)
			@_input?.off('change', @_change)
			@_input?.off('input', @_change)
			@_form?.off('submit', @_submit, true)
			super

		_parseValidations:()=>
			validations = []
			items = @_element.childNodes
			i = items.length
			for item in items
				if !item.nodeType || item.nodeType != Node.ELEMENT_NODE
					continue
				if Validation['_validate_' + item.tagName.toLowerCase()]
					o = {
						item: item
						type: item.tagName.toLowerCase()
						validation: Validation['_validate_' + item.tagName.toLowerCase()]
						message: item.querySelector('message')?.innerHTML || item.getAttribute('message') || null
					}
					validations.push(o)
			@_validations = validations

		_change:()=>
			if !@_passed
				return
			@_validate()

		_blur:()=>
			@_passed = true
			return @_validate()
		_validate:()=>
			value = @_input.value
			valid = true

			for validation in @_validations
				if !validation.validation(value, validation, @_form)
					valid = false
					break
			if !valid
				@_field.removeClass('valid')
				@_field.addClass('invalid')
				if validation.message
					@_showMessage(validation.message)
			else
				@_field.removeClass('invalid')
				@_field.addClass('valid')
				@_hideMessage()
			return valid
		_showMessage:(message)->
			messageField = @_field.find('.validation-message')
			if !messageField
				messageField = document.createElement('div')
				messageField.className = 'validation-message'
				@_field.appendChild(messageField)
			messageField.style.display = ''
			messageField.innerHTML = message

		_hideMessage:()->
			messageField = @_field.find('.validation-message')
			if !messageField
				return
			messageField.style.display = 'none'
		_submit:(e)=>
			if !@_blur()
				e.preventDefault()