class components.Filter extends BaseDOM
	@SELECTOR: '.filter'
	constructor:()->
		super
		@_templateNode = @element.templateNode
		setTimeout(@_create, 0)
	_create:()=>
		if @_created
			return
		@_created = true

		@_parseInputs()

	_parseInputs:()->
		inputs = @findAll('input')

		i = inputs.length
		while i-- > 0
			inputs[i].addEventListener('change', @_inputChange)
		@_inputs = inputs
	_inputChange:()=>
		values = {}
		i = @_inputs.length
		while i-- > 0
			input = @_inputs[i]
			name = input.getAttribute('name')
			if !values[name]
				values[name] = []
			if input.checked
				if !name
					continue
				values[name].push(input.value)

		for k, v of values
			values[k] = v.join(',')
		@_updateTarget(values)

	destroy:()->
		@removeAll()
		@off()

	_updateTarget:(values)=>
		if !@_target
			@_target = document.getElementById(@attr('for'))?.getInstance()
		
		if !@_target
			return
		@_target.update(values)
