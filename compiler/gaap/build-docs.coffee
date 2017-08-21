paths:
	root: '../../'
	deploy: '{paths.root}docs/cms/'
	source: '{paths.root}source/docs/'
	coffee: '{paths.source}coffee/'
	stylus: '{paths.source}stylus/'
	framework: '{paths.root}source/cms/coffee/'
sourcePaths: [
	'{paths.coffee}'
	'{paths.stylus}'
	'{paths.framework}'
]
tasks:
	mainJS:
		src: 'Main.coffee'
		output: '{paths.deploy}js/Main.js'
	mainCSS:
		src: 'main.styl'
		output: '{paths.deploy}css/main.css'
