class KTween
	@tweenTypes = {}
	@numValues = 100
	@inited = false
	@items = []
	@queued = []
	@numQueued = 0
	@numItems = 0
	@index = 0
	@div = 1 / 0xFFFFFF
	@init:(@timeout = 1000 / 60)->
		if @inited then return
		@initTime = new Date().getTime()
		setInterval @update, @timeout
		@inited = true
	@update:()=>
		t = new Date().getTime() - @initTime
		l = @numQueued
		while l-- > 0
			if @queued[l].initTime <= t
				@numQueued--
				@numItems++
				@queued[l].init()
				@items.push(@queued.splice(l, 1)[0])
		l = @numItems
		while l-- > 0
			comp = false
			ko = @items[l]
			continue if !ko
			tar = ko.target
			tim = (t - (ko.initTime)) * ko.iDuration
			if tim < 0 then tim = 0
			if tim > 1 then tim = 1
			values = @tweenTypes[ko.transition][0]
			diffs = @tweenTypes[ko.transition][1]
			p = tim * @numValues
			ap = p >> 0
			p = (values[ap] + diffs[ap] * (p - ap)) * @div
			lj = ko.numParams
			params = ko.params
			distances = ko.distances
			initValues = ko.initValues
			while lj-- > 0
				tar[params[lj]] = distances[lj] * p + initValues[lj]
			if ko.onUpdate
				params = ko.onUpdateParams
				ko.onUpdate.apply(ko.target, params)
			if tim == 1
				@numItems--
				@items.splice(l, 1)
				if ko.onComplete and ko.onComplete != undefined
					params = ko.onCompleteParams
					if !params
						params = []
					ko.onComplete.apply(ko.target, params)
	@tween:(target, params, transition = "linear", time = 0, delay = 0)->
		if !@inited then @init()
		if !@tweenTypes[transition] then @populateEasing(transition)
		t = ((new Date().getTime() - @initTime) + delay * 1000) >> 0
		ko = new KTObject(@index++, target, t, (time * 1000) >> 0, params, transition)
		if delay == 0
			ko.init()
			@numItems++
			@items.push(ko)
		else
			@numQueued++
			@queued.push(ko)
	@populateEasing:(transition)->
		if (f = KTween[transition])
			values = []
			diffs = []
			l = @numValues
			for i in [0...l]
				p = values[i] = ((f(i, 0, 0xFFFFFF, l) + 0.5) >> 0)
				if i > 0 then diffs[i- 1] = p - lp
				lp = p
			values[l] = 0xFFFFFF
			values[l + 1] = 0
			diffs[l - 1] = 0xFFFFFF - lp
			diffs[l] = 0
			@tweenTypes[transition] = [values, diffs]
	@tweenSequence:(target, onComplete, sequence, onCompleteParams = null)->
		if !target then return
		if !sequence then return
		if sequence.length == 0
			if onComplete then onComplete.apply(target, onCompleteParams)
			return
		o = sequence.shift()
		tr = 'linear'
		if o['transition'] then tr = o['transition']
		t = 0
		if o['time'] then t = o['time']
		d = 0
		if o['delay'] then d = o['delay']
		@tween(target, o, tr, t, d, tweenSequence, [target, onComplete, sequence, onCompleteParams])
	@remove:(target, parameter = null)->
		l = @numQueued
		while l-- > 0
			q = @queued[l]
			if q.target == target
				if q.remove(parameter)
					@numQueued--
					@queued.splice(l, 1)
		l = @numItems
		while l-- > 0
			q = @items[l]
			if q.target == target
				if q.remove(parameter)
					@numItems--
					@items.splice(l, 1)
	@getByTime:(type, time, duration)->
		values = @tweenTypes[type]
		p = (time / duration) * @numValues
		ap = p >> 0
		p1 = values[ap]
		p2 = values[ap + 1]
		return (p2 - p1) * (p - ap) + p1
	@getByPosition:(type, position)->
		if !@inited then @init()
		if !@tweenTypes[type] then @populateEasing(type)
		values = @tweenTypes[type][0]
		diffs = @tweenTypes[type][1]
		position *= @numValues
		ap = position >> 0
		return (values[ap] + diffs[ap] * (position - ap)) * @div
	
	##--------------------------------------
	##	Rober Penner easing functions
	##--------------------------------------
	@linear:(t, b, c, d, p_params = null)->
		return c * t / d + b

	@easeInQuad:(t, b, c, d, p_params = null)->
		return c * (t /= d) * t + b

	@easeOutQuad:(t, b, c, d, p_params = null)->
		return -c * (t /= d) * (t - 2) + b

	@easeInOutQuad:(t, b, c, d, p_params = null)->
		if ((t /= d / 2) < 1) then return c / 2 * t * t + b
		return -c / 2 * ((--t) * (t - 2) - 1) + b

	@easeOutInQuad:(t, b, c, d, p_params = null)->
		if (t < d / 2) then return @easeOutQuad(t * 2, b, c / 2, d, p_params)
		return @easeInQuad((t * 2) - d, b + c / 2, c / 2, d, p_params)

	@easeInCubic:(t, b, c, d, p_params = null)->
		return c * (t /= d) * t * t + b

	@easeOutCubic:(t, b, c, d, p_params = null)->
		return c * ((t = t / d - 1) * t * t + 1) + b

	@easeInOutCubic:(t, b, c, d, p_params = null)->
		if ((t /= d / 2) < 1) then return c / 2 * t * t * t + b
		return c / 2 * ((t -= 2) * t * t + 2) + b

	@easeOutInCubic:(t, b, c, d, p_params = null)->
		if (t < d / 2) then return @easeOutCubic(t * 2, b, c / 2, d, p_params)
		return @easeInCubic((t * 2) - d, b + c / 2, c / 2, d, p_params)

	@easeInQuart:(t, b, c, d, p_params = null)->
		return c * (t /= d) * t * t * t + b

	@easeOutQuart:(t, b, c, d, p_params = null)->
		return -c * ((t = t / d - 1) * t * t * t - 1) + b

	@easeInOutQuart:(t, b, c, d, p_params = null)->
		if ((t /= d / 2) < 1) then return c / 2 * t * t * t * t + b
		return -c / 2 * ((t -= 2) * t * t * t - 2) + b

	@easeOutInQuart:(t, b, c, d, p_params = null)->
		if (t < d / 2) then return @easeOutQuart(t * 2, b, c / 2, d, p_params)
		return @easeInQuart((t * 2) - d, b + c / 2, c / 2, d, p_params)

	@easeInQuint:(t, b, c, d, p_params = null)->
		return c * (t /= d) * t * t * t * t + b

	@easeOutQuint:(t, b, c, d, p_params = null)->
		return c * ((t = t / d - 1) * t * t * t * t + 1) + b

	@easeInOutQuint:(t, b, c, d, p_params = null)->
		if ((t /= d / 2) < 1) then return c / 2 * t * t * t * t * t + b
		return c / 2 * ((t -= 2) * t * t * t * t + 2) + b

	@easeOutInQuint:(t, b, c, d, p_params = null)->
		if (t < d / 2) then return @easeOutQuint(t * 2, b, c / 2, d, p_params)
		return @easeInQuint((t * 2) - d, b + c / 2, c / 2, d, p_params)

	@easeInSine:(t, b, c, d, p_params = null)->
		return -c * Math.cos(t / d * (Math.PI / 2)) + c + b

	@easeOutSine:(t, b, c, d, p_params = null)->
		return c * Math.sin(t / d * (Math.PI / 2)) + b

	@easeInOutSine:(t, b, c, d, p_params = null)->
		return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b

	@easeOutInSine:(t, b, c, d, p_params = null)->
		if (t < d / 2) then return @easeOutSine(t * 2, b, c / 2, d, p_params)
		return @easeInSine((t * 2) - d, b + c / 2, c / 2, d, p_params)

	@easeInExpo:(t, b, c, d, p_params = null)->
		if t == 0 then return b
		return c * Math.pow(2, 10 * (t / d - 1)) + b - c * 0.001

	@easeOutExpo:(t, b, c, d, p_params = null)->
		if t == d then return b + c
		return c * 1.001 * (-Math.pow(2, -10 * t / d) + 1) + b

	@easeInOutExpo:(t, b, c, d, p_params = null)->
		if (t == 0) then return b
		if (t == d) then return b + c
		if ((t /= d / 2) < 1) then return c / 2 * Math.pow(2, 10 * (t - 1)) + b - c * 0.0005
		return c / 2 * 1.0005 * (-Math.pow(2, -10 * --t) + 2) + b

	@easeOutInExpo:(t, b, c, d, p_params = null)->
		if (t < d / 2) then return @easeOutExpo(t * 2, b, c / 2, d, p_params)
		return @easeInExpo((t * 2) - d, b + c / 2, c / 2, d, p_params)

	@easeInCirc:(t, b, c, d, p_params = null)->
		return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b

	@easeOutCirc:(t, b, c, d, p_params = null)->
		return c * Math.sqrt(1 - (t = t / d - 1) * t) + b

	@easeInOutCirc:(t, b, c, d, p_params = null)->
		if ((t /= d / 2) < 1) then return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b
		return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b

	@easeOutInCirc:(t, b, c, d, p_params = null)->
		if (t < d / 2) then return @easeOutCirc(t * 2, b, c / 2, d, p_params)
		return @easeInCirc((t * 2) - d, b + c / 2, c / 2, d, p_params)
		
	@easeInBack: (time,begin,change,duration,overshoot=1.70158) ->
		change*(time/=duration)*time*((overshoot+1)*time - overshoot) + begin;
		
	@easeOutBack: (time,begin,change,duration,overshoot=1.70158) ->
		change*((time=time/duration-1)*time*((overshoot+1)*time + overshoot) + 1) + begin
	
	@easeInOutBack: (time,begin,change,duration,overshoot=1.70158) ->
		if ((time = time/(duration/2)) < 1)
			return change/2*(time*time*(((overshoot*=(1.525))+1)*time - overshoot)) + begin
		else
			return change/2*((time-=2)*time*(((overshoot*=(1.525))+1)*time + overshoot) + 2) + begin

class KTObject
	constructor:(@id, @target, @initTime, @duration, params, @transition)->
		@iDuration = 1 / @duration
		@params = []
		@endValues = []
		@distances = []
		@initValues = []
		@numParams = 0
		@onComplete = params['onComplete']
		@onCompleteParams = params['onCompleteParams']
		@onUpdate = params['onUpdate']
		@onUpdateParams = params['onUpdateParams']
		@onInit = params['onInit']
		delete params['onComplete']
		delete params['onCompleteParams']
		delete params['onUpdate']
		delete params['onInit']
		for p of params
			if @target.hasOwnProperty(p) || @target[p]?
				@params.push(p)
				@endValues.push(Number(params[p]))
				@distances.push(0)
				@initValues.push(0)
				@numParams++
	remove:(parameter = null)->
		disp = true
		if parameter
			l = @numParams
			while l-- > 0
				if @params[l] == parameter
					@params.splice(l, 1)
					@endValues.splice(l, 1)
					@distances.splice(l, 1)
					@initValues.splice(l, 1)
					@numParams--
			disp = (numParams <= 0)
		if disp
			@dispose()
			return true
		return false
	dispose:()->
		@target = null
		@transition = null
		@onComplete = null
		@onCompleteParams = null
		@params = null
		@endValues = null
		@distances = null
		@initValues = null
		
		delete @target
		delete @transition
		delete @onComplete
		delete @onCompleteParams
		delete @params
		delete @endValues
		delete @distances
		delete @initValues
	init:()->
		if @onInit
			@onInit.apply(@target)
		l = @numParams
		while l-- >= 0
			p = @initValues[l] = Number(@target[@params[l]])
			@distances[l] = @endValues[l] - p

window.KTween = KTween