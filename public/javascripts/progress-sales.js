var dayTh = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
var monthTh = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];

$(function() {
	loadData();
	loadNews();

	var socket = io.connect('https://realtime-test.remaxthailand.co.th');
	socket.on('target_product_checked', function (data) {
		if(data.checked)
			loadData();
	});
	socket.on('news', function (data) {
		if(data.news)
			loadNews();
	});

	setScale();

	setInterval(function() {
		var date = new Date();
		$('.text-time').html((date.getHours()<10 ? '0' : '')+date.getHours()+':'+(date.getMinutes()<10 ? '0' : '')+date.getMinutes()+':'+(date.getSeconds()<10 ? '0' : '')+date.getSeconds());
		$('.text-date').html( 'วัน'+dayTh[date.getDay()]+'ที่ '+date.getDate()+' '+monthTh[date.getMonth()]+' '+(date.getFullYear()+543)+' เวลา&nbsp;' );

		var progress = (date.getHours()-9)*3600+(date.getMinutes()*60)+date.getSeconds();
		var maxWidth = $('#progress-time').parents('.div-progress').width();
		$('#progress-time').find('.bar').animate({width:parseFloat(progress/54000.0)*(maxWidth-10)*1.0});

	}, 1000);

	/*setInterval(function() {
		loadData();
		loadNews();
	}, 5000);*/

});

function setScale(){
	$('.progressbar').each(function(){
		var t = $(this);
		setProgress(t);

		var maxWidth = t.parents('.div-progress').width();
		for(i=10; i<=24; i++){
			t.find('.time-line.time-'+i).css('left', (parseFloat(6.5*(i-9))*(maxWidth-10)*1.0/100.0)+'px' );
		}
	});

	var top = -24;
	var left = -16;
	$('.div-percent .time-9').css('top', $('.scale-top .time-9').offset().top+top).css('left', $('.scale-top .time-9').offset().left+left+5);
	$('.div-percent .time-14').css('top', $('.scale-top .time-14').offset().top+top).css('left', $('.scale-top .time-14').offset().left+left);
	$('.div-percent .time-19').css('top', $('.scale-top .time-19').offset().top+top).css('left', $('.scale-top .time-19').offset().left+left);

	top = 24;
	left = -20;
	$('.div-time .time-9').css('top', $('.scale-time .time-9').offset().top+top).css('left', $('.scale-time .time-9').offset().left+left);
	$('.div-time .time-14').css('top', $('.scale-time .time-14').offset().top+top).css('left', $('.scale-time .time-14').offset().left+left);
	$('.div-time .time-19').css('top', $('.scale-time .time-19').offset().top+top).css('left', $('.scale-time .time-19').offset().left+left);
}

function setProgress(object){
	var progress = object.attr('data-perc')
	var maxWidth = object.parents('.div-progress').width();
	object.find('.bar').animate({width:parseFloat(progress)*(maxWidth-10)*1.0/100.0}, progress*25);
}

function loadData(){
	$.post('https://api.remaxthailand.co.th/sale/targets', {
		apiKey: 'E64E8666-9A78-45E9-8801-E4C46F0C0E13',
		shop: 'POWERDDH-8888-8888-B620-48D3B6489999'
	}, function(data){
		if (data.success) {
			$('#totalPrice').html(numberWithCommas(data.result[0].totalPrice));
			$('#targetPrice').html(numberWithCommas(data.result[0].targetPrice));

			$('#billWait').html(numberWithCommas(data.result[0].billWait));
			$('#billPacking').html(numberWithCommas(data.result[0].billPacking));
			$('#billSuccess').html(numberWithCommas(data.result[0].billSuccess));

			var progress = data.result[0].totalPrice/data.result[0].targetPrice;
			var maxWidth = $('#progress-time').parents('.div-progress').width();
			var width100 = $('.scale-top .time-19').offset().left-$('.scale-top .time-9').offset().left;
			$('#progress-price').find('.bar').animate({width:parseFloat(width100*progress+14)});

			if (progress < 0.5){
				$('#progress-price .bar').removeClass('color1').removeClass('color2').removeClass('color3').removeClass('color4')
					.addClass('color3');
			}
			else if (progress < 0.8){
				$('#progress-price .bar').removeClass('color1').removeClass('color2').removeClass('color3').removeClass('color4')
					.addClass('color2');
			}
			else if (progress < 1){
				$('#progress-price .bar').removeClass('color1').removeClass('color2').removeClass('color3').removeClass('color4')
					.addClass('color1');
			}
			else {
				$('#progress-price .bar').removeClass('color1').removeClass('color2').removeClass('color3').removeClass('color4')
					.addClass('color4');
			}

		}

	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}

function loadNews(){
	$.post('https://api.remaxthailand.co.th/shop/newsInfo', {
		apiKey: 'E64E8666-9A78-45E9-8801-E4C46F0C0E13',
		shop: 'POWERDDH-8888-8888-B620-48D3B6489999'
	}, function(data){
		if (data.success) {
				$('#newsInfo').html(data.result[0].message);
		}
	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
