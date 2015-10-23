h1:"Lista de usuários"
table{"update":"user/userList"}
	thead
		tr
			th{"sort":"name"}: Nome
			th{"sort":"email"}: Email
			th{"sort":"role"}: Nível
			th: 
	tbody
		<tableItem:#{users}
			
!tableItem
	tr: 
		td: #{name}
		td: #{email}
		td: #{role}
		td:
			button.p3{"href":"user/editUser/#{id}"}: Editar