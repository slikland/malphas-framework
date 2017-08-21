<?php
$http = "http";
if(isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on') $http = 'https';
if(isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] == 'https') $http = 'https';
$secure = ($http == 'https');

$domain = $_SERVER['HTTP_HOST'];
$host = $http . '://' . $domain;
$rootPath = realpath(__DIR__ . '');
$scriptPath = realpath(dirname($_SERVER['SCRIPT_FILENAME']));
$rootPathRE = str_replace('/', '\\/', $rootPath);
$path = str_replace('/', '\\/', preg_replace('/^' . $rootPathRE . '/', '', $scriptPath));
$relativeRootPath = preg_replace('/' . $path . '$/', '', dirname($_SERVER['SCRIPT_NAME']));

$rootPath .= '/';
$relativeRootPath .= '/';
$rootURL = $host . $relativeRootPath;
?><!DOCTYPE html>
<html>
<head>
	<base href="<?php echo $rootURL;?>"></base>
	<title></title>
	<script src="js/Main.js"></script>
	<link rel="stylesheet" type="text/css" href="css/main.css">
</head>
<body>
<nav></nav>
<main>
</main>
</body>
</html>