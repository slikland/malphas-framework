paths:
	root: '../../'
	deploy: '{paths.root}../s385.Halls.Heranca/deploy/cms/'
	deploy: '{paths.root}deploy/cms/'
	deploy: '{paths.root}../s414.Twix.Beunited/deploy/cms/'
	deploy: '{paths.root}../s387.BandaAldo.FaceDetection/deploy/cms/'
	deploy: '{paths.root}../s401.Ford.KA2017/deploy/manager/admin/'
	deploy: '{paths.root}../s413.Guarana.CombinaCom/deploy/_/cms/'
	deploy: '{paths.root}../s426.VW.0109/deploy/cms/'
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
