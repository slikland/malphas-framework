#import slikland.loader.PreloadFiles

class AssetLoader extends EventDispatcher

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
			group.id = p_groupId
			@_groups[p_groupId] = group
			group.on('fileload', @_fileLoad)
			group.on('error', @_onError)
			group.on('fileerror', @_onError)
		group.setMaxConnections(p_concurrent)
		return group

	preferXHR:(p_groupId, p_value=true)->
		group = @getGroup(p_groupId).setPreferXHR = p_value
		return group

	_onError:(e)=>
		e.currentTarget.off('error', @_onError)
		e.currentTarget.off('fileerror', @_onError)

		switch e.type
			when 'fileerror'
				break
			
			when 'error'
				break
		console.log e.title, e.data
		

	_fileLoad:(e)=>
		e.target.off('fileload', @_fileLoad)
		e.item.tag = e.result

	getItem:(p_id, p_groupId=null)->
		if p_groupId
			return @_groups[p_groupId]?.getItem(p_id)
		
		for k, v of @_groups
			if i = v.getItem(p_id)
				return i

	getResult:(p_id, p_groupId=null)->
		if p_groupId
			return @_groups[p_groupId]?.getResult(p_id)
		
		for k, v of @_groups
			if i = v.getResult(p_id)
				return i

	@addFiles:(p_files, queue)->
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
			# WHEN IT'S A VIDEO PLEASE SET 'TRUE' ON THE XHR PARAM TO GET PROGRESS AND LOAD FILE
			#
			
			if mp4RE.test(obj.src)
				obj['type'] = 'video'
				# continue

			if f.src && jsRE.test(f.src)
				obj['type'] = 'text'

			if obj.src
				queue.loadFile(obj, false)

		if p_files.length > 0
			queue.load()
