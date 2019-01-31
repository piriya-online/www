$(function() {
	loadImageProduct();
	$('.numberFormat').each(function(){
		var number = $(this).attr('data-value');
		$(this).html(numberWithCommas(number)); 
	});
	
	$(window).scroll(function(){
		var a = $('#scroll-top').find('a');
		if ($(this).scrollTop() > 250) {		
			a.fadeIn(200);
		} else {
			a.fadeOut(200);
		}
    });
	$('#scroll-top').click(function(){
        $("html, body").animate({ scrollTop: 0 }, 1000);
        return false;
    });
});
			
function loadImageProduct(){
	var value = window.location.pathname.split('/');
	$.post( $('#apiUrlSite').val()+'/product/info', {
		apiKey: $('#apiKey').val(),		
		shop: $('#shop').val(),
		type: 'byCategoryUrl4Web',
		value: value[2]
	}, function(data){
		if (data.success) {
			if(data.result.length != 0){
				for(i=0; i < data.result.length; i++) {
					if(device == 'desktop'){
						if(data.result[i].image != "" && typeof data.result[i].image != null){
							$('img#'+data.result[i].product).attr('src', 'https://img.remaxthailand.co.th/500x500/product/'+data.result[i].sku+'/'+data.result[i].image)
						}
					} else{
						if(data.result[i].image != "" && typeof data.result[i].image != null){
							$('img#'+data.result[i].product).addClass('lazy'); 
							$('img#'+data.result[i].product).attr('data-original', 'https://img.remaxthailand.co.th/500x500/product/'+data.result[i].sku+'/'+data.result[i].image)
							$('img.lazy').lazyload();
						}
					}		
				}
			}
		}
	},'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
};