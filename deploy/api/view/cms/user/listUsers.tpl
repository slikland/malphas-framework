h1:"Lista de usuários"
table
	thead
		tr
			th: Nome
			th: Email
			th: Nível
			th: 
	tbody
		<tableItem:
			
!tableItem
	tr: #{users}
		td: #{name}
		td: #{email}
		td: #{role}
		td:
			button.p3{"href":"user/editUser/#{id}"}: Editar