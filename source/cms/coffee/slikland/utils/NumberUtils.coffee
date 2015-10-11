# Public: Bunch of utilities methods for {Number}
class NumberUtils

	# Public: Checks whether the {Number} is an even number.
	#
	# value - The {Number} to check.
	#
	# Returns
	#    The resulting {Boolean} object.
	@isEven:(p_value)->
		return if p_value%2==0 then true else false

	# Public: Checks whether the {Number} is zero.
	#
	# value - The {Number} to check.
	#
	# Returns
	#    The resulting {Boolean} object.
	@isZero:(p_value)->
		return Math.abs(p_value) < 0.00001

	# Public: Returns the value in percent of a {Number}.
	#
	# value - The {Number} to check.
	# min - The {Number} of lower limit.
	# max - The {Number} of higher limit.
	#
	# Returns
	#    The resulting {Number} object.
	@toPercent:(p_value, p_min, p_max)->
		return ((p_value - p_min) / (p_max - p_min)) * 100

	# Public: Returns the value in Number of a {percent}.
	#
	# percent - The {Number} in percent to check.
	# min - The {Number} of lower limit.
	# max - The {Number} of higher limit.
	#
	# Returns
	#    The resulting {Number} object.
	@percentToValue:(p_percent, p_min, p_max)->
		return ((p_max - p_min) * p_percent) + p_min

	# Public: Returns bytes to formatted MB's string.
	#
	# bytes - {Number} in bytes
	#
	# Returns
	#    {String} in MB's
	@getBytesAsMegabytes:(p_bytes)->
		return (Math.floor(((p_bytes / 1024 / 1024) * 100)) / 100)+" MB"

	# Public: Returns bytes to formatted byte, KB's, MB's or GB's string.
	#
	# bytes - {Number} in bytes
	#
	# Returns
	#    {String} in byte, KB's, MB's or GB's
	@bytesTo:(p_bytes)->
		if      p_bytes >= 1000000000 then return (p_bytes/1000000000).toFixed(2)+' GB'
		else if p_bytes >= 1000000    then return (p_bytes/1000000).toFixed(2)+' MB'
		else if p_bytes >= 1000       then return (p_bytes/1000).toFixed(2)+' KB'
		else if p_bytes > 1           then return p_bytes+' bytes'
		else if p_bytes == 1          then return p_bytes+' byte'
		else                          return '0 byte'

	# Public: Generates a random number between two numbers.
	#
	# low - The {Number} of lower limit.
	# high - The {Number} of higher limit.
	# rounded - the {Boolean} that defines if the random number will be rounded or not.
	#
	# Returns
	#    The resulting {Number} object.
	@rangeRandom:(p_low, p_high, p_rounded=false)->
		return if !p_rounded then (Math.random() * (p_high - p_low)) + p_low else Math.round(Math.round(Math.random() * (p_high - p_low)) + p_low)

	# Public: Getting the distance between two geographical points.
	#
	# from - From coordinates {Points}.
	# high - To coordinates {Points}.
	# units - Mean radius of Earth in {String} (km, meters, feet and miles).
	#
	# Returns
	#    The resulting the coordinates {Number}.
	@distanceBetweenCoordinates:(p_from, p_to, p_units = "km")->
		radius
		switch p_units
			when "km"
				radius = 6371
			when "meters"
				radius = 6378000
			when "feet"
				radius = 20925525
			when "miles"
				radius = 3963

		dLatitude  = (p_to.x - p_from.x) * Math.PI / 180
		dLongitude  = (p_to.y - p_from.y) * Math.PI / 180

		a  = Math.sin(dLatitude / 2) * Math.sin(dLatitude / 2) + Math.sin(dLongitude / 2) * Math.sin(dLongitude / 2) * Math.cos(p_from.x * Math.PI / 180) * Math.cos(p_to.x * Math.PI / 180)
		c  = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

		return radius * c
