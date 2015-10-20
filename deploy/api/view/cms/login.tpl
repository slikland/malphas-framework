section.login
	h2.title: Login
	form{"action":"user/login", "method":"POST"}
		field:
			label
				i.fa.fa-user
			input{"name":"user" ,"type": "text", "placeholder": "User"}
		field:
			label
				i.fa.fa-key
			input{"name":"pass" ,"type": "password", "placeholder": "Password"}
		field.buttons
			button: Sign in
