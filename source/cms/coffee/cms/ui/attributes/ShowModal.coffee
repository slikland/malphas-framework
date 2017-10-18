#namespace cms.ui.tag.attributes
class ShowModal extends cms.ui.Base
	@SELECTOR: '[showModal]'
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
			super({element: element})
			@_modalRef = @attr('showModal')
			if /^\>/.test(@_modalRef)
				@_modalRef = app.template.currentFile + @_modalRef
			setTimeout(@_addEventListener, 1)
		_addEventListener:(e)=>
			@_element.on('click', @_click, true)
		_click:(e)=>
			data = {}
			if @attr('modalData')
				target = @find(@attr('modalData'))
				if !target
					target = @findClosest(@attr('modalData'))
				if !target
					target = document.querySelector(@attr('modalData'))
				if target
					data = JSONUtils.fromHTML(target)
			cms.ui.tags.Modal.show(@_modalRef, data)
			e.preventDefault()
			e.stopImmediatePropagation()
