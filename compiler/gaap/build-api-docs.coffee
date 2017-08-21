paths:
	root: '../../'
	source: '{paths.root}deploy/test/'
sourcePaths: []
tasks: {}

docs:
	name: "Test Project Name"
	description: "Test Project description"
	version: "1.0"
	url: "http://slikland.com/"
	logo: "http://slikland.com/media/images/logo_docs.png"
	source: "{paths.source}"
	extension: ".php"
	options:
		paths: ["{paths.source}/"]
		output: "../../docs/api"
