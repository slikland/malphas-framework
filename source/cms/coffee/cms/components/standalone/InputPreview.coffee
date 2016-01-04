class components.standalone.InputPreview extends StandaloneBase
	@SELECTOR: 'input[preview]'
	constructor:(params)->
		super

		@_setupPreview(@attr('preview'))

		value = @attr('value')
		if value && value.trim().length > 0
			@_initialValue = value
		@_setSource(value)

		@element.on('change', @_change)
	_setSource:(value)->
		if !value
			value = @_initialValue
		if !value
			@_container.css('display', 'none')
		else
			@_container.css('display', '')
			@_container.attr('src', value)
	_change:()=>
		if @element.files.length == 0
			if @_initialValue
				@_setSource(@_initialValue)
		else
			@_reader = new FileReader()
			@_reader.onload = @_fileLoaded
			@_reader.readAsDataURL(@element.files[0])
	_fileLoaded:(e)=>
		@_setSource(@_reader.result)
	_setupPreview:(type)->
		@_container
		switch type.toLowerCase()
			when 'image'
				@_container = new BaseDOM({element: 'img'})
			when 'video'
				@_container = new BaseDOM({element: 'video'})
				@_container.attr('controls', '')
		@_container.css({'max-width': '100%'})

		childs = @element.parentNode.childNodes
		i = childs.length
		while i-- > 0
			if childs[i] == @element
				break
		if i == childs.length - 1
			@element.parentNode.appendChild(@_container.element)
		else
			@element.parentNode.insertBefore(@_container.element, childs[i + 1])
