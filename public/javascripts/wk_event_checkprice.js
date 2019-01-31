$(function() {
    
    $(document).on('keydown', '.input-value', function(e){
        var key = e.charCode || e.keyCode || 0;
        if (key == 13) {
            loadData()
        }
    });
    $('.btn-submit').on('click', function(e){
        loadData();
	});
	$('.btn-order').on('click', function(e){
        loadDataOrder();
    }); 
});
			
function loadData(){
	$('.wait').hide();
	$('.wait2').hide();
	$('#dv-loading_data').show();
	$('#dv-no_data').hide();
	$.post( $('#apiUrlSite').val()+'/product/eventPrice', {
		apiKey: $('#apiKey').val(),
		shop: 'AB8FB0BA-23EC-4A82-968D-6E913EDE098A',		
		barcode: $('#barcode').val(),
		name: $('#product-name').val()
	}, function(data){
		$('#dv-loading_data').hide();
		if (data.success) {
			json = data.result;
			var html = '';

			for( i=0; i<json.length; i++ ) {
				var result = json[i];

				html += '<tr>';
				html += '<td width="80" class="" valign="middle">'+result.name+'</td>';
				html += '<td width="20" class="text-center" valign="middle">'+((result.price == 0) ? '-' : numberWithCommas(result.price))+'</td>';
				html += '<td width="20" class="text-center" valign="middle">'+((result.stock == 0) ? '-' : numberWithCommas(result.stock))+'</td>';
				html += '<td width="20" class="text-center" valign="middle">'+((result.inOrder == 0) ? '-' : numberWithCommas(result.inOrder))+'</td>';
				html += '</tr>';
			}

			$('#tb-result tbody').html( html );
			if (data.result.length == 0)
			{
				$('#dv-no_data').show();
                $('.wait').hide();
                $('#tb-result').hide();
			}
			//$("#tb-result2").DataTable();
            $('.wait').show();
            $('#tb-result').show();
			$('.hidden').removeClass('hidden').hide();

		}else {
			$('#dv-no_data').show();
            $('.wait').hide();
            $('#tb-result').hide();
        }
        $('.input-value').val('');
	},'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
};

function loadDataOrder(){
	$('.wait').hide();
	$('.wait2').hide();
	$('#dv-loading_data').show();
	$('#dv-no_data').hide();
	$.post( $('#apiUrlSite').val()+'/product/eventOrder', {
		apiKey: $('#apiKey').val(),
		shop: '3410CE4D-4F60-428D-8BF4-8961397DCD09'
	}, function(data){
		$('#dv-loading_data').hide();
		if (data.success) {
			json = data.result;
			var html = '';

			for( i=0; i<json.length; i++ ) {
				var result = json[i];

				html += '<tr>';
				html += '<td width="20" class="text-center" valign="middle">'+result.orderNo+'</td>';
				html += '<td width="80" class="" valign="middle">'+result.name+'</td>';
				html += '<td width="20" class="text-center" valign="middle">'+((result.qty == 0) ? '-' : numberWithCommas(result.qty))+'</td>';
				html += '</tr>';
			}

			$('#tb-result2 tbody').html( html );
			if (data.result.length == 0)
			{
				$('#dv-no_data').show();
                $('.wait2').hide();
                $('#tb-result').hide();
			}
			//$("#tb-result2").DataTable();
            $('.wait2').show();
            $('#tb-result2').show();
			$('.hidden').removeClass('hidden').hide();

		}else {
			$('#dv-no_data').show();
            $('.wait2').hide();
            $('#tb-result2').hide();
        }
        $('.input-value').val('');
	},'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
};