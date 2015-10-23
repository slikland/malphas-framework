h1:"Lista de log"
input{"class":"search", "placeholder": "Busca", "for": "list"}
table{"update":"user/logList", "id":"list"}
	thead
		tr
			th{"sort":"user"}: Usuário
			th{"sort":"action"}: Ação
			th{"sort":"description"}: Descrição
			th{"sort":"data"}: Dados
			th{"sort":"created"}: Data
	tbody
		<tableItem:#{items}
			
!tableItem
	tr: 
		td: #{user}
		td: #{action}
		td: #{description}
		td: #{data}
		td.nowrap: #{created}
