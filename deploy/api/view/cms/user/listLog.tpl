h1:"Lista de log"
table{"update":"user/logList"}
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
