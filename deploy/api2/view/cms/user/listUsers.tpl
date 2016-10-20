h1:"Lista de usuários"
table{"update":"user/userList"}
	thead
		tr
			th{"sort":"name"}: Nome
			th{"sort":"email"}: Email
			th{"sort":"role"}: Nível
			th.nowrap{"width":"1%"}: 
	tbody
		<tableItem:#{users}
			
!tableItem
	tr: 
		td: #{name}
		td: #{email}
		td: #{role}
		td.nowrap:
			button.p3{"href":"user/editUser/#{id}"}: Editar
			button.p1{"action":"user/removeUser/#{id}", "confirm":"Deseja realmente remover este usuário?"}: Remover