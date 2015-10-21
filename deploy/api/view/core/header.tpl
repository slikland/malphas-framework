header
	div.left#asdasd:
		a{"href":"/"}
			img.logo{"src": "media/images/logo.png"}
			span.cms:CMS | 
	div.right:
		span.user: #{user.name}
		span.separator: " | " 
		button.sign-out.p1{"action":"user/logout"}
			span.fa.fa-sign-out
			span: Logout
