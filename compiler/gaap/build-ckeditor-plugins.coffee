paths:
	root: '../../'
	deploy: '{paths.root}deploy/cms/js/vendors/ckeditor/plugins/'
	source: '{paths.root}source/'
	coffee: '{paths.source}cms/coffee/cms/vendors/ckeditor/plugins/'
sourcePaths: [
	'{paths.coffee}'
]
tasks:
	mediaGalleryJS:
		src: 'MediaGallery.coffee'
		output: '{paths.deploy}mediagallery/plugin.js'
	mediaItemJS:
		src: 'MediaItem.coffee'
		output: '{paths.deploy}mediaitem/plugin.js'
