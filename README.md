# shiftUI
shiftUI is a universal bitcoin qrcode generator supporting altcoins through the ShapeShift API

[Click here for a working example](https://lightlistio.github.io/)

To generate a QRCode from a Bitcoin address that can dynamically accept Litecoin, Dogecoin, Dash and more, all you need to do is download shiftUI and include these 2 lines of code in your `html`:
```
	<div id="shiftUI" data-address="<YOUR BTC ADDRESS>"></div>
	<script type="text/javascript" src="js/shiftUI.js"></script>
```

and these 2 lines in `<head>`
	

 ```
	<script src="js/qrcode.js"></script>
 	<link rel="stylesheet" href="css/styles.css" type="text/css" media="screen"/>
```

shiftUI currently relies on jQuery and bootstrap, so if you haven't already, also include in `<head>`:

```	
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css">
	<script src="https://code.jquery.com/jquery-2.1.3.min.js"></script>
```

Keep on shifting!

**lightlist.io**


