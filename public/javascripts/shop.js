
$(function() {

	//loadImage();
	if ( $('#mobileNumber').html().length == 10 ) {
		var mobile = $('#mobileNumber').html();
		$('#mobileNumber').html(mobile.substr(0, 3)+'-'+mobile.substr(3, 4)+'-'+mobile.substr(7, 3) );
	}else{$('#mobileNumber').html($('#mobileNumber').html())}

});