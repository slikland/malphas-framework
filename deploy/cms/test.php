<!DOCTYPE html>
<html>
<head>
	<title></title>
</head>
<body>

</body>
<script type="text/javascript">

function request()
{
	if(window.XMLHttpRequest)
	{
		return new XMLHttpRequest();
	}
	else if (window.ActiveXObject)
	{
		return new ActiveXObject("MSXML2.XMLHTTP.3.0")
	}
}

var w = 200;
var h = 200;
var canvas = document.createElement('canvas');
canvas.setAttribute('width', w);
canvas.setAttribute('height', h);
var context = canvas.getContext('2d');
context.fillStyle = '#00FF00';
context.fillRect(0, 0, w, h);
document.body.appendChild(canvas);
// var url = canvas.toDataURL('image/jpeg');
// console.log(url);
var blob = canvas.toBlob();
console.log(blob);

// var req = request();
// function reqLoaded()
// {
// 	console.log(req.ressponse);
// }

// req.onload = reqLoaded;
// req.open('GET', url, true);
// req.responseType = 'blob';
// req.send();

</script>
</html>