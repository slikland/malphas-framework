paths:
	root: '../../'
	deploy: '{paths.root}../s427.Ford.OfertasFord/deploy/manager/admin/'
	deploy: '{paths.root}../s452.Ford.TeaserPrimaryBrand/deploy/manager/admin/'
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
