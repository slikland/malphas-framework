class components.CropperImg extends BaseDOM
	@SELECTOR: '.resizeImageUp'
	@ORDER: 0
	constructor:()->
		super
		@_parentElement = @element.parentNode
		@_image = @attr("value")
		
		@element.on("click", @_create)
		

	_create:()=>
		addLighbox = document.createElement("div")
		$(addLighbox).attr('class', 'wb_lightbox')

		addContentCentral = document.createElement("div")
		$(addContentCentral).attr('class', 'addContent')

		addCloseLighbox = document.createElement("div")
		$(addCloseLighbox).attr('class', 'closeLightbox')
		$(addCloseLighbox).attr('onClick', 'wb_lightboxClose()')
		$(addCloseLighbox).append('<i class="fa fa-times" aria-hidden="true"></i>')

		$(addContentCentral).append(addCloseLighbox)

		$(addLighbox).append(addContentCentral)

		$("body").prepend(addLighbox)

		idattr = @attr("id")
		urlUpload = @attr("urlUpload")

		$(addContentCentral).append('<h1>Adicionar imagem</h1>');
		addContent = document.createElement("form")
		$(addContent).attr('class', 'formResize')
		$(addContent).attr('action', urlUpload)
		$(addContent).attr('tagRescue', idattr)
		$(addContent).attr('enctype', 'multipart/form-data')

		addlabel = document.createElement("label")
		$(addlabel).append('Select your image')
		$(addContent).append(addlabel)
		addInput = document.createElement("input")
		$(addInput).attr('name', 'img')
		$(addInput).attr('type', 'file')
		$(addInput).attr('required', 'true')
		$(addContent).append(addInput)

		addImgResize = document.createElement("div")
		$(addImgResize).addClass('resizeImg')
		$(addContent).append(addImgResize)

		addButton = document.createElement("button")
		$(addButton).attr('class', 'send')
		$(addButton).append("Salvar")
		$(addContent).append(addButton)
		

		$(addContentCentral).append(addContent)

		submitFormResize()
		


	_call:()=>

	_uploadImg:()=>


		

	_show:()=>
		

	destroy:()->