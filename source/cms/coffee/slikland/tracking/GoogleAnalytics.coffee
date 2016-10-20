class GoogleAnalytics

	constructor:(p_id)->
		`(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		})(window,document,'script','//www.google-analytics.com/analytics.js','ga');`

		ga('create', p_id, 'auto')

	# Track
	#
	# event {String} to event (event | pageview)
	# category {String} to category
	# action {String} to action
	# label {String} to label
	# value {Number} to value
	track:(p_event, p_category, p_action, p_label, p_value)->
		ga('send', p_event, p_category, p_action, p_label, p_value)

	# Track event
	#
	# category {String} to category
	# action {String} to action
	# label {String} to label
	# value {Number} to value
	event:(p_args...)=>
		args = ['event'].concat(p_args)
		@track.apply(@, args)

	# Track pageview
	#
	# category {String} to category
	# action {String} to action
	# label {String} to label
	# value {Number} to value
	pageview:(p_args...)->
		# console.log("TRACKING: PAGEVIEW", p_args)
		args = ['pageview'].concat(p_args)
		@track.apply(@, args)
