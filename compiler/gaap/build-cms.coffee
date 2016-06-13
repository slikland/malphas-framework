paths:
	root: '../../'
	deploy: '{paths.root}../../s329/deploy/cms/'
	source: '{paths.root}source/cms/'
	coffee: '{paths.source}coffee/'
	stylus: '{paths.source}stylus/'
sourcePaths: [
	'{paths.coffee}'
	'{paths.stylus}'
]
tasks:
	mainJS:
		src: 'Main.coffee'
		output: '{paths.deploy}js/Main.js'
	mainCSS:
		src: 'main.styl'
		output: '{paths.deploy}css/main.css'