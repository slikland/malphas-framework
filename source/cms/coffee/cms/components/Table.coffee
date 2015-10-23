class components.Table extends BaseDOM
	@SELECTOR: 'table'
	constructor:()->
		super
		@_parseHeader()
	destroy:()->
		@removeAll()
		@off()
		
	_parseHeader:()=>
		heads = @findAll('thead th')
		i = heads.length
		while i-- > 0
			head = heads[i]
			sort = head.getAttribute('sort')
			if !sort || sort.length == 0
				continue
			head = new TableHeader(head)
			head.on('click', @_headerClick)
	_headerClick:()=>


	class TableHeader extends BaseDOM
		constructor:(el)->
			super({element: el})

			@css({cursor: 'pointer'})
			@_icon = new BaseDOM({element: 'i', className: 'sort-icon'})
			@appendChild(@_icon)