h1: "Adicionar novo usuário"
form{"action":"user/add"}:
	field:
		label{"for":"name"}: "Nome"
		input{"name":"name","id":"name"}
	field:
		label{"for":"email"}: "E-mail"
		input{"email":"email","id":"email"}
	field:
		label{"for":"pass"}: "Password"
		input{"pass":"pass","id":"pass"}
	field:
		label{"for":"role"}: "Tipo"
		select{"role":"role","id":"role"}:#{roles}
			option{"value":"#{value}"}:#{name}
	field.buttons:
		button.p5{"type":"submit"}:"Adicionar"