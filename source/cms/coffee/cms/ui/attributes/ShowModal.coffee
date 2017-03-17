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
			setTimeout(@_addEventListener, 1)
		_addEventListener:()=>
			@_element.on('click', @_click)
		_click:(e)=>
			console.log(@_modalRef)
			app.template.renderBlockByReference(@_modalRef, null, null, @_modalRendered)
			e.preventDefault()
			e.stopImmediatePropagation()

		_modalRendered:(items, block)=>
			@_target = items[0][1]
			buttons = @_target.querySelectorAll('button')
			for button in buttons
				button.on('click', @_buttonClick)

		_buttonClick:(e)=>
			e.preventDefault()
			e.stopImmediatePropagation()
			@_target.parentNode.removeChild(@_target)
