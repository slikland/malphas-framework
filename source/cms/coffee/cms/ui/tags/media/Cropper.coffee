#namespace cms.ui.tags.media
#import cms.helper.UploadHelper

class Cropper extends cms.ui.Base
	@SELECTOR: 'cropper'
	_update:(data)->
		if !@_pluginInstances
			@_pluginInstances = []
		for item in data.add
			item.setAttribute('p_id', @constructor._ID++)
			@_pluginInstances.push(new Plugin(item))
		for item in data.remove
			p_id = item.getAttribute('p_id')
			i = @_pluginInstances.length
			while i-- > 0
				inst = @_pluginInstances[i]
				if inst.attr('p_id') == p_id
					inst.destroy()
					@_pluginInstances.splice(i, 1)

	class Plugin extends BaseDOM
		@_destroyPlugin:(item)->

		constructor:(element)->
			super({element: element})

			@_uploadHelper = new cms.helper.UploadHelper(@)
			@_uploadHelper.on('complete', @_uploadComplete)
			@_uploadHelper.apiPath = @attr('apiPath') || app.apiPath + 'image'

			@addClass('cropper')

			@_canvas = new CropCanvas()
			@_canvas.on('update', @_canvasUpdate)
			@appendChild(@_canvas)

			window.addEventListener('resize', @_resize)
			@_resize()

			@_parseSizes()

			if @attr('width')
				@_canvas.attr('width', @attr('width'))

			@element.on('selectImage', @_uploadHelper.selectFile)

		@get uploadHelper:()->
			return @_uploadHelper

		destroy:()->
			app.off('redraw', @_update)

			window.removeEventListener('resize', @_resize)
			@_canvas?.destroy()
			super

		_uploadComplete:(e, data)=>
			currentData = @_currentSize.data
			currentData['src'] = data.path
			@_canvas.setData(currentData, true)
			@_currentSize.updateSrc(currentData['src'], data['id'])

			@_keepScrollPos()
			if @_currentSize.default
				for size in @_sizes
					if size == @_currentSize
						continue
					if !size.data['src']
						size.updateSrc(currentData['src'])

		_update:()=>
			@_parseSizes()

		_keepScrollPos:()->
			if @_thumbs
				st = @_thumbs.element.scrollTop

				setTimeout(()=>
					@_thumbs.element.scrollTop = st
				, 0)


		selectSize:(index)->
			@_keepScrollPos()
			for i, item of @_sizes
				item.selected = (Number(i) == index)
				if item.selected
					@_currentSize = item
			if @_thumbs
				st = @_thumbs.element.scrollTop
			@_canvas.setData(@_currentSize.data)

		_resize:()=>
			@_keepScrollPos()
			if @_sizes
				if @_sizes.length > 1
					for size in @_sizes
						size.resize()
			@_canvas.resize()

		_canvasUpdate:(e, data)=>
			@_keepScrollPos()
			@_currentSize.updateCrop(data.crop, true)
			if @_currentSize.default
				for size in @_sizes
					if size == @_currentSize
						continue
					if !size.cropSet
						size.updateCrop(data.crop)

		_parseSizes:()=>
			@_sizes = []
			items = @findAll('size')
			if items.length == 0
				app.on('redraw', @_update)
				return
			app.off('redraw', @_update)

			first = true
			@_defaultSize = null
			@_thumbs = new BaseDOM({'element': 'div', 'className': 'thumbs'})
			for item in items
				if item.parentNode
					item.parentNode.removeChild(item)
				size = new Size(item)
				if first
					size.default = true
					@_defaultSize = size
					first = false
				else
					sizeData = size.data
					if !sizeData['src']
						sizeData['src'] = @_defaultSize.data['src']
				@_sizes.push(size)

			if @_sizes.length > 0
				for size in @_sizes
					size.on('click', @_sizeClick)
					@_thumbs.appendChild(size)
				@appendChild(@_thumbs)
				@addClass('hasThumbs')

			if @attr('height')
				if @_thumbs
					@_thumbs.css({'max-height': '100%'})
				@_canvas.attr('height', @attr('height'))

			@_resize()
			i = @_sizes.length
			while i-- > 0
				@selectSize(i)

		_sizeClick:(e)=>
			@selectSize(@_sizes.indexOf(e.currentTarget))

	class CropCanvas extends BaseDOM
		constructor:()->
			super({'element': 'div', 'className': 'canvas'})

			@_buildCanvas()

		destroy:()->
			clearTimeout(@_resizeTimeout)
			super

		_buildCanvas:()->
			@_container = new BaseDOM({'className': 'container'})
			@_preview = new BaseDOM({className: 'preview'})

			@_cropArea = new BaseDOM({element: 'div', className: 'area'})

			@_corners = {}
			corner = new BaseDOM({element: 'div', className: 'corner'})
			@_corners['tl'] = corner

			corner = new BaseDOM({element: 'div', className: 'corner'})
			@_corners['tr'] = corner

			corner = new BaseDOM({element: 'div', className: 'corner'})
			@_corners['bl'] = corner

			corner = new BaseDOM({element: 'div', className: 'corner'})
			@_corners['br'] = corner


			for k, corner of @_corners
				corner.name = k
				corner.element.name = k
				corner.element.on('mousedown', @_cornerDown)
				corner.addClass(k)
				@_cropArea.appendChild(corner)
			@_cropArea.element.on('mousedown', @_areaDown)
			@_preview.appendChild(@_cropArea)
			@_container.appendChild(@_preview)
			@appendChild(@_container)

			@_cropArea.css({
				width: '200px'
				height: '300px'
			})

			@_buildBG()

		_buildBG:()->
			@_bgCanvas = document.createElement('canvas')
			@_bgCanvas.setAttribute('width', 10)
			@_bgCanvas.setAttribute('height', 10)
			context = @_bgCanvas.getContext('2d')
			context.fillStyle = '#FFFFFF'
			context.fillRect(0, 0, 10, 10)
			context.fillStyle = '#CCCCCC'
			context.fillRect(0, 0, 5, 5)
			context.fillRect(5, 5, 5, 5)
			@css({'background-image': 'url(' + @_bgCanvas.toDataURL() + ')'})

		setData:(data, resetCrop = false)->
			if !@_image
				@_image = new Image()
				@_image.className = 'image'
				@_image.onload = @_imageLoaded
			if data['src']
				@_resetCrop = resetCrop
				@_image.src = data['src']
				@_preview.css({'display': ''})
			else
				@_preview.css({'display': 'none'})
			@_cropRect = [].concat(data['crop'])
			@_cropWidth = data['width']
			@_cropHeight = data['height']
			@_aspectRatio = @_cropWidth / @_cropHeight
			@_container.appendChild(@_image)

		_imageLoaded:()=>
			@_image.style['width'] = ''
			@_image.style['height'] = ''

			@_imageWidth = @_image.naturalWidth || @_image.width
			@_imageHeight = @_image.naturalHeight || @_image.height
			s = @_imageWidth / @_imageHeight
			@_imageAspect = s
			@_preview.css({'display': ''})

			setTimeout(@resize, 0)

		_triggerUpdate:()->
			data = {crop: @_cropRect, 'src': @_image.src}
			@trigger('update', data)

		resize:()=>
			if !(@attr('width') || @attr('height'))
				@css({
					width: ''
					height: ''
				})
				bounds = @getBounds()

				w = bounds.width
				h = w * 0.75
				if @element.parentNode
					pBounds = @element.parentNode.getBoundingClientRect()
					if pBounds.height > h
						h = pBounds.height
				if h > window.innerHeight * 0.8
					h = window.innerHeight * 0.8
				h -= bounds.top - pBounds.top
				@css({
					width: w + 'px'
					height: h + 'px'
				})
			else
				b = @element
				bounds = @getBounds()
				w = bounds.width
				h = bounds.height
				if @element.parentNode
					pBounds = @element.parentNode.getBoundingClientRect()
					h -= bounds.top - pBounds.top
			if !w || !h
				@_resizeTimeout = setTimeout(@resize, 1)
				return
			if @_image
				s = @_imageWidth / @_imageHeight
				if w / h > s
					s = h / @_imageHeight
				else
					s = w / @_imageWidth
				@_scaleWidth = @_imageWidth * s
				@_scaleHeight = @_imageHeight * s
				@_preview.element.style['width'] = @_image.style['width'] = @_scaleWidth + 'px'
				@_preview.element.style['height'] = @_image.style['height'] = @_scaleHeight + 'px'
				@_preview.element.style['left'] = @_image.style['left'] = (w - @_scaleWidth) * 0.5 + 'px'
				@_preview.element.style['top'] = @_image.style['top'] = (h - @_scaleHeight) * 0.5 + 'px'
			@_redrawArea()

		_redrawArea:()=>
			if !@_cropRect
				return
			px = @_cropRect[0]
			py = @_cropRect[1]
			w = @_cropRect[2]
			h = @_cropRect[3]

			if px < 0
				px = 0
			if py < 0
				py = 0

			if w < 0.1
				w = 0.1
			if h < 0.1
				h = 0.1

			s = w / h
			nw = w
			nh = h
			ratio = @_aspectRatio / @_imageAspect
			if @_aspectRatio > s
				nw = h * ratio
			else
				nh = w / ratio
			if nw > 1
				nw = 1
				nh = nw / ratio
			if nh > 1
				nh = 1
				nw = nh * ratio
			w = nw
			h = nh
			if px + w > 1
				px = 1 - w
			if py + h > 1
				py = 1 - h
			if @_resetCrop
				s = 1
				if @_aspectRatio > @_imageAspect
					w = 1
					h = ((@_imageWidth / @_cropWidth) * @_cropHeight) / @_imageHeight
				else
					h = 1
					w = ((@_imageHeight / @_cropHeight) * @_cropWidth) / @_imageWidth
				px = (1 - w) * 0.5
				py = (1 - h) * 0.5
				console.log(px, py, w, h)
				@_resetCrop = false

			@_cropRect[0] = px
			@_cropRect[1] = py
			@_cropRect[2] = w
			@_cropRect[3] = h
			@_cropArea.css({
				'left': @_cropRect[0] * 100 + '%'
				'top': @_cropRect[1] * 100 + '%'
				'width': @_cropRect[2] * 100 + '%'
				'height': @_cropRect[3] * 100 + '%'
			})
			@_triggerUpdate()
				

		_removeEventListeners:()->
			@_currentCorner = null
			window.removeEventListener('mousemove', @_cornerMouseMove)
			window.removeEventListener('mouseup', @_cornerMouseUp)
			window.removeEventListener('mousemove', @_areaMouseMove)
			window.removeEventListener('mouseup', @_areaMouseUp)

		_addCornerEventListeners:(corner)->
			@_currentCorner = corner
			window.addEventListener('mousemove', @_cornerMouseMove)
			window.addEventListener('mouseup', @_cornerMouseUp)

		_addAreaEventListeners:()->
			window.addEventListener('mousemove', @_areaMouseMove)
			window.addEventListener('mouseup', @_areaMouseUp)

		_cornerDown:(e)=>
			target = e.currentTarget
			e.preventDefault()
			e.stopImmediatePropagation()
			@_addCornerEventListeners(target)

		_cornerMouseMove:(e)=>
			cornerName = @_currentCorner.name
			pos = MouseUtils.getMousePos(e)
			bounds = @_preview.getBounds()
			bw = bounds.right - bounds.left
			bh = bounds.bottom - bounds.top
			pos[0] = pos[0] - bounds.left
			pos[1] = pos[1] - bounds.top

			corners = cornerName.split('')
			px = @_cropRect[0]
			py = @_cropRect[1]
			w = @_cropRect[2]
			h = @_cropRect[3]

			for p in corners
				switch p
					when 't'
						py = pos[1] / bh
						h = (@_cropRect[1] + @_cropRect[3]) - py
					when 'b'
						h = pos[1] / bh - py
					when 'l'
						px = pos[0] / bw
						w = (@_cropRect[0] + @_cropRect[2]) - px
					when 'r'
						w = pos[0] / bw - px
			if px < 0
				px = 0
			if py < 0
				py = 0

			if w < 0.1
				w = 0.1
			if h < 0.1
				h = 0.1

			s = w / h
			nw = w
			nh = h
			ratio = @_aspectRatio / @_imageAspect
			if @_aspectRatio > s
				nw = h * ratio
			else
				nh = w / ratio
			if nw > 1
				nw = 1
				nh = nw / ratio
			if nh > 1
				nh = 1
				nw = nh * ratio
			if corners.indexOf('l') >= 0
				px = (px + w) - nw
			if corners.indexOf('t') >= 0
				py = (py + h) - nh
			w = nw
			h = nh
			if px + w > 1
				px = 1 - w
			if py + h > 1
				py = 1 - h
			@_cropRect[0] = px
			@_cropRect[1] = py
			@_cropRect[2] = w
			@_cropRect[3] = h

			@_redrawArea()

		_cornerMouseUp:(e)=>
			@_removeEventListeners()
		_areaDown:(e)=>
			pos = MouseUtils.getMousePos(e)
			@_initPos = pos
			bounds = @_preview.getBounds()
			bw = bounds.right - bounds.left
			bh = bounds.bottom - bounds.top
			@_localPos = [(pos[0]) / bw - @_cropRect[0], (pos[1]) / bh - @_cropRect[1]]
			target = e.currentTarget
			e.preventDefault()
			e.stopImmediatePropagation()
			@_addAreaEventListeners()
		_areaMouseMove:(e)=>
			pos = MouseUtils.getMousePos(e)
			bounds = @_preview.getBounds()
			bw = bounds.right - bounds.left
			bh = bounds.bottom - bounds.top
			px = ((pos[0]) / bw) - @_localPos[0]
			py = ((pos[1]) / bh) - @_localPos[1]

			if px < 0
				px = 0
			if px + @_cropRect[2] > 1
				px = 1 - @_cropRect[2]
			if py < 0
				py = 0
			if py + @_cropRect[3] > 1
				py = 1 - @_cropRect[3]

			@_cropRect[0] = px
			@_cropRect[1] = py
			@_redrawArea()

		_areaMouseUp:(e)=>
			@_removeEventListeners()
	class Size extends BaseDOM
		constructor:(target)->
			super({'element': 'div', 'className': 'size'})
			@_selected = false
			@_data = {}
			@_default = false
			@_parseData(target)
			@_buildInputs()

			@_label = new BaseDOM({'element': 'label'})
			@_label.html = @_data['name'] + ' (' + @_data['width'] + 'x' + @_data['height'] + ')'
			@appendChild(@_label)

			@_container = new BaseDOM({'className': 'thumb-container'})
			@_thumbMask = new BaseDOM({'className': 'thumb-mask'})
			@_thumb = new BaseDOM({'className': 'thumb'})
			@_thumbMask.appendChild(@_thumb)
			@_container.appendChild(@_thumbMask)
			@appendChild(@_container)

			@element.on('click', @_click)
			setTimeout(@_loadThumb, 0)


		@get data:()->
			return @_data

		@get cropSet:()->
			return @_data['cropSet']
		@get default:()->
			return @_default
		@set default:(value)->
			@_default = value

		@get selected:()->
			return @_selected
		@set selected:(value)->
			value = Boolean(value)
			if value != @_selected
				@_selected = value
				@toggleClass('selected', @_selected)

		_buildInputs:()->
			@_input = document.createElement('data')
			@_input.name = 'size'
			@_input.setAttribute('type', 'input')
			@_input.style.display = 'none'
			@_input.value = @_data

			@appendChild(@_input)


		_parseData:(target)->
			name = target.getAttribute('name') || ''
			w = Number(target.getAttribute('width') || 100)
			h = Number(target.getAttribute('height') || 100)
			aspectRatio = w / h
			src = target.getAttribute('src') || null
			raw = target.getAttribute('raw') || null
			crop = (target.getAttribute('crop') || '0,0,1,1').split(',')
			for k, v of crop
				crop[k] = Number(v)
			if target.hasAttribute('cropSet')
				value = target.getAttribute('cropSet')
				if value == 1 || value.toString?().toLowerCase() == 'true'
					cropSet = true
				else
					cropSet = false
			else
				cropSet = false
			if src
				cropSet = true
			optional = false
			if target.hasAttribute('optional')
				value = target.getAttribute('optional')
				if !(value == 0 || value.toString?().toLowerCase() == 'false')
					@addClass('required')
					optional = true
			@_data['optional'] = optional
			@_data['name'] = name
			@_data['width'] = w
			@_data['height'] = h
			@_data['id'] = raw
			@_data['aspectRatio'] = aspectRatio
			@_data['src'] = src
			@_data['crop'] = crop
			@_data['cropSet'] = cropSet

		_click:()=>
			@trigger('click')

		_loadThumb:()=>
			if @_data['src']
				@_load(@_data['src'])

		_load:(src)->
			if !@_image
				@_image = new Image()
				@_image.onload = @_imageLoaded
				@_thumb.appendChild(@_image)
			@_image.src = src

		_imageLoaded:()=>
			@_image.style['width'] = ''
			@_image.style['height'] = ''
			@_imageWidth = @_image.naturalWidth || @_image.width
			@_imageHeight = @_image.naturalHeight || @_image.height
			@_redraw()

		updateCrop:(crop, direct = false)->
			if direct
				if @_data['crop'][0] != crop[0] || @_data['crop'][1] != crop[1] || @_data['crop'][2] != crop[2] || @_data['crop'][3] != crop[3]
					@_data['cropSet'] = true
			@_data['crop'] = [].concat(crop)
			@_redraw()
			@_input.value = @_data

		updateSrc:(src, id = null)->
			@_data['src'] = src
			@_data['id'] = id
			@_load(src)
			@_input.value = @_data
		resize:()->
			@_container.css({
				'width': ''
				'height': ''
			})
			@_thumbMask.css({
				'width': '0'
				'height': '0'
			})
			@_thumb.css({
				'width': '0'
				'height': '0'
			})
			bounds = @getBounds()
			w = bounds.width
			h = w * 0.75

			@_container.css({
				width: w + 'px'
				height: h + 'px'
			})
			@_redraw()

		_redraw:()->
			bounds = @getBounds()
			w = bounds.width
			h = bounds.height
			cx = @_data['crop'][0]
			cy = @_data['crop'][1]
			cw = @_data['crop'][2]
			ch = @_data['crop'][3]
			if @_imageWidth && @_imageHeight
				iw = @_imageWidth
				ih = @_imageHeight

				cix = iw * cx
				ciy = ih * cy
				ciw = iw * cw
				cih = ih * ch

				s = w / h
				ss = ciw / cih
				if s > ss
					s = h / cih
				else
					s = w / ciw

				cix *= s
				ciy *= s
				ciw *= s
				cih *= s

				@_thumbMask.css({
					'width': ciw + 'px'
					'height': cih + 'px'
				})

				ciw /= cw
				cih /= ch
				cix = ciw * cx
				ciy = cih * cy

				@_image.style['left'] = -cix + 'px'
				@_image.style['top'] = -ciy + 'px'
				@_image.style['width'] = ciw + 'px'
				@_image.style['height'] = cih + 'px'
