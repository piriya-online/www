var fileCount = 0;
var fileProgress = {};
var fileName = '';
var allProgress = 0;

$(function() {

	$('#mobile').ForceNumericOnly();
	loadProvince();
	//renderTime();

	$(document).on('click', '#btn-register', function(evt){
		if( checkInput() ) {
			uploadFile();
		}
	});

});

function loadProvince(){	
	$.post($('#apiUrlSite').val()+'/province/list', {
		apiKey: $('#apiKey').val(),
	}, function(data){
		if(data.success) {
			$('#province').html('');
			var html = '';
			for(i=0; i<data.result.length; i++){
				html += '<option>'+data.result[i].name+'</option>';
			}
			$('#province').html(html);
			$('#province option:eq(0)').attr('selected', 'selected');
		}
	});
}

function renderTime(){	
	$('#time').html('');
	var html = '';
	for(i=6; i<=22; i++){
		html += "<option>"+((i<10) ? '0' : '')+i+":00-"+((i<9) ? '0' : '')+(i+1)+":00</option>";
	}
	$('#time').html(html);
}

function checkInput() {
	var success = true;
	$('.form-group.has-error').removeClass('has-error');
	$('input.required').each(function(){
		if( $.trim($(this).val()) == "" ){
			success = false;
			$(this).parents('.form-group').addClass('has-error');
			$(this).focus();
			$('html, body').animate({scrollTop: $(this).parents('.form-group').offset().top-60}, 200);
			return false;
		}
	});

	if(success){
		if( $.trim($('#mobile').val()).length < 9 || $.trim($('#mobile').val()).substr(0,1) != '0' ){
			success = false;
			$('#mobile').parents('.form-group').addClass('has-error');
			$('#mobile').focus();
			$('html, body').animate({scrollTop: $('#mobile').parents('.form-group').offset().top-60}, 200);
		}
	}

	return success;
}

function uploadFile(){
	
	$('#form-input').slideUp();
	$('#form-loading').fadeIn();

	fileCount = 0;
	allProgress = 0;
	fileName = '';
	for(i=1; i<=4; i++) {
		fileProgress[i] = 0;
		if (typeof document.getElementById('file'+i).files[0] != 'undefined') {
			upload(document.getElementById('file'+i).files[0], i);
			fileCount++;
		}
	}

	if ( fileCount == 0 ) register();
}

function upload(file, index){	
	var formData = new FormData();
	formData.append("index", index);
	formData.append("mobile", $.trim($('#mobile').val()));
	formData.append("type", 'register' );
	formData.append("dir", 'agent' );
    formData.append('myFile', file);
    
    var xhr = new XMLHttpRequest();
    
	xhr.open('POST', 'https://upload.remaxthailand.co.th', true);
    
    xhr.upload.onprogress = function(e) {
      if (e.lengthComputable) {
			var percentComplete = (e.loaded / e.total) * 100;
			fileProgress[index] = percentComplete;
			allProgress = (fileProgress[1]+fileProgress[2]+fileProgress[3]+fileProgress[4])/fileCount;
			$('#progress').css('width', allProgress+'%').attr('aria-valuenow', allProgress);
      }
    };
    
    xhr.onerror = function(e) {
		console.log(e);
		console.log('An error occurred while submitting the form. Maybe your file is too big');
    };
    
    xhr.onload = function() {
		if (this.status == 200) {
			var json = JSON.parse(this.response);
			if ( json.success ) {
				fileName += json.filename + '|';
				if (allProgress == 100){
					register();
				}
			}
		};
		console.log(this.statusText);
    };
    
    xhr.send(formData);
}

function register(){
	$.post($('#apiUrlSite').val()+'/dealer/register', {
		apiKey: $('#apiKey').val(),
		firstname: $.trim($('#firstname').val()),
		lastname: $.trim($('#lastname').val()),
		nickname: $.trim($('#nickname').val()),
		province: $('#province :selected').val(),
		mobile: $.trim($('#mobile').val()),
		time: $('#time :selected').val(),
		address: $.trim($('#address').val()),
		history: $.trim($('#history').val()),
		reason: $.trim($('#reason').val()),
		expect: $.trim($('#expect').val()),
		comment: $.trim($('#comment').val()),
		profile: $.trim($('#history').val()),
		images: fileName
	}, function(data){
		if(data.success) {		
			if(data.result[0].success){
				$('#form-loading').slideUp();
				$('#form-success').slideDown();
			}
		}
	});
}