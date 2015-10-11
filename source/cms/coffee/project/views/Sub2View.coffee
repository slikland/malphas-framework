class Sub2View extends BaseView

	createStart:(evt=null)=>
		# console.log @id, 'createStart'
		super

	create:(evt=null)=>
		color = Math.floor(Math.random()*16777215).toString(16)
		
		@test = new BaseDOM('div')
		@appendChild(@test)
		@test.text = "SUB 2"
		@test.css({
			'width':'100px',
			'height':'100px',
			'position':'absolute',
			'background-color': '#'+color
		})

		# console.log @id, 'create'
		super

	createComplete:(evt=null)=>
		TweenMax.set(@test.element,{
			opacity: 0
		})

		# console.log @id, 'createComplete'
		super

	showStart:(evt=null)=>
		# console.log @id, 'showStart'
		super

	show:(evt=null)=>
		TweenMax.to(@test.element, .3, {
			opacity: 1, 
			ease: Quad.easeOut, 
			onComplete: =>
				super
		})
		# console.log @id, 'show'
		# super

	showComplete:(evt=null)=>
		# console.log @id, 'showComplete'
		super

	hideStart:(evt=null)=>
		# console.log @id, 'hideStart'
		super

	hide:(evt=null)=>
		if @test?
			TweenMax.to(@test.element, .3, {
				opacity: 0, 
				ease: Quad.easeOut, 
				onComplete: =>
					# console.log @id, 'hide'
					super
			})
		# super

	hideComplete:(evt=null)=>
		# console.log @id, 'hideComplete'
		super

	changeSubview:(evt=null)=>
		# console.log @id, 'changeSubview'
		super

	destroy:(evt=null)=>
		@element.off()
		if @test 
			TweenMax.killTweensOf(@test)
			@test.destroy()
			@removeChild(@test)
			@test = null
		
		# console.log @id, 'destroy'
		super

	destroyComplete:(evt=null)=>
		# console.log @id, 'destroyComplete'
		super
