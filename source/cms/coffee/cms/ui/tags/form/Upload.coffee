#namespace cms.ui.tags.form
class Upload extends cms.ui.Base
	@SELECTOR: 'upload'
	_update:(data)->
		for item in data.add
			@_plugins[item] = new Plugin(item)

		for item in data.remove
			p = @_plugins[item]
			if p
				p.destroy?()

	class Plugin extends BaseDOM
		@_destroyPlugin:(item)->

		constructor:(element)->
			super
			accept = (@attr('accept') || '').trim()
			@_apiPath = @attr('api') || app.apiPath + 'upload'
			if !accept || accept.length == 0
				accept = '*/*'

			accept = accept.split(/(,|;)/)
			for k, v of accept
				accept[k] = v.replace(/\./g, '\\.').replace(/\*/g, '[^/]*').replace(/\//g, '\\/')
			@_accept = new RegExp('(' + accept.join('|') + ')', 'i')

			@_maxSize = Number(@attr('maxSize') || 2000000) * 0.95

			@element.on('drop', @_drop)
			@element.on('dragenter', @_dragEnter)
			@element.on('dragleave', @_dragLeave)
			@element.on('dragover', @_dragOver)
			# @element.on('dragend', @_dragEnd)
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
				@_api.on(API.ERROR, @_chunkUploadError)
			@_apiStarter.submit(@_items)
		_apiStarted:(e, data)=>
			@_uploadId = data
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

		_uploadNextChunk:()->
			if @_chunks.length == 0
				@_completeUpload()
				return
			chunk = @_chunks.shift()
			@_api.url = @_apiUploadURL + chunk.index
			@_api.submit(chunk.buffer)
		_chunkUploadComplete:()=>
			@_uploadNextChunk()

		_chunkUploadError:()=>

		_completeUpload:()->
			@_apiCompleter.url = @_apiPath + '/complete/' + @_uploadId
			@_apiCompleter.submit()

		_apiCompleted:()=>
			console.log("FINISHED!")


		_parseFiles:(files)=>
			@_items = []

			totalSize = 0
			i = files.length
			while i-- > 0
				file = files[i].getAsFile()
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

		_drop:(e)=>
			console.log(@element)
			e.preventDefault()
			files = e.dataTransfer.items
			accepts = @_checkAccepts(files)
			if accepts
				console.log('YAY!')
				# console.log(files[0])
				@_parseFiles(files)
				# @upload()
			else
				console.log('NAY!')

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
				if !@_accept.test(files[i].type)
					accepts = false
					break
			return accepts
