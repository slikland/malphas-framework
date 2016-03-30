form{"action":"test/updateTest","clonable":true}
	fieldset{"removable":true}
		legend:"BLA"
		field
			label:"Name"
			input
	(if #{a})
		field{"clonable":true}
			label:"Name"
			input
		field
			label:"Name"
			input{"clonable":true}
		field
			label: "Image"
			input{"type":"file","name":"image","preview":"image","value":"http://www.keenthemes.com/preview/metronic/theme/assets/global/plugins/jcrop/demos/demo_files/image1.jpg"}
		field
			label: "Video"
			input{"type":"file","name":"image","preview":"video","value":"http://local.slikland.com/slikland-cms/deploy/media/about.mp4"}
		field.buttons
			button.p5{"type":"submit"}:"Submit"