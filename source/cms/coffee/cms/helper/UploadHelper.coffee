#namespace cms.helper
class UploadHelper extends BaseDOM
	constructor:()->
		super
		@_loading = new cms.ui.Loading()
		@_loading.reset()
		@_loading.hide()
		@appendChild(@_loading)
		accept = (@attr('accept') || 'image/jpg;image/jpeg;image/png;image/gif').trim()
		@_apiPath = @attr('api') || app.apiPath + 'upload'
		if !accept || accept.length == 0
			accept = '*/*'

		accept = accept.split(/,|;/)
		@_acceptStr = accept.join(',')
		for k, v of accept
			accept[k] = v.replace(/\./g, '\\.').replace(/\*/g, '[^/]*').replace(/\//g, '\\/')
		@_accept = new RegExp('(' + accept.join('|') + ')', 'i')

		@_maxSize = Number(@attr('maxSize') || 2000000) * 0.95
		
		@_container = document.createElement('div')
		@_container.className = 'container'
		if el = @find('placeholder')
			@_container.appendChild(el)
		if el = @find('preview')
			@_container.appendChild(el)
		@appendChild(@_container)

		@element.on('drop', @_drop)
		@element.on('dragenter', @_dragEnter)
		@element.on('dragleave', @_dragLeave)
		@element.on('dragover', @_dragOver)
		@_container.on('click', @_click)

		if @attr('value')
			@_setValue(@attr('value'))

	@get apiPath:()->
		return @_apiPath
	@set apiPath:(value)->
		@_apiPath = value

	_remove:()=>
		@_setValue(null)

	upload:()->
		if @_uploading
			return
		@_uploading = true
		@_startUpload()
	_startUpload:()=>
		if !@_api
			@_apiStarter = new API(@_apiPath + '/start')
			@_apiStarter.reuse = true
			@_apiStarter.type = 'json'
			@_apiStarter.on(API.COMPLETE, @_apiStarted)

			@_apiCompleter = new API(@_apiPath + '/complete')
			@_apiCompleter.reuse = true
			@_apiCompleter.type = 'json'
			@_apiCompleter.on(API.COMPLETE, @_apiCompleted)
			@_api = new API(@_apiPath)
			@_api.reuse = true
			@_api.type = 'binary'
			@_api.on(API.COMPLETE, @_chunkUploadComplete)
			@_api.on(API.PROGRESS, @_chunkProgress)
			@_api.on(API.ERROR, @_chunkUploadError)
		@_apiStarter.submit(@_items)
	_apiStarted:(e, data)=>
		@_loading.show()
		@_uploadId = data.id
		@_apiUploadURL = @_apiPath + '/' + @_uploadId + '/'
		@_splitChunks()
		@_uploadNextChunk()
	_splitChunks:()->
		@_chunks = []
		i = 0
		l = @_buffer.byteLength
		while i < l
			init = i
			end = i + @_maxSize
			if end > l
				end = l
			b = @_buffer.slice(init, end)
			@_chunks.push({buffer: b, index: init})
			i = end
		@_numChunks = @_chunks.length

	_chunkProgress:(e)=>
		p = 1 - ((@_chunks.length + 1) / @_numChunks) + e.progress / @_numChunks
		@_loading.progress = p

	_uploadNextChunk:()->
		if @_chunks.length == 0
			@_completeUpload()
			return
		@_loading.progress = 1 - ((@_chunks.length) / @_numChunks)
		chunk = @_chunks.shift()
		@_api.url = @_apiUploadURL + chunk.index
		@_api.submit(chunk.buffer)
	_chunkUploadComplete:()=>
		@_uploadNextChunk()

	_chunkUploadError:()=>

	_completeUpload:()->
		@_loading.progress = 1
		@_loading.hide()
		@_apiCompleter.url = @_apiPath + '/complete/' + @_uploadId
		@_apiCompleter.submit()

	_apiCompleted:(e, data)=>
		@_uploading = false
		@_setValue(data)
		@trigger('complete', data)

	_setValue:(value)->
		@removeClass('deny')
		@removeClass('accept')

	_parseFiles:(files)=>
		@_items = []

		totalSize = 0
		i = files.length
		while i-- > 0
			if files[i] instanceof File
				file = files[i]
			else if files[i].getAsFile?
				file = files[i].getAsFile()
			else
				continue
			@_items[i] = {name: file.name, size: file.size, file: file, init: totalSize}
			totalSize += file.size
		@_totalSize = totalSize
		@_buffer = new ArrayBuffer(@_totalSize)
		@_bufferView = new Uint8Array(@_buffer)

		@_loadNextFile()
	_loadNextFile:()=>
		if !@_fileReader
			@_fileReader = new FileReader()
			@_fileReader.addEventListener('load', @_fileLoaded)

		allLoaded = true
		i = @_items.length
		while i-- > 0
			if @_items[i].file
				allLoaded = false
				@_currentItem = @_items[i]
				file = @_currentItem.file
				@_fileReader.readAsArrayBuffer(file)
				break
		if allLoaded
			@_currentItem = null
			@_filesLoaded()

	_fileLoaded:()=>
		@_currentItem['file'] = null
		@_bufferView.set(new Uint8Array(@_fileReader.result), @_currentItem.init)
		delete @_currentItem['file']
		setTimeout(@_loadNextFile, 0)

	_filesLoaded:()=>
		@upload()

	selectFile:()=>
		@_click()
	_click:(e)=>
		if !@_fileBrowser
			@_fileBrowser = document.createElement('input')
			@_fileBrowser.setAttribute('type', 'file')
			if @_acceptStr
				@_fileBrowser.setAttribute('accept', @_acceptStr)
			@_fileBrowser.addEventListener('change', @_fileSelect)
		@_fileBrowser.click()
	_fileSelect:(e)=>
		if @_fileBrowser.files.length > 0
			@_parseFiles(@_fileBrowser.files)
	_drop:(e)=>
		e.preventDefault()
		files = e.dataTransfer.items
		console.log(files)
		accepts = @_checkAccepts(files)
		if accepts
			console.log(files)
			@_parseFiles(files)
		else
			1
	_dragOver:(e)=>
		e.preventDefault()
		e.stopImmediatePropagation()

	_dragEnd:(e)=>
			items = e.dataTransfer.items
			if items
				while items.length > 0
					items.remove(0)
			else
				e.dataTransfer.clearData()

	_dragEnter:(e)=>
		e.preventDefault()
		e.dataTransfer.dropEffect = 'move'
		f = e.dataTransfer.items[0].getAsFile()
		files = e.dataTransfer.items
		accepts = @_checkAccepts(files)
		if accepts
			@removeClass('deny')
			@addClass('accept')
		else
			@removeClass('accept')
			@addClass('deny')

	_dragLeave:(e)=>
		e.dataTransfer.dropEffect = 'none'
		@removeClass('accept')
		@removeClass('deny')

	_checkAccepts:(files)->
		accepts = true
		i = files.length
		if i == 0
			accepts = false
		while i-- > 0
			console.log(files[i].type)
			if !@_accept.test(files[i].type)
				accepts = false
				break
		return accepts
