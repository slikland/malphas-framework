form{"action":"user/edit"}:
	input{"type": "hidden", "name": "id", "value": "#{id}"}
	field:
		label{"for":"name"}: "Nome"
		input{"name":"name","id":"name", "value": "#{name}", "maxlength": 255}
	field{"clonable":true}:
		label{"for":"email"}: "E-mail"
		input{"name":"email","id":"email", "value": "#{email}", "maxlength": 255}
	field:
		label{"for":"pass"}: "Senha"
		input{"name":"pass","id":"pass", "type":"password", "value": "#{pass}", "maxlength": 24}
	field:
		label{"for":"role"}: "Tipo"
		select{"name":"role","id":"role","cloneable":true}:#{roles}
			option{"value":"#{value}", "selected": "#{selected}"}:#{name}
	field.buttons:
		button.p5{"type":"submit"}:"#{submitLabel}"
