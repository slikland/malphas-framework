#import slikland.core.template.TemplateNode
#import slikland.core.template.TemplateParser

class Template

	@RULES: """
		object:
			start: \\{
			end: \\}
			content: \\:+
		data: 
			start: \\#\\{
			end: \\}
			content: [^\\s]+
		if: 
			start: \\(if
			end: \\)
		forin:
			start: \\(for\\s+(\\w+)\\s+in
			end: \\)
		forof: 
			start: \\(for\\s(\\w+)\\sof
			end: \\)
		selector: 
			start: \\>
		reference: 
			start: \\<
			content: [^\\s]+
		id: 
			start: \\!
			content: [^\\s]+
		element:
			start: ^(\\w*)\\:
		sequence:
			start: \\[
			end: \\]
	"""

	@CACHE = {}
	@ROOT_PATH = ''
	@EXTENSION = '.tpl'

	@setRootPath:(rootPath = '')->
		@ROOT_PATH = rootPath
	@setExtension:(extension = '.tpl')->
		@EXTENSION = extension
	@addTemplate:(id, template)->
		if !@CACHE[id]
			if template not instanceof TemplateParser
				tParser = new TemplateParser()
				tParser.parse(template)
			else
				tParser = template
			@CACHE[id] = tParser

	@render:(template, context = null, data = null, onComplete = null, onError = null)->
		if !template
			return
		if !@CACHE[template]
			tParser = new TemplateParser(template)
			tParser.on(TemplateParser.LOAD_COMPLETE, @_loadComplete)
			@CACHE[template] = tParser
		tParser = @CACHE[template]
		tParser.render(context, data, onComplete, onError)

	@_loadComplete:()=>
		


	@find:(id)->
		return @CACHE[id]