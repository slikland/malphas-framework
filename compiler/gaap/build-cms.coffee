paths:
	root: '../../'
	deploy: '{paths.root}../s401.Ford.KA2017/deploy/cms/'
	source: '{paths.root}source/cms/'
	coffee: '{paths.source}coffee/'
	stylus: '{paths.source}stylus/'
	vendors: '{paths.source}vendors/'
sourcePaths: [
	'{paths.coffee}'
	'{paths.stylus}'
	'{paths.vendors}'
]
tasks:
	mainJS:
		src: 'Main.coffee'
		output: '{paths.deploy}js/Main.js'
	mainCSS:
		src: 'main.styl'
		output: '{paths.deploy}css/main.css'
	vendorsJS:
		src: 'vendors.js'
		output: '{paths.deploy}js/vendors.js'
	vendorsCSS:
		src: 'vendors.styl'
		output: '{paths.deploy}css/vendors.css'
