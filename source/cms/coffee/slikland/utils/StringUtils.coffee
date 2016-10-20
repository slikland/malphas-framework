#import slikland.utils.ArrayUtils

###*
Bunch of utilities methods for String
@class StringUtils
@static
###

class StringUtils

	###*
	Check in a search in the string and returns whether it contains the sentence.
	@method hasString
	@static
	@param {String} p_string The variable to validate.
	@param {String} p_search The value to search in variable.
	@return {Boolean}
	###	
	@hasString:(p_string, p_search)->
		return if p_string.split(p_search).length != 1 then true else false

	###*
	A basic method of replace a sentence in a String.
	@method replace
	@static
	@param {String} p_string The variable to replace.
	@param {String} p_from - The string to search in variable.
	@param {String} p_to - The value to replace.
	@return {String}
	###	
	@replace:(p_string, p_from, p_to)->
		return p_string.split(p_from).join(p_to)

	
	###*
	A method to revert a content of a String.
	@method reverse
	@static
	@param {String} p_string The variable to reverse.
	@return {String}
	###	
	@reverse:(p_string)->
		if !p_string then return ""
		return p_string.split("").reverse().join("")

	
	###*
	A method to convert the string to camel case
	@method toCamelCase
	@static
	@param {String} p_string - The value to camellcase.
	@return {String}
	###	
	@toCamelCase:(p_string) ->
		re = p_string.replace /([\+\-_ ][a-z])/g, ($1) ->
			$1.toUpperCase().replace /[\+\-_ ]/, ""
		return re.charAt(0).toUpperCase() + re.slice(1)

	
	###*
	A method to remove the white spaces in a String.
	@method removeWhiteSpace
	@static
	@param {String} p_string - The value to remove the white spaces.
	@return {String}
	###	
	@removeWhiteSpace:(p_string)->
		if !p_string then return ""
		return @trim(p_string).replace(/\s+/g, "")

	###*
	A method to remove HTML tags in a String.
	@method removeHTMLTag
	@static
	@param {String} p_string - The value to remove the HTML tags.
	@return {String}
	###	
	@removeHTMLTag:(p_string)->
		return p_string.replace(/<.*?>/g, "")

	
	###*
	A method to remove special characters in a String.
	@method removeSpecialChars
	@static
	@param {String} p_string The value to remove the special characters.
	@return {String}
	###	
	@removeSpecialChars:(p_string)->
		return p_string.replace(/[^a-zA-Z 0-9]+/g,'')

	
	###*
	A method to convert a numeric string to brazillian CPF format. (XXX.XXX.XXX-XX)
	@method convertToCPF
	@static
	@param {String} p_string - The value to format.
	@return {String}
	###	
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

	###*
	A method to convert a numeric string to brazillian CEP format. (XXXXX-XXX)
	@method convertToCEP
	@static
	@param {String} p_string - The value to format.
	@return {String}
	###	
	@convertToCEP:(p_string)->
		p_string = @removeSpecialChars(p_string)
		if p_string.length > 5
			p_string = p_string.replace(/(\d{0,5})(\d{0,3})/,'$1' + "-" + "$2")
		else
			p_string = p_string.replace(/(\d{0,5})(\d{0,3})/,'$1')
		return p_string

	###*
	A method to convert a numeric string to date format. (XX/XX/XXXX)
	@method convertToDate
	@static
	@param {String} p_string - The value to format.
	@return {String}
	###	
	@convertToDate:(p_string)->
		p_string = @removeSpecialChars(p_string)
		if p_string.length > 4
			p_string = p_string.replace(/(\d{0,2})(\d{0,2})(\d{0,4})/,'$1' + "/" + "$2" + "/" + "$3")
		else if p_string.length > 2
			p_string = p_string.replace(/(\d{0,2})(\d{0,2})(\d{0,4})/,'$1' + "/" + "$2")
		else
			p_string = p_string.replace(/(\d{0,2})(\d{0,2})(\d{0,4})/,'$1')
		return p_string

	###*
	A method to check if the String is empty.
	@method isEmpty
	@static
	@param {String} p_string - The value to remove the white spaces.
	@return {Bollean}
	###
	@isEmpty:(p_string)->
		return if !p_string or p_string is "" then true else false

	###*
	A method to capitalize case the String
	@method toCapitalizeCase
	@static
	@param {String} p_string - The value to capitalize case.
	@return {String}
	###	
	@toCapitalizeCase:(p_string)->
		str = @trimLeft(p_string)
		return str.replace(/(^\w)/, @_upperCase)

	
	###*
	A method to convert milisecounds (Number) in a String on time format.
	@method toTimeFormat
	@static
	@param {Number} p_miliseconds - The number in milisecounds.
	@param {Bollean} p_decimal - Value if is a decimal format.
	@return {String}
	###	
	@toTimeFormat:(p_miliseconds, p_decimal=true)->
		minutes = Math.floor(p_miliseconds / 60)
		seconds = Math.floor(p_miliseconds % 60)
		return String( if p_decimal then @addDecimalZero(minutes) + ":" + @addDecimalZero(seconds) else  minutes + ":" + seconds)

	###*
	A method to add a zero before if the p_value is smaller that 10 and bigger that -1.
	@method addDecimalZero
	@static
	@param {Number} p_value
	@return {String}
	###	
	@addDecimalZero:(p_value)->
		if p_value < 10 then return ("0" + p_value)
		return String(p_value)

	
	###*
	A method to abbreviate a String.
	@method abbreviate
	@static
	@param {String} p_string The text to abbreviate.
	@param {Number} p_max_length the length to text.
	@param {String} p_indicator - The value of the end String.
	@param {String} p_split - The value to before p_indicator and after text.
	@return {String}
	###	
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

	
	###*
	A method to convert a String to Boolean (yes | true | 1 | no | false | 0).
	@method toBoolean
	@static
	@param {String} p_string The value to converting.
	@return {Boolean}
	###	
	@toBoolean:(p_string)->
		t  = ['yes', 'true', '1', 1, true]
		if p_string && ArrayUtils.hasItem(p_string, t)
			return true
		return false


	###*
	A method to returns a random String with the specified length.
	@method random
	@static
	@param {Number} p_length The length of the random.
	@return {String}
	###	
	@random:(p_length=10)->
		s = ""
		for i in [p_length..1]
			s += String.fromCharCode(65 + Math.floor(Math.random()*25))
		return s

	###*
	Trim
	@method trim
	@static
	@param {String} p_str
	@param {String} p_char
	@return {String} 
	###	
	@trim:(p_str, p_char)->
		if p_str is null then return ""
		return @trimRight(@trimLeft(p_str,p_char),p_char)

	###*
	Trim Right
	@method trimRight
	@static
	@param {String} p_str
	@param {String} p_char
	@return {String} 
	###	
	@trimRight:(p_str, p_char)->
		if !p_str then return ""
		re = new RegExp(p_char + '*$')
		re.global = true
		re.multiline = true
		return p_str.replace(re, '')

	###*
	Trim left
	@method trimLeft
	@static
	@param {String} p_str
	@param {String} p_char
	@return {String} 
	###	
	@trimLeft:(p_str, p_char)->
		if !p_str then return ""
		re = new RegExp('^' + p_char + '*')
		re.global = true
		re.multiline = true
		return p_str.replace(re, '')

	###*
	Replace special characters
	@method replaceSpecialCharacters
	@static
	@param {String} p_string
	@return {String}
	###	
	@replaceSpecialCharacters:(p_string)->
		if !@substitionDict then @_initDict()

		for char of @substitionDict
			console.log char
			pattern = new RegExp(char, "g")
			p_string = p_string.replace(pattern, @substitionDict[char])
		return p_string

	###*
	Set strings uppercase
	@method _upperCase
	@private
	@param {String} p_char
	@param {Object} args
	@return {String}
	###	
	@_upperCase:(p_char, args...)->
		return p_char.toUpperCase()

	###*
	List of space character
	@property substitionDict
	@type {Array}
	@private
	@return {String}
	###	
	@substitionDict:null

	###*
	Create list of space character
	@property _initDict
	@private
	@type {Array}
	@return {Array}
	###	
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
