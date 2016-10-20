#namespace components

class TaggleWrapper extends BaseDOM
	@SELECTOR: '.tags'
	@ORDER: 0
	constructor:()->
		super


		@_searchAPI = new API(API.ROOT_PATH + 'tags/tagsGenerate/')
		@_searchAPI.reuse = true
		@_searchAPI.on(API.COMPLETE, @_searchComplete)

		@_callSearch()

	_onSelect:(e, v)=>
		e.preventDefault()
		if e.which is 1
			taggle.add(v.item.value)

	destroy:()->

	_callSearch:()->
		@_searchAPI.cancel()
		clearTimeout(@_searchTimeout)
		@_searchTimeout = setTimeout(@_searchAPI.load, 500, {})

	_searchComplete:(e, data)=>
		
		tagsSel = @attr('tags')
		if !tagsSel
			taggle = new Taggle($('.tags.textarea')[0],{
				duplicateTagClass: 'bounce'
			})
		else
			tags = tagsSel.split(",")
			taggle = new Taggle($('.tags.textarea')[0],{
				tags: tags,
				duplicateTagClass: 'bounce'
			})

		container = taggle.getContainer()
		input = taggle.getInput()

		$(input).autocomplete({
			source: data,
			appendTo: container,
			position: { 
				at: 'left bottom',
				of: container 
			},
			select: @_onSelect
		})