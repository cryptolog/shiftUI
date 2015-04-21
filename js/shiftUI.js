/**
 * @author lightlist.io
 * @see <a href="https://www.lightlist.io" target="_blank">https://www.lightlist.io</a>
 * @see <a href="https://github.com/lightlistio/shiftUI" target="_blank">https://github.com/lightlistio/shiftUI</a>
 * @see <a href="https://lightlistio.github.io" target="_blank">https://lightlistio.github.io</a>
 */


// Use this function to respond to a successful shift
function onShiftComplete(response) {
	$('#shift-info').hide();
	if (typeof updateShiftStatusTimer !== 'undefined') {
		clearTimeout(updateShiftStatusTimer);       
	}
	alert('Received: ' + response.outgoingCoin + ' ' + response.outgoingType);
}

// Use this function to respond to shifting in progress
function onShiftReceived(response) {
	$('#incoming-coin').text(response.incomingCoin + ' ' + response.incomingType);
	$('#memo').val(response.incomingCoin + ' ' + response.incomingType + ' via ShapeShift');
	$('#shift-info').show();
}

// Define which coins you want to enable, the data-coin tag is a nickname you can choose
var str = "	<div class='shiftui' id='shiftui'>\
				<div class='input-group text-center'>\
					<div id='pubqrcode'></div>\
				<div class='coin-div blink_me' data-coin='Satoshi' data-pair='btc'>\
					<img alt='Bitcoin' class='coin-img' src='https://shapeshift.io/images/coins/bitcoin.png' />\
				</div>\
				<div class='coin-div' data-coin='Litecoin' data-pair='ltc_btc'>\
					<img alt='Litecoin' class='coin-img' src='https://shapeshift.io/images/coins/litecoin.png' />\
				</div>\
				<div class='coin-div' data-coin='Shibes' data-pair='doge_btc'>\
					<img alt='Dogecoin' class='coin-img' src='https://shapeshift.io/images/coins/dogecoin.png' />\
				</div>\
				<div class='coin-div' data-coin='DASH' data-pair='dash_btc'>\
					<img alt='Dash' class='coin-img' src='https://shapeshift.io/images/coins/dash.png' />\
				</div>\
				<div id='shift-info' class='alert-success text-center' role='alert'>\
					<strong>Shifting <span id='incoming-coin'>.. BTC</span></strong>\
				</div>\
				<div class='text-center fade' id='wait-fade'>\
					Waiting for <span id='wait-coin-type'>Satoshi</span>\
				</div>\
			</div>",
	html = $.parseHTML(str);
$( "#shiftUI" ).html(html);






// Nothin to configure down here
var targetAddress = $( "#shiftUI" ).data("address");
var qrcode = new QRCode(document.getElementById("pubqrcode"), {
	text: targetAddress,
	width : 125,
	height : 125,
	colorDark : "#000000",
	colorLight : "#ffffff",
	correctLevel : QRCode.CorrectLevel.M
});

function makeCode () {      
	qrcode.makeCode(targetAddress);
}

makeCode();

$('.coin-div').click(function (event) 
{ 
	event.preventDefault(); 

	// Clear timer listening for previously selected coin-type
	if (typeof updateShiftStatusTimer !== 'undefined') {
		clearTimeout(updateShiftStatusTimer);       
	}


	// Load coin-types defined in html
	var pair = $(this)[0].dataset.pair;
	var coin = $(this)[0].dataset.coin;
	var el = $(this);


	// If coin-type is Bitcoin, reset to initial Bitcoin address
	if (pair == 'btc') {
		qrcode.makeCode(targetAddress);
		$('.coin-div').removeClass("blink_me");
		$('#wait-coin-type').html(coin);
		el.addClass("blink_me");
	}
	// If an altcoin-type was clicked, request a new transaction via ShapeShift API
	else {
		var body = {
			'withdrawal' : targetAddress,
			'pair' : pair
		}
		console.log(JSON.stringify(body));

		$.post('https://shapeshift.io/shift', body, function(response) {
			console.log(JSON.stringify(response));

		    // Successful
		    if(typeof response['error'] == 'undefined') {
		    	qrcode.makeCode(response.deposit);
		    	$('.coin-div').removeClass("blink_me");
		    	$('#wait-coin-type').html(coin);
		    	el.addClass("blink_me");

		    	shiftAddress = response.deposit;
		    	updateShiftStatusTimer = setInterval(updateShiftStatus, 5000);
		    }

		    // Error
		    else {
		    	alert(response['error']);
		    }
		}, 'json');

	}

});




updateShiftStatus = function() {
	$.get('https://shapeshift.io/txStat/' + shiftAddress, function(response) {
		    // Do something with the request
		    console.log(response);
		    if(typeof response['error'] == 'undefined') {
		    	console.log(response.status);
		    	
		    	if (response.status == "received") {
		    		onShiftReceived(response);
		    	}
		    	if (response.status == "complete") {
		    		onShiftComplete(response);
		    	}
		    }
		    else {
		    	alert(response['error']);
		    }
		}, 'json');
}
