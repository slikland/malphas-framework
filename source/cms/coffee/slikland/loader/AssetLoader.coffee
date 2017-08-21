#import slikland.core.loader.PreloadFiles
#import slikland.vendors.preloaderjs.CacheControllerPlugin
#import slikland.vendors.preloaderjs.MediaPlugin

class AssetLoader extends EventDispatcher

	@INITIALIZE: "initialize"

	@COMPLETE_ALL: "complete"
	@COMPLETE_FILE: "fileload"

	@PROGRESS_ALL: "progress"
	@PROGRESS_FILE: "fileprogress"

	@START_ALL: "loadstart"
	@START_FILE: "filestart"

	@ERROR: "error"
	@FILE_ERROR: "fileerror"

	@getInstance:()=>
		@_instance ?= new @(arguments...)

	_groups:null

	constructor:()->
		@_groups = {}

	loadGroup:(p_groupId, p_files)->
		group = @getGroup(p_groupId)
		group.loadManifest(p_files)
		return group

	getGroup:(p_groupId, p_concurrent=3, p_xhr=true)->
		group = @_groups[p_groupId]
		if !group
			group = new createjs.LoadQueue(p_xhr)
			group.installPlugin(createjs.CacheControllerPlugin)
			group.installPlugin(createjs.MediaPlugin)
			group.id = p_groupId
			@_groups[p_groupId] = group
			group.on(AssetLoader.COMPLETE_FILE, @_fileLoad)
			group.on(AssetLoader.ERROR, @_onError)
			group.on(AssetLoader.FILE_ERROR, @_onFileError)
		group.setMaxConnections(p_concurrent)
		return group

	preferXHR:(p_groupId, p_value=true)->
		group = @getGroup(p_groupId).setPreferXHR = p_value
		return group

	_onError:(e)=>
		e.currentTarget.off(AssetLoader.ERROR, @_onError)
		e.currentTarget.off(AssetLoader.COMPLETE_FILE, @_fileLoad)
		console.log e
		throw new Error(e.title).stack
		false

	_onFileError:(e)=>
		e.currentTarget.off(AssetLoader.FILE_ERROR, @_onFileError)
		e.currentTarget.off(AssetLoader.COMPLETE_FILE, @_fileLoad)
		console.log e
		throw new Error(e.title).stack
		false

	_fileLoad:(e)=>
		e.currentTarget.off(AssetLoader.COMPLETE_FILE, @_fileLoad)
		e.currentTarget.off(AssetLoader.ERROR, @_onError)
		e.currentTarget.off(AssetLoader.FILE_ERROR, @_onFileError)
		e.item.tag = e.result
		false

	getItem:(p_id, p_groupId=null)->
		if p_groupId
			return @_groups[p_groupId]?.getItem(p_id)
		
		for k, v of @_groups
			if i = v.getItem(p_id)
				return i

	getResult:(p_id, p_groupId=null)->
		result = null
		if p_groupId
			result = @_groups[p_groupId]?.getResult(p_id)
		
		for k, v of @_groups
			if i = v.getResult(p_id)
				result = i
		return result

	@addFiles:(p_files, p_queue)->
		jsRE = /.*\.(js|css|svg)$/g
		mp4RE = /.*\.(mp4)$/g
		for f in p_files
			obj = {
				id:''
				src:''
			}
			
			jsRE.lastIndex = 0
			obj.id = f.id || 'item'
			obj.src = f.src
			
			# 
			# When it's a video please set 'false' on the xhr param to get progress and load file
			#
			
			if mp4RE.test(obj.src)
				obj['type'] = 'video'

			if f.src && jsRE.test(f.src)
				obj['type'] = 'text'

			if obj.src
				p_queue.loadFile(obj, false)

		if p_files.length > 0
			p_queue.load()
		false
