class components.TagsInput extends BaseDOM
	@SELECTOR: '.tagsInput'
	@ORDER: 0
	constructor:()->
		super

		@_parentElement = @element.parentNode
		
		tagValue = @attr('tagValue')
		@_addInput = new BaseDOM({element:"input"})
		@_addInput.element.type = "hidden"
		@_addInput.element.name = "tagsRef"
		@_addInput.element.value = tagValue
		@_parentElement.appendChild(@_addInput)

		@_tagContainer = new BaseDOM({className:"tag-container"})
		@_parentElement.appendChild(@_tagContainer)

		@_valuesTag = @_addInput.element.value.split(",")
		totalTags = @_valuesTag.length - 1
		for i in [0...totalTags]
			@_insertTags(@_valuesTag[i])

		@_searchAPI = new API(API.ROOT_PATH + 'tags/findTag/')
		@_searchAPI.reuse = true
		@_searchAPI.on(API.COMPLETE, @_searchComplete)

		@element.on('keypress', @_add)
		@element.on('keyup', @_search)
	destroy:()->

	_insertTags:(text)=>

		@_addTagElement = new BaseDOM({className:"tag-content"})
		addDeleteIcon = new BaseDOM({element:"i",className:"fa fa-times fa-fw deleteTag"})
		@_addTagElement.element.innerHTML = text
		@_addTagElement.attr("name",text)
		@_addTagElement.appendChild (addDeleteIcon)
		@_tagContainer.appendChild(@_addTagElement)

		addDeleteIcon?.element.on('click', @_delete)

	_delete:(clicked)=>

		parentDelete = clicked.target.parentNode.parentNode
		childDelete = clicked.target.parentNode
		textDeleted = childDelete.getAttribute("name")
		parentDelete.removeChild(childDelete)

		@_valuesTag = @_addInput.element.value.split(",")
		itemRemove = @_valuesTag.indexOf(textDeleted)
		@_valuesTag.splice(itemRemove, 1);
		
		insertData = @_valuesTag.join()
		@_addInput.element.value = insertData

	_add:()=>

		if event.keyCode == 44 || event.keyCode == 13
			
			text = @element.value
			text = text.replace(/\,/g, "");
			@_valuesTag = @_addInput.element.value.split(",")
			findText = @_valuesTag.indexOf(text)
			if findText > -1 || text == ' '
				@element.value = ''
				event.preventDefault()
				return

			valueInputAdd = @_addInput.element.value+text+','
			@_addInput.element.value = valueInputAdd
			@_insertTags(text)
			@element.value = ''
			event.preventDefault()
			return

	_search:()=>
		if event.keyCode != 44 && event.keyCode != 13
			text = @element.value
			if text != ''
				@_callSearch(text)
				
			else
				if @_searchElement
					@_parentElement.removeChild(@_searchElement.element)
					@_searchElement = null
	_callSearch:(text)->
		@_searchAPI.cancel()
		clearTimeout(@_searchTimeout)
		@_searchTimeout = setTimeout(@_searchAPI.load, 500, {search: text})

	_searchComplete:(e, data)=>
		if data
			total = data.length
			if total > 0
				if @_searchElement
					@_searchElement.element.innerHTML = ''
				if !@_searchElement
					@_searchElement = new BaseDOM({className:"search-tag"})
					@_parentElement.appendChild(@_searchElement)
				for i in [0...total]
					@_addItemList(data[i]['name'])
			else
				@_parentElement.removeChild(@_searchElement.element)
				@_searchElement = null

	_addItemList:(text)=>
		addItemList = new BaseDOM({element:"p"})
		addItemList.element.innerHTML = text
		@_searchElement.appendChild(addItemList)