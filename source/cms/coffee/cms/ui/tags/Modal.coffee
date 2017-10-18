#namespace cms.ui.tags
#import slikland.utils.MouseUtils
class Modal extends cms.ui.Base
	@SELECTOR: 'modal'
	@show:(reference, data = {})->
		if reference
			@_loadTemplate(reference, data)
	@_loadTemplate:(ref, data = {})->
		block = app.template.templates.get(ref, (block)=>
			@_referenceLoaded(block, data)
		)
	@_referenceLoaded:(block, data = {})=>
		items = block.render(data, document.body)
		# document.body.appendChild(items[0][1])

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

		constructor:()->
			super
			@_element.on('showModal', @_showModal)
			@_element.on('commit', @_commit)
			@_element.on('cancel', @_cancel)
			@_element.on('mousedown', @_mouseDown)
		destroy:()->
			@_element.off('showModal', @_showModal)
			@_element.off('commit', @_commit)
			@_element.off('cancel', @_cancel)
			@_element.off('mousedown', @_mouseDown)
			super
		_mouseDown:(e)=>
			if e.target == e.currentTarget && e.currentTarget == @_element
				if !@attr('close') || (@attr('close') && (@attr('close') == 1 || @attr('close') == 'true'))
					@_cancel()
		_getData:()->
			forms = @findAll('form')
			data = {}
			for form in forms
				itemData = API.parseJSON(form)
				data = ObjectUtils.merge(data, itemData)
			return data

		_showModal:(e)=>
			data = @_getData()
			ref = e.data
			if /^\>/.test(ref)
				ref = app.template.currentFile + ref
			cms.ui.tags.Modal.show(ref, data)
			@close()
		# _loadTemplate:(ref)->
		# 	app.template.templates.get(ref, @_referenceLoaded)
		# _referenceLoaded:(block)=>
		# 	items = block.render(@_showData, @)
		_commit:(e)=>
			data = @_getData()
			console.log("COMMIT!", @attr('update'))
			if e.data
				try
					data = ObjectUtils.merge(data, e.data)
			console.log(@attr('commit'))
			if @attr('commit')
				targets = document.querySelectorAll(@attr('commit'))
				console.log(targets)
				for target in targets
					app.template.renderBlock(target, data)
			if @attr('update')
				targets = document.querySelectorAll(@attr('update'))
				console.log("UPDATE targets", targets)
				for target in targets
					target.trigger('update', data)
			@close()
		_cancel:()=>
			@close()

		show:()->

		hide:()->

		close:()->
			@element.parentNode.removeChild(@element)
			@destroy()