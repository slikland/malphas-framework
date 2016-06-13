class components.TagsInput extends BaseDOM
	@SELECTOR: '.tagsInput'
	@ORDER: 0
	constructor:()->
		super

		parentElement = @element.parentNode
		
		@_addInput = document.createElement("input")
		@_addInput.type = "text"
		@_addInput.name = "tagsRef"
		parentElement.appendChild(@_addInput)

		@_tagContainer = document.createElement("div")
		@_tagContainer.className = "tag-container"
		parentElement.appendChild(@_tagContainer)

		console.log @_tagContainer,@_addInput

		@element.on('keypress', @_update)
	destroy:()->

	_update:()=>
		
		if event.keyCode == 44 || event.keyCode == 13
			valueInputAdd = @_addInput.value+@element.value+','
			@_addInput.value = valueInputAdd

			addTagElement = document.createElement("div")
			addTagElement.className = "tag-content"
			addTagElement.innerHTML = @element.value

			@_tagContainer.appendChild(addTagElement)
			@element.value = ''
			event.preventDefault()