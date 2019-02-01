var api;
var apiUrl = 'wss://api.powerdd.com';
var isConnected = false;
var isInited = false;
var box = '';
var shelf = '';
var productName = '';
var qty = '';
var confirmBox;
var confirmProduct;

$(function() {
	connectWebScket();
    $(document).on('keydown', '#txt-order', function(e){
        var key = e.charCode || e.keyCode || 0;
        if (key == 13) {
            api.request('product', 'location', {order: $('#txt-order').val().toUpperCase()});
        }
	});
	$(document).on('keydown', '#txt-sku', function(e){
        var key = e.charCode || e.keyCode || 0;
        if (key == 13) {
            api.request('product', 'location', {sku: $('#txt-sku').val()});
        }
    });
    $('.btn-order').on('click', function(e){
        api.request('product', 'location', {order: $('#txt-order').val().toUpperCase()});
	});
	$('.btn-sku').on('click', function(e){
        api.request('product', 'location', {sku: $('#txt-sku').val()});
	});
	
	$(document).on('keydown', '#txt-box', function(e){
        var key = e.charCode || e.keyCode || 0;
        if (key == 13) {
            api.request('box', 'product', {id: $('#txt-box').val()});
        }
	});
	$(document).on('keydown', '#txt-product', function(e){
        var key = e.charCode || e.keyCode || 0;
        if (key == 13) {
            api.request('serialBox', 'info', {serial: $('#txt-product').val()});
        }
    });
    $('.btn-box').on('click', function(e){
        api.request('box', 'product', {id: $('#txt-box').val()});
	});
	$('.btn-product').on('click', function(e){
        api.request('serialBox', 'info', {serial: $('#txt-product').val()});
	});
	
	$('.submit-box').on('click', function(e){
		confirmBox = confirm("คุณแน่ใจที่จะลบกล่องออกจากชั้นวาง ?");
		if(confirmBox){
			api.request('boxLocation', 'delete', { box: $('#lbl-box').html() });
		}
	});
	$('.submit-product').on('click', function(e){
		confirmProduct = confirm("คุณแน่ใจที่จะลบสินค้าออกจากชั้นกล่อง ?");
		if(confirmProduct){
			api.request('serialBox', 'delete', { serial: $('#barcode').html() });
		}
	});
	$(document).on('click', '#tb-result tr', function() {
		console.log('Hi')
		$('#m-image').attr('src', $(this).attr('img-product'))
		$('#m-sku').html($(this).attr('sku-product'))
		$('#m-productName ').html($(this).attr('name-product'))
		$('#m-location').html($(this).attr('local-product'))
    });
});
function serialBoxDeleteResponse(data) {       
	if(data.success){
		$('.wait').hide();
		$('.wait2').hide();
	}else{
		console.log(data.errorMessage);
	}
}
function serialBoxDeleteResponse(data) {
	if(data.success){
		$('.wait').hide();
		$('.wait2').hide();
	}else{
		console.log(data.errorMessage);
	}
}
function productLocationResponse(data) {
	$('.wait').hide();
	$('.wait2').hide();
	$('#orderNo').hide().html('');
	$('#dv-no_data').hide();
	$('#dv-loading_data').show();
	if(data.success){
		$('#dv-loading_data').hide();
		json = data.result;
		var html = '';
		for( i=0; i<json.length; i++ ) {
			var result = json[i];

			html += '<tr data-toggle="modal" data-target="#detailModal" img-product="https://img.#{data.websiteDomain}/300x300/product/'+result.sku+'/1.jpg" sku-product="'+result.sku+' ('+result.qty+')" name-product="'+result.name+'" local-product="'+result.location+'">';
			html += '<td width="20" class="text-center" valign="middle"><img width="150" height="150" src="https://img.#{data.websiteDomain}/300x300/product/'+result.sku+'/1.jpg"><p>'+result.sku+' <strong>('+result.qty+')</strong></p></td>';
			html += '<td class="" valign="middle"><b>'+result.name+'</b><br>'+result.location+'</br></td>';
			html += '</tr>';
		}

		$('#tb-result tbody').html( html );
		if (data.result.length == 0)
		{
			$('#dv-no_data').show();
			$('#dv-loading_data').hide();
			$('.wait').hide();
			$('#tb-result').hide();
		}
		$('#orderNo').show().html( ($('#txt-order').val() !='') ? $('#txt-order').val() : $('#txt-sku').val() );
		$('.wait').show();
		$('#tb-result').show();
		$('.hidden').removeClass('hidden').hide();

	}else {
		$('#dv-no_data').show();
		$('#dv-loading_data').hide();
		$('.wait').hide();
		$('.wait2').hide();
		$('#tb-result').hide();
	}
	$('.input-value').val('');
}

function serialBoxInfoResponse(data) {
	$('.wait').hide();
	$('.wait2').hide();
	$('#orderNo').hide().html('');
	$('#dv-no_data').hide();
	$('#dv-loading_data').show();
	if(data.success){
		box = data.box;
		api.request('box', 'product', {
			id: data.box
		}); 
	} else {
		$('#dv-no_data').show();
		$('#dv-loading_data').hide();
		$('.wait').hide();
		$('.wait2').hide();
	}
}

function boxProductResponse(data) {
	$('.wait').hide();
	$('.wait2').hide();
	$('#orderNo').hide().html('');
	$('#dv-no_data').hide();
	$('#dv-loading_data').show();
	if(data.success){
		productName = data.result.name;
		qty = data.result.qty;
		(box != '') ? box = box : box = $('#txt-box').val()
		api.request('boxLocation', 'info', { 
			box: box
		});
	} else {
		$('#dv-no_data').show();
		$('#dv-loading_data').hide();
		$('.wait').hide();
		$('.wait2').hide();
	}
}

function boxLocationInfoResponse(data) {
	if(data.success){
		shelf = data.location;
		screenValue();
	}
}

function screenValue() {
	$('#barcode').show().html( ($('#txt-box').val() !='') ? $('#txt-box').val() : $('#txt-product').val() );
	$('#lbl-box').html((box != '' && typeof box != 'undefined') ? box : '-');
	$('#lbl-shelf').html((shelf != '' && typeof shelf != 'undefined') ? shelf : '-');
	$('#lbl-product-name').html((productName != '' && typeof productName != 'undefined') ? productName : '-');
	$('#lbl-qty').html((qty != '' && typeof qty != 'undefined') ? qty : '-');

	if ($('#txt-box').val() !='') {
		$('.submit-box').show()
		$('.submit-product').hide();
	} else {
		$('.submit-product').show();
		$('.submit-box').hide()
	}
	 
	$('.input-value').val('');
	box = '';
	shelf = '';
	productName = '';
	qty = '';
	$('#dv-no_data').hide();
	$('#dv-loading_data').hide();
	$('.wait').hide();
	$('.wait2').show();
}

//### Web Socket ###//
function API(server) {
	this.ws = new WebSocket(server);

	this.ws.onopen = function () {
		isConnected = true;
		api.request('member', 'login', { username:'dpdev',password:'1234' });
	};

	this.ws.onmessage = function (evt) {
		try {
			var json = JSON.parse(evt.data);
			if (json.name != undefined) {
				var name = json.name;
				delete json.name;
				eval(name + '(' + JSON.stringify(json) + ')');
			}
			else {
				console.log(json);
			}
		}
		catch (err) {
			console.log(err);
		}
	};

	this.ws.onclose = function () {
		isConnected = false;
		$('.event.received').removeClass('received').addClass('listening');
		setTimeout(function () {
			connectWebScket();
		}, 1000);
	};

	this.ws.onerror = function (err) {
		console.log(err);
	};

	this.request = function (method, action, data) {
		this.ws.send(JSON.stringify({
			method: method,
			action: action,
			data: data
		}));
	}

	this.send = function (data) {
		this.ws.send(JSON.stringify(data));
	}

}

function connectWebScket() {
	api = new API(apiUrl);
}
function memberLoginResponse(data) { 
	if(data.success){
		$('#dv-load').hide();
		$('.dev-content').show();
	}
}
function serverRequest(data) {
	if (data.action == 'getToken') {
		/*api.send({
			"name": "clientResponse",
			"action": data.action,
			"token": Cookies.get('token')
		});*/
	}
	else if (data.action == 'revokeToken') {
		//Cookies.remove('token');
		//$('.logout').click();
	}
	else if (data.action == 'acceptToken') {
		
	}
	
}
//### Web Socket [END] ###//
