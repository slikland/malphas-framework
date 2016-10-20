#namespace components

class CropperImg extends BaseDOM
	@SELECTOR: '.cropper'
	@ORDER: 0
	constructor:()->
		super
		@_parentElement = @element.parentNode
		@_image = @attr("value")
		
		@element.on("change", @_create)

		@_FileReader = new FileReader
		

	_create:()=>

		that = @
		if @_addImgContainer
			@_parentElement.removeChild(@_addImgContainer.element)
		@_addImgContainer = new BaseDOM({className:"img-container"})
		@_parentElement.appendChild(@_addImgContainer)

		@_image = @element.files[0]

		@_addImg = new BaseDOM({element:"img"})
		@_addImgContainer.appendChild(@_addImg)

		@_FileReader.onload = ->
			dataURL = @.result
			that._addImg.element.src = dataURL
			that._call()
			return
		@_FileReader.readAsDataURL @_image


	_call:()=>
		@_imageContent = document.querySelector('.img-container > img')
		@_cropper = new Cropper(@_imageContent, {
			dragMode: 'none',
			aspectRatio: 900 / 540,
			viewMode: 3,
			autoCropArea: 1,
			restore: false,
			guides: false,
			center: true,
			scalable: false,
			highlight: false,
			cropBoxMovable: true,
			zoomable: false,
			toggleDragModeOnDblclick: false,
			cropBoxResizable: false
		})

		@_imageContent.addEventListener("cropend", @_show)
		@_imageContent.addEventListener("built", @_show)

	_show:()=>
		@_imageCreate = document.getElementsByClassName("imageCreate")
		@_imageCreate[0].value = @_cropper.getCroppedCanvas({"width":900,"height":540}).toDataURL()

	destroy:()->