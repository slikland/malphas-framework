paths:
	root: '../../'
	deploy: '{paths.root}deploy/cms/'
	source: '{paths.root}source/cms/'
	coffee: '{paths.source}coffee/'
sourcePaths: [
	'{paths.coffee}'
]
tasks:
	mainJS:
		src: 'Main.coffee'
		output: '{paths.deploy}js/Main.js'