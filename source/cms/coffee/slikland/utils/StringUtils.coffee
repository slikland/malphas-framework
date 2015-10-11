#import slikland.utils.ArrayUtils

class StringUtils

	# Check in a search in the string and returns whether it contains the sentence.
	#
	# string - The {String} to validate.
	# search - The {String} to search in 'string'.
	#
	# Returns
	#    The resulting {Boolean} object.
	@hasString:(p_string, p_search)->
		return if p_string.split(p_search).length != 1 then true else false

	# A basic method of replace a sentence in a String.
	#
	# string - The {String} to search.
	# from - The {String} to search in 'string'.
	# to - The {String} to replace.
	#
	# Returns
	#    The resulting {String} object.
	@replace:(p_string, p_from, p_to)->
		return p_string.split(p_from).join(p_to)

	# A method to revert a content of a String.
	#
	# string - The {String} to revert.
	#
	# Returns
	#    The resulting {String} object.
	@reverse:(p_string)->
		if !p_string then return ""
		return p_string.split("").reverse().join("")

	# A method to convert the string to camel case
	#
	# string - The {String} to camellcase.
	#
	# Returns
	#    The resulting {String} object.
	@toCamelCase:(p_string) ->
		re = p_string.replace /([\+\-_ ][a-z])/g, ($1) ->
			$1.toUpperCase().replace /[\+\-_ ]/, ""
		return re.charAt(0).toUpperCase() + re.slice(1)

	# A method to remove the white spaces in a String.
	#
	# string - The {String} to remove the white spaces.
	#
	# Returns
	#    The resulting {String} object.
	@removeWhiteSpace:(p_string)->
		if !p_string then return ""
		return @trim(p_string).replace(/\s+/g, "")

	# A method to remove HTML tags in a {String}.
	#
	# string - The {String} to remove the HTML tags.
	#
	# Returns
	#    The resulting {String} object.
	@removeHTMLTag:(p_string)->
		return p_string.replace(/<.*?>/g, "")

	# A method to remove special characters in a String.
	#
	# string - The {String} to remove the special characters.
	#
	# Returns
	#    The resulting {String} object.
	@removeSpecialChars:(p_string)->
		return p_string.replace(/[^a-zA-Z 0-9]+/g,'')

	# A method to convert a numeric string to brazillian CPF format. (###.###.###-##)
	#
	# string - The {String} to format.
	# Returns
	#    The resulting {String} object.
	@convertToCPF:(p_string)->
		p_string = @removeSpecialChars(p_string)
		if p_string.length > 9
			p_string = p_string.replace(/(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})/,'$1' + "." + "$2" + "." + "$3" + "-" + "$4")
		else if p_string.length > 6
			p_string = p_string.replace(/(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})/,'$1' + "." + "$2" + "." + "$3")
		else if p_string.length > 3
			p_string = p_string.replace(/(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})/,'$1' + "." + "$2")
		else
			p_string = p_string.replace(/(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})/,'$1')
		return p_string

	# A method to convert a numeric string to brazillian CEP format. (######-###)
	#
	# string - The {String} to format.
	#
	# Returns
	#    The resulting {String} object.
	@convertToCEP:(p_string)->
		p_string = @removeSpecialChars(p_string)
		if p_string.length > 5
			p_string = p_string.replace(/(\d{0,5})(\d{0,3})/,'$1' + "-" + "$2")
		else
			p_string = p_string.replace(/(\d{0,5})(\d{0,3})/,'$1')
		return p_string

	# A method to convert a numeric string to date format. (##/##/####)
	#
	# string - The {String} to format.
	#
	# Returns
	#    The resulting {String} object.
	@convertToDate:(p_string)->
		p_string = @removeSpecialChars(p_string)
		if p_string.length > 4
			p_string = p_string.replace(/(\d{0,2})(\d{0,2})(\d{0,4})/,'$1' + "/" + "$2" + "/" + "$3")
		else if p_string.length > 2
			p_string = p_string.replace(/(\d{0,2})(\d{0,2})(\d{0,4})/,'$1' + "/" + "$2")
		else
			p_string = p_string.replace(/(\d{0,2})(\d{0,2})(\d{0,4})/,'$1')
		return p_string

	# A method to check if the String is empty or null.
	#
	# string -  The {String} to remove the white spaces.
	#
	# Returns
	#    The resulting {Boolean} object.
	@isEmpty:(p_string)->
		if !p_string or p_string is "" then return true
		return !p_string.length

	# A method to capitalize case the String.
	#
	# string - The {String} to capitalize case.
	#
	# Returns
	#    The resulting {String} object.
	@toCapitalizeCase:(p_string)->
		str = @trimLeft(p_string)
		return str.replace(/(^\w)/, @_upperCase)

	# A method to convert milisecounds (Number) in a String on time format.
	#
	# miliseconds - The {Number} in milisecounds.
	#
	# Returns
	#    The resulting {String} object.
	@toTimeFormat:(p_miliseconds, p_decimal=true)->
		minutes = Math.floor(p_miliseconds / 60)
		seconds = Math.floor(p_miliseconds % 60)
		return String( if p_decimal then @addDecimalZero(minutes) + ":" + @addDecimalZero(seconds) else  minutes + ":" + seconds)

	# A method to add a zero before if the p_value is smaller that 10 and bigger that -1.
	#
	# number - The {Number}.
	#
	# Returns
	#    The resulting {String} object.
	@addDecimalZero:(p_value)->
		if p_value < 10 then return ("0" + p_value)
		return String(p_value)

	# A method to abbreviate a String.
	#
	# string - The {String} of text to abbreviate.
	# max_length - The {Number} of length to text.
	# indicator - The {String} of the end String.
	# split - The {String} to before p_indicator and after text.
	#
	# Returns
	#    The resulting {String} object.
	@abbreviate:(p_string, p_max_length=50, p_indicator='...', p_split=' ')->
		if !p_string then return ""
		if p_string.length < p_max_length then return p_string

		result = ''
		n = 0
		pieces = p_string.split(p_split)
		charCount = pieces[n].length

		while charCount < p_max_length and n < pieces.length
			result += pieces[n] + p_split
			charCount += pieces[++n].length + p_split.length

		if n < pieces.length
			badChars=['-', '—', ',', '.', ' ', ':', '?', '!', '', "\n", ' ', String.fromCharCode(10), String.fromCharCode(13)]

			while badChars.indexOf(result.charAt(result.length - 1)) != -1
				result=result.slice(0, -1)

			result = @trim(result) + p_indicator

		if n is 0
			result = p_string.slice(0, p_max_length) + p_indicator

		return result

	# A method to convert a String to Boolean.
	# yes | true | 1 | no | false | 0
	#
	# string - The {String}.
	#
	# Returns
	#    The resulting {Boolean} object.
	@toBoolean:(p_string)->
		t  = ['yes', 'true', ' 1', 1, true]
		f = ['no',  'false', '0', 0, false]
		# p_string = p_string.toLowerCase()
		if ArrayUtils.hasItem(p_string, t)
			return true
		else if ArrayUtils.hasItem(p_string, f)
			return false
		else throw new Error("StringUtils::toBoolean '#{p_string}' is a wrong format")


	# Returns a random String with the specified length.
	#
	# length - The length of the random {String}.
	#
	# Returns
	#    The resulting {String}.
	@random:(p_length=10)->
		s = ""
		for i in [p_length..1]
			s += String.fromCharCode(65 + Math.floor(Math.random()*25))
		return s

	# Trim
	@trim:(p_str,p_char)->
		if p_str is null then return ""
		return @trimRight(@trimLeft(p_str,p_char),p_char)

	# Trim right
	@trimRight:(p_str, p_char)->
		if !p_str then return ""
		re = new RegExp(p_char + '*$')
		re.global = true
		re.multiline = true
		return p_str.replace(re, '')

	# Trim left
	@trimLeft:(p_str, p_char)->
		if !p_str then return ""
		re = new RegExp('^' + p_char + '*')
		re.global = true
		re.multiline = true
		return p_str.replace(re, '')

	# Replace special characters
	#
	# string - The {String}.
	#
	# Returns
	#    The resulting {String}.
	@replaceSpecialCharacters:(p_string)->
		if !@substitionDict then @_initDict()

		for char of @substitionDict
			console.log char
			pattern = new RegExp(char, "g")
			p_string = p_string.replace(pattern, @substitionDict[char])
		return p_string

	# Private: set string uppercase
	@_upperCase:(p_char, args...)->
		return p_char.toUpperCase()

	# Private: List of space character
	@substitionDict:null

	# Private: Create list of space character
	@_initDict:()->
		@substitionDict = []
		@substitionDict["ã"] = "a"
		@substitionDict["á"] = "a"
		@substitionDict["â"] = "a"
		@substitionDict["ä"] = "a"
		@substitionDict["à"] = "a"

		@substitionDict["é"] = "e"
		@substitionDict["ê"] = "e"
		@substitionDict["ë"] = "e"
		@substitionDict["è"] = "e"

		@substitionDict["í"] = "i"
		@substitionDict["î"] = "i"
		@substitionDict["ï"] = "i"
		@substitionDict["ì"] = "i"

		@substitionDict["õ"] = "o"
		@substitionDict["ó"] = "o"
		@substitionDict["ô"] = "o"
		@substitionDict["ö"] = "o"
		@substitionDict["ò"] = "o"

		@substitionDict["ú"] = "u"
		@substitionDict["û"] = "u"
		@substitionDict["ü"] = "u"
		@substitionDict["ù"] = "u"

		@substitionDict["ç"] = "c"

		@substitionDict["ñ"] = "n"

		for char of @substitionDict
			@substitionDict[char.toUpperCase()] = String(@substitionDict[char]).toUpperCase()
