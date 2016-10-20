<!DOCTYPE html><?php
include_once('../api/index.php');

$mara = new \slikland\mara\Mara('templates/');
$data = array();

$data['base'] = ROOT_URL . 'cms/';
$data['meta'] = array();
$data['meta'][] = array('name'=>'ROBOTS', 'content'=>'NOINDEX, NOFOLLOW');

$data['styles'] = array('css/main.css');
$data['scripts'] = array('js/Main.js');

$mara->render('index', $data);

?>
<?php die();?>
<html>
<head>
<!-- 	<link rel="dns-prefetch" href="<?php echo ROOT_URL; ?>">
	<base href="<?php echo ROOT_URL . 'cms/'; ?>"></base>
 -->
	<title>CMS</title>

	<link rel="stylesheet" type="text/css" href="css/main.css" />
</head>
<body>
<header>
	<h1 badge="1">CMS - Slikland</h1>
	<aside><tag color="#FF0000">Admin</tag>User Name <button class='button-1'>Log out</button></aside>
</header>
<nav>
<ul>
	<li><a href="test" badge="3">Home</a>
		<ul>
			<li><a badge="10">Dashboard</a></li>
			<li><a badge="10">Galeria</a></li>
			<li><a badge="10">Usuários</a>
				<ul>
					<li><a badge="10">Adicionar</a></li>
					<li><a badge="10">Remover</a></li>
				</ul>
			</li>
		</ul>
	</li>
</ul>
</nav>
<main>
	<h1>Template list</h1>
	<card class="col-full">
		<header>
			<h2>Headings</h2>
		</header>
		<content>
			<h1>H1</h1>
			<h2>H2</h2>
			<h3>H3</h3>
			<h4>H4</h4>
			<h5>H5</h5>
			<h6>H6</h6>
		</content>
		<div class='loading'>
		<div>LOADING!</div>
		</div>
	</card>
	<card class="col-full">
		<header>
			<h2>Grid system</h2>
		</header>
		<content>
			<card class="col-1">
				<content>
					Col-1
				</content>
			</card>
			<card class="col-11">
				<content>
					Col-11
				</content>
			</card>
			<card class="col-2">
				<content>
					Col-2
				</content>
			</card>
			<card class="col-10">
				<content>
					Col-10
				</content>
			</card>
			<card class="col-3">
				<content>Col-3</content>
			</card>
			<card class="col-9">
				<content>Col-9</content>
			</card>
			<card class="col-4">
				<content>Col-4</content>
			</card>
			<card class="col-8">
				<content>Col-8</content>
			</card>
			<card class="col-5">
				<content>Col-5</content>
			</card>
			<card class="col-7">
				<content>Col-7</content>
			</card>
			<card class="col-6">
				<content>Col-6</content>
			</card>
			<card class="col-6">
				<content>Col-6</content>
			</card>
			<card class="col-12">
				<content>Col-12</content>
			</card>
		</content>
	</card>
	<card class='col-full'>
		<header class='bg-4'>
			<h2>Buttons</h2>
		</header>
		<content>
			<button class='button-1'>BUTTON</button>
			<button class='button-2'>BUTTON</button>
			<button class='button-3'>BUTTON</button>
			<button class='button-4'>BUTTON</button>
			<button class='button-5'>BUTTON</button>
			<hr />
			<button class='bg-1'>BUTTON</button>
			<button class='bg-2'>BUTTON</button>
			<button class='bg-3'>BUTTON</button>
			<button class='bg-4'>BUTTON</button>
			<button class='bg-5'>BUTTON</button>
			<hr />
			<button class='text-1'>BUTTON</button>
			<button class='text-2'>BUTTON</button>
			<button class='text-3'>BUTTON</button>
			<button class='text-4'>BUTTON</button>
			<button class='text-5'>BUTTON</button>

			<hr />

			<button enabled="false" class='button-1'>BUTTON</button>
			<button enabled="false" class='button-2'>BUTTON</button>
			<button enabled="false" class='button-3'>BUTTON</button>
			<button enabled="false" class='button-4'>BUTTON</button>
			<button enabled="false" class='button-5'>BUTTON</button>
			<hr />
			<button enabled="false" class='bg-1'>BUTTON</button>
			<button enabled="false" class='bg-2'>BUTTON</button>
			<button enabled="false" class='bg-3'>BUTTON</button>
			<button enabled="false" class='bg-4'>BUTTON</button>
			<button enabled="false" class='bg-5'>BUTTON</button>
			<hr />
			<button enabled="false" class='text-1'>BUTTON</button>
			<button enabled="false" class='text-2'>BUTTON</button>
			<button enabled="false" class='text-3'>BUTTON</button>
			<button enabled="false" class='text-4'>BUTTON</button>
			<button enabled="false" class='text-5'>BUTTON</button>
		</content>
	</card>
	<br>
	<card class="col-12">
		<header><h2>Tables</h2></header>
		<content>
			<table class="card">
				<thead>
					<tr>
						<th>Column1</th>
						<th>Column2</th>
						<th>Column3</th>
						<th>Column4</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>Column1</td>
						<td>Column2</td>
						<td>Column3</td>
						<td>Column4</td>
					</tr>
					<tr>
						<td>Column1</td>
						<td>Column2</td>
						<td>Column3</td>
						<td>Column4</td>
					</tr>
				</tbody>
			</table>
		</content>
	</card>
	<card class="col-full">
		<header><h2>Forms</h2></header>
		<content>
			<form class="card">
				<header>
					FORM!
				</header>
				<content>
					<group>
						<field class='col-2'>
							<label>Some label</label>
							<input type="text" />
						</field>
						<field class='col-2'>
							<label>Some label</label>
							<input type="text" />
						</field>
					</group>
					<group>
						<field>
							<label>Some label</label>
							<input type="text" />
						</field>
						<field>
							<label>Some label</label>
							<input type="text" />
						</field>
					</group>
					<field>
						<label>Some label</label>
						<input type="text" />
					</field>
					<field>
						<label>Some label</label>
						<input type="text" />
					</field>
				</content>
			</form>
		</content>
	</card>
</main>
</body>
</html>