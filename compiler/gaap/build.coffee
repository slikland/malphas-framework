paths:
	root: '../../'
	deploy: '{paths.root}deploy/'
	source: '{paths.root}source/'
	coffee: '{paths.source}coffee/'
sourcePaths: [
	'{paths.coffee}'
]
tasks:
	mainJS:
		src: 'Main.coffee'
		output: '{paths.deploy}js/Main.js'
