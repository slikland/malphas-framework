form{"action":"user/edit"}:
	input{"type": "hidden", "name": "id", "value": "#{id}"}
	field:
		label{"for":"name"}: "Nome"
		input{"name":"name","id":"name", "value": "#{name}", "maxlength": 10}
	field:
		label{"for":"email"}: "E-mail"
		input{"name":"email","id":"email", "value": "#{email}"}
	field:
		label{"for":"pass"}: "Senha"
		input{"name":"pass","id":"pass", "type":"password", "value": "-----"}
	field:
		label{"for":"role"}: "Tipo"
		select{"name":"role","id":"role"}:#{roles}
			option{"value":"#{value}", "selected": "#{selected}"}:#{name}
	field.buttons:
		button.p5{"type":"submit"}:"#{submitLabel}"
