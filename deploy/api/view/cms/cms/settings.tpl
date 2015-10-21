h1: "CMS Settings"
form{"action": "cms/updateSettings"}:
	field:#{values}
		label{"for":"#{name}"}: "#{label}"
		input{"name":"#{name}", "id":"#{name}", "value":"#{value}"}
	field.buttons:
		button.p5:"Update"
		