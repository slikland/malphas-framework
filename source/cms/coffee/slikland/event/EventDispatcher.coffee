###*
EventDispatcher class for handling and triggering events.
@class EventDispatcher
###
if !EventDispatcher
	class EventDispatcher

		# Collection of {Event}
		_events:null

		###*
		Add a event listener.
		@method on
		@param {String} event Event name.
		@param {function} handler A callback function to handle the event.<br>
		The callback function can receive 1 or 2 parameters. The first parameter is the event data itself and the second parameter is the custom data of the triggering event.

		@example
			function someEventHandler(e, data)
			{
				console.log(e); // Returns event data with it's type and target/currentTarget set to the scope
				console.log(data); // If the triggering event has any custom data
			}
			var ed = new EventDispatcher()
			ed.on('someEvent', someEventHandler);
		###
		on:(p_event, p_handler, useCapture = false)->
			if !@_events then @_events = {}
			if !@_events[p_event] then @_events[p_event] = []
			if !(p_handler in @_events[p_event])
				if useCapture
					@_events[p_event].push(p_handler)
				else
					@_events[p_event].unshift(p_handler)

		###*
		Remove an event listener.

		**BEWARE**

		> Calling this method without a handler will remove all listeners attached to this event.

		> If calling without the event name, will remove all listeners attached to this instance.

		@method off
		@param {String} [event=null] Event name.
		@param {function} [handler=null]
		A callback function added in the {{#crossLink "EventDispatcher/on:method"}}{{/crossLink}} call.
		###
		off:(p_event=null, p_handler=null)->
			if !@_events
				@_events = {}
				return
			if p_event? && Boolean(@_events[p_event])
				events = @_events[p_event]
				if !p_handler
					@_events[p_event].length = 0
				else
					while (i = events.indexOf(p_handler)) >= 0
						events.splice(i, 1)
					@_events[p_event] = events
			else
				@_events = {}

		###*
		Triggers an event.
		@method trigger
		@param {String} event Event name.
		@param {object} [data=null] Custom event data.
		@param {object} [target=null] Target that will be specified in the `event.target`. The `event.currentTarget` will always be this instance.

		@example
			var ed = new EventDispatcher()

			// Will just trigger the event
			ed.trigger('someEvent'); 

			// Will trigger the event with the object which can be retrieved by the second
			// parameter of the handler function.
			ed.trigger('someEvent', {someData: true}); 

			// Will set the event target to window. On the handler's first parameter
			//`event.target` will be window, and event.currentTarget will be the `ev` instance.
			ed.trigger('someEvent', {someData: true}, window);
		###
		trigger:(evt, data = null, target = null, sourceEvent = null)=>
			if Array.isArray(evt)
				for e in evt
					@trigger(evt, data)
				return
			if !@_events
				@_events = {}
			events = @_events[evt]
			if !events || events.length == 0
				return
			if !target
				target = @
			e = {type: evt, target: target, currentTarget: @, originalEvent: sourceEvent}
			if sourceEvent?
				e.preventDefault = ()->
					sourceEvent.preventDefault?()
				e.stopPropagation = ()->
					sourceEvent.stopPropagation?()
			if typeof(data) == 'object'
				for k, v of data
					if !e[k]
						e[k] = v
			i = events.length
			while i-- > 0
				events[i]?(e, data)

		###*
		Check if a event handler is already set.
		@method hasEvent
		@param {String} event Event name.
		@param {function} [handler=null] A callback function added in the {{#crossLink "EventDispatcher/on:method"}}{{/crossLink}} call.
		@return {Boolean}
		###
		hasEvent:(p_event, p_handler)->
			if !@_events
				@_events = {}
				return

			for event of @_events
				if event is p_event
					if @_events[event].indexOf(p_handler) > -1
						return true
			return false

		###*
		Triggers an event after the current code block has finished processing.

		This is useful for stacking up events that needs to be triggered at the end of the function but it's validating beforehand.
		@method stackTrigger
		@param {String} event Event name.
		@param {object} [data=null] Custom event data.
		@param {object} [target=null] Target that will be specified in the `event.target`. The `event.currentTarget` will always be this instance.

		@example
			var ed = new EventDispatcher()

			var someObject = {a: true, b: false, c: true};

			ed.on('isA', function(){console.log('Is A!');});
			ed.on('isB', function(){console.log('Is B!');});
			ed.on('isC', function(){console.log('Is C!');});

			function test()
			{
				console.log("Init test()");
				if(someObject.a) ed.stackTrigger('isA');
				if(someObject.b) ed.stackTrigger('isB');
				if(someObject.c) ed.stackTrigger('isC');
				console.log("End test()");
			}

			// This will result in:
			// log: 'Init test()'
			// log: 'End test()'
			// log: 'isA'
			// log: 'isC'

		###
		stackTrigger:(evt, data = null, target = null)->
			if !@_stackTriggerer
				@_stackTriggerer = []
			@_stackTriggerer.push([evt, data, target])

			clearTimeout(@_stackTriggerTimeout)
			@_stackTriggerTimeout = setTimeout(@_triggerStacked, 0)
		
		_triggerStacked:()=>
			l = @_stackTriggerer.length
			i = -1
			while ++i < l
				@trigger.apply(@, @_stackTriggerer[i])

			@_stackTriggerer.length = 0
		
