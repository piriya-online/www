var apiKey24 = '91ADEBD2-1A72-4616-B8C7-8659A3618197';

var fileCount = 0;
var fileProgress = {};
var fileName = '';
var allProgress = 0;
var chkClaim = false;
var loadAddressComplete = false;
var claimInfo;
var claimNo = "";
var sellDate = "";
var sellNo = "";
var sellPrice = 0;
var _username = "";

$(function() {

	//loadProvince();

	$('#hTitle').html('ส่งข้อมูลสินค้าเคลม');
	$('#tab-warranty-load').show();
	checkUser();
	$('#btn-login').removeClass('disabled');
	$('#username, #password').removeAttr('disabled');

	$(document).on('click', '#btn-login', function(){
		if ( !$(this).hasClass('disabled') ) {
			$('#message').show();
			if ( $.trim($('#username').val()) == '' ) {
				$('#message').html( '<i class="fa fa-warning"></i> กรุณากรอกชื่อผู้ใช้ด้วยค่ะ' ).addClass('text-danger').removeClass('text-primary');
			}
			else if ( $('#password').val() == '' ) {
				$('#message').html( '<i class="fa fa-warning"></i> กรุณากรอกรหัสผ่านด้วยค่ะ' ).addClass('text-danger').removeClass('text-primary');
			}
			else {
				$('#message').html( '<i class="fa fa-spinner fa-pulse"></i> กำลังตรวจสอบข้อมูล กรุณารอสักครู่ค่ะ' ).addClass('text-primary').removeClass('text-danger');
				$('#btn-login').addClass('disabled');
				$('#username, #password').attr('disabled', 'disabled');
				login();
			}
		}
	});

	$(document).on('keydown', '#username, #password', function(e){
		var key = e.charCode || e.keyCode || 0;
		if (key == 13) {
			$('#btn-login').click();
		}
	});

	
	$('#txt-tel').ForceNumericOnly();
	$('#txt-zipcode').ForceNumericOnly();

	$(document).on('change', '#province', function(){
		loadDistrict();
	});

	$(document).on('change', '#district', function(){
		loadZipCode();
	});

	$("#btn-barcode").click(function(){
		claimNo = '';
		if($('#txt-barcode').val() == ''){
			$('#txt-barcode').focus();
		}else{
			/*$('#customer_address .txt-input').each(function(){
				$(this).val("")
			});*/
			//loadZipCode();
			$('#claim_description').val('');
			$('#file1').val('');
			$('#file2').val('');
			$('#file3').val('');
			$('#file4').val('');

			$('#alert-barcode_exist').hide();
			$("#tab-warranty-not_exist").hide();
			$("#tab-warranty-info").hide();
			$('#dv-claim').hide();
			$('#form-success').hide();
			$('#dv-claim_info').hide();
			//$('#dv-track').hide();
			$('#alert-trackno').hide();
			$('#form-loading').hide();
			$("#tab-warranty-load").show();

			$('#tabbarcode').hide();
			barcodeExist();
		}
		$('html, body').animate({ scrollTop: 0 }, 'fast');
	});
	$("#txt-barcode").keyup(function(event){
		if(event.keyCode == 13){
			$("#btn-barcode").click();
		}
	});


	$(document).submit(function(e){ // Disable Enter Key //
		return false;
	});

	$("#btn-submit_claiminfo").click(function(){
		$('html, body').animate({ scrollTop: 0 }, 'fast');
		$('#imgClaim_2').hide();
		submitClaim();
	});

	$("#btn-claim_next").click(function(){
		$('#claimNo3').html('<b>เลขที่การเคลม</b> <h2 class="text-danger">'+ claimNo +'</h2>');
		$('#dv-lineat').show();
		$('#dv-claim_info').hide();
		$('html, body').animate({ scrollTop: 0 }, 'fast');
	});

	$("#btn-claim_pre").click(function(){
		loadProvince();
		$('#dv-claim_info').hide(); 
		$('#dv-claim').show();
		$('#tab-warranty-info').show();
		$('html, body').animate({ scrollTop: 0 }, 'fast');
	});

	/*$("#btn-done").click(function(){
		$('#claimNo_done').html('<b>เลขที่การเคลม</b> <h2 class="text-danger">'+ claimNo +'</h2>');
		$('#dv-lineat').hide();
		$('#dv-done').show();
		$('html, body').animate({ scrollTop: 0 }, 'fast');
	});*/

	$("#btn-logout_claim").click(function(){
		logout();
	});
});


function warrantyInfo(chkBarcode){
	//loadAddress();
	var barcode_info = ((typeof chkBarcode != 'undefined' && chkBarcode != '') ? $.trim(chkBarcode) : $.trim($('#txt-barcode').val()));
	$.post($('#apiUrlSite').val()+'/warranty/info', {
		apiKey: $('#apiKey').val(),
		barcode: barcode_info
	}, function(data){
		if (data.success) {
			if (data.result.length != 0){
				if (chkClaim){
					claimInformation(data)
				}else{
					$('#product').html(data.result.product);
					$('#barcode').html(data.result.barcode);
					$('#lastShop').html(data.result.shop);
					sellNo = data.result.sellNo;
					sellPrice = data.result.sellPrice;
					sellDate = moment(data.result.sellDate).lang('en').format('MM/DD/YYYY');

					$('#tab-ProductName').html('<b>ชื่อสินค้า : </b>'+data.result.productName);
					$('#tab-Barcode').html('<b>หมายเลข Barcode : </b>'+data.result.barcode);
					var sellDateYearTH = parseInt(moment(data.result.sellDate).lang('th').format('YYYY'))+543;
					var sellDateMM = moment(data.result.sellDate).locale('th').format('MMMM');
					//$('#tab-SellDate').html(sellDateMM+' '+sellDateYearTH);
					var expireDateYearTH = parseInt(moment(data.result.expireDate).lang('th').format('YYYY'))+543;
					var expireDateMM = moment(data.result.expireDate).locale('th').format('MMMM');
					if(data.result.warranty == 0){
						$('#tab-warrantyStatus').html('<b>สถานะ : </b><b><u>สินค้าไม่มีประกัน</u><b>');
						$('#tab-warrantyStatus').removeClass('text-success');
						$('#tab-warrantyStatus').removeClass('text-danger');
						$('#tab-warrantyStatus').addClass('text-warning');
						//$('#tab-ExpireDate').html('');
						$('#tab-warranty-info').removeClass('panel-success');
						$('#tab-warranty-info').removeClass('panel-danger');
						$('#tab-warranty-info').addClass('panel-warning');

						$('#tabbarcode').show();
					}
					else if(data.result.warranty > 0 && data.result.daysRemaining <= 0){
						$('#tab-warrantyStatus').html('<b>สถานะ : </b><b><u>หมดประกัน</u><b>');
						$('#tab-warrantyStatus').removeClass('text-success');
						$('#tab-warrantyStatus').removeClass('text-warning');
						$('#tab-warrantyStatus').addClass('text-danger');
						//$('#tab-ExpireDate').html(expireDateMM+' '+expireDateYearTH);
						$('#tab-warranty-info').removeClass('panel-success');
						$('#tab-warranty-info').removeClass('panel-warning');
						$('#tab-warranty-info').addClass('panel-danger');

						$('#tabbarcode').show();
					}
					else{
						//if(loadAddressComplete){
							$('#tab-warrantyStatus').html('<b>สถานะ : </b><b><u>อยู่ในประกัน</u><b>');
							$('#tab-warrantyStatus').removeClass('text-danger');
							$('#tab-warrantyStatus').removeClass('text-warning');
							$('#tab-warrantyStatus').addClass('text-success');
							//$('#tab-ExpireDate').html(expireDateMM+' '+expireDateYearTH);
							$('#tab-warranty-info').removeClass('panel-danger');
							$('#tab-warranty-info').removeClass('panel-warning');
							$('#tab-warranty-info').addClass('panel-success');

							$('#dv-claim').show();
							$('#imgClaim_2').show();

						//}else{
							//loadAddress();
						//}

					}
					$('#tab-warranty-info').show();
					$("#tab-warranty-load").hide();
					$('#claimModal').animate({ scrollTop: 0 }, 'fast');
				}
			}

		}else{
			$('#tab-warranty-not_exist').show();
			$('#tabbarcode').show();
			$("#tab-warranty-load").hide();
		}

	},'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
};


function loadProvince(){
	$.post($('#apiUrlSite').val()+'/province/list', {
		apiKey: $('#apiKey').val()
	}, function(data){
			if (data.success) {
				var html = '';
				for( i=0; i<data.result.length; i++ ) {
					var result = data.result[i];
					html += '<option value="'+ result.id +'"'+
						((result.name == $('#province').attr('data-selected') || ($('#province').attr('data-selected') == '' && result.id == '1')) ? ' selected' : '')
						+'>'+ result.name +'</option>';
				}
				$('#province').html( html );
				loadAddress();
			}
	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
};
function loadDistrict(){
	$.post($('#apiUrlSite').val()+'/province/district', {
		apiKey: $('#apiKey').val(),
		province: $('#province').val(),
	}, function(data){
			if (data.success) {
				var html = '';
				for( i=0; i<data.result.length; i++ ) {
					var result = data.result[i];
					html += '<option value="'+ result.id +'" data-zipcode="'+ result.zipcode +'"'+
						((result.id == $('#district').attr('data-selected') && result.zipcode == $('#district').attr('data-zipcode')) ? ' selected' : '')
						+'>'+ result.name +'</option>';

				}
				$('#district').html( html );
				loadZipCode();
			}
	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
};
function loadZipCode(){
	$('#txt-zipcode').val( $('#district :selected').attr('data-zipcode') );
};

function uploadFile(){
	$('#claimModal').animate({ scrollTop: 0 }, 'fast');
	$('#dv-claim').hide();
	$('#tab-warranty-info').hide();
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

	if ( fileCount == 0 ){
		if(claimNo == ''){
			addClaim();
		}else{
			claimUpdate();
		}		
	}  
};
//https://img.remaxthailand.co.th/500x500/product/D1600532/1.jpg
function upload(file, index){
	var fd = new FormData();
	fd.append("index", index);
	fd.append("mobile", $.trim($('#txt-tel').val()));
	fd.append("type", 'claim');
	fd.append("dir", 'remax');
    fd.append('myFile', file);

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

	xhr.onload = function() {
		if (this.status == 200) {
			var json = JSON.parse(this.response);
			if ( json.success ) {
				fileName += json.filename + '|';
				if (allProgress == 100){
					allProgress = 0;
					if(claimNo == ''){
						addClaim();
					}else{
						claimUpdate();
					}	

				}
			}
		};
	};
	xhr.send(fd);
};

function submitClaim(){
	var isComplete = true;
	if ($('#claim_description').val() != ''){
			$('#customer_address .txt-require').each(function(){
				$(this).val( $.trim($(this).val()) );
				if ( $(this).val() == '' ) {
					$(this).parents('.form-group').addClass('has-error');
					$(this).focus();
					isComplete = false;
					return false;
				}
				else {
					$(this).parents('.form-group').removeClass('has-error');
				}
			});

			if (isComplete) {
				uploadFile();
			}
	}else{
		if ($('#claim_description').val() == ''){
			$('html, body').animate({ scrollTop: 0 }, 'fast');
			$('#claim_description').focus();
		}

		$("#alert-claim_info").fadeIn();
		setTimeout('$("#alert-claim_info").fadeOut()',4000);
	}

};

function addClaim(){
	if ($('#username').val() != '' && typeof $('#username').val() != 'undefined'){
		_username = $('#username').val();
	}
$.post($('#apiUrlSite').val()+'/claim/add', {
		apiKey: $('#apiKey').val(),
		shop: $('#shop').val(),
		from : 'W', // W is From Website
		barcode: $('#barcode').html(),
		product: $('#product').html(),
		description: $('#claim_description').val(),
		firstname: $('#txt-firstname').val(),
		lastname: $('#txt-lastname').val(),
		nickname: $('#txt-nickname').val(),
		address: $('#txt-address').val(),
		address2: $('#txt-address2').val(),
		province: $('#province :selected').html(),
		district: $('#district :selected').html(),
		subDistrict: $('#txt-sub_district').val(),
		zipcode: $('#txt-zipcode').val(),
		tel: $('#txt-tel').val(),
		email: $('#txt-email').val(),
		images: fileName,
		lastShop: $('#lastShop').html(),
		sellNo: sellNo,
		sellPrice: sellPrice,
		usernameClaim: _username,
		customerLineId: $('#txt-lineid').val(),
		claimType: '',
		sellDate: sellDate
	}, function(data){
			if (data.success) {
				claimNo = data.result[0].claimNo;
				$('#claim-Massage').hide();
				//$('#claim-Massage').html(' * กรุณานำเลขที่การเคลมอ้างอิงกับเจ้าหน้าที่เพื่อติดตามสถานะงานเคลมที่ Line @remaxserive ค่ะ').addClass('text-success');
				$('#claim-ClaimNo').html('<b>เลขที่การเคลม: </b>'+ '<b class="text-danger">' + claimNo + '</b>');
				//$('#claim-ClaimStatus').html('<b>สถานะ : </b>'+ (data.result[0].status == 'CI' ? ' <u>ตรวจสอบข้อมูล </u>' : '-')).addClass('text-danger');
				$('#claim-ProductName').html($('#tab-ProductName').html());
				$('#claim-Barcode').html($('#tab-Barcode').html());
				$('#claim-Description').html('<b>รายละเอียด : </b>'+$('#claim_description').val());

				$('#sum-name').html('คุณ '+$('#txt-firstname').val()+' '+$('#txt-lastname').val()+($('#txt-nickname').val() != '' ? ' ('+$('#txt-nickname').val()+')' : ''));
				$('#sum-address').html($('#txt-address').val())
				$('#sum-address2').html($('#txt-address2').val())
				$('#sum-location').html('แขวง/ตำบล'+$('#txt-sub_district').val()+' '+'เขต/อำเภอ'+$('#district :selected').html()+' '+'จังหวัด'+$('#province :selected').html()+' '+$('#txt-zipcode').val())
				if ( $('#txt-tel').val().length == 10 ) {
					var mobile = $('#txt-tel').val();
					$('#sum-tel').html('เบอร์โทร '+ mobile.substr(0, 3)+'-'+mobile.substr(3, 4)+'-'+mobile.substr(7, 3) );
				}else{$('#sum-tel').html('เบอร์โทร '+$('#txt-tel').val())}
				$('#sum-email').html($('#txt-email').val() != '' ? 'อีเมล '+$('#txt-email').val() : '')
				$('#sum-lineid').html($('#txt-lineid').val() != '' ? 'Line ID '+$('#txt-lineid').val() : '')

				/*var modal = $('#dv-claim_info');
				var file = convertDataToArray('|', fileName);
				if (typeof file != 'undefined') {
					for(i=0; i<=3; i++) {
						modal.find('.img'+i+' img').attr('src', 'https://res.cloudinary.com/powerdd/image/upload/v1438076463/0875665456-1.jpg');
						modal.find('.img'+i+' a').attr('href', '#');
						if (typeof file[i] != 'undefined' && file[i] != '') {
							modal.find('.img'+i).show().find('img').attr('src', file[i]);
							modal.find('.img'+i).show().find('a').attr('href', file[i]);
						}
						else {
							modal.find('.img'+i).hide();
						}
					}
				}
				else {
					for(i=0; i<=3; i++) modal.find('.img'+i).hide();
				}*/
				$('#form-loading').hide();
				$('#dv-claim_info').show();
				//$('#dv-track').show();
				$('html, body').animate({ scrollTop: 0 }, 'fast');
			}
	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
};

function claimUpdate(){
	$.post($('#apiUrlSite').val()+'/claim/update', {
	apiKey: $('#apiKey').val(),
	shop: $('#shop').val(),
	id: claimNo,
	column: 'description,firstname,lastname,nickname,address,address2,province,district,subDistrict,zipcode,tel,email,customerLineId',
	value: $('#claim_description').val()+','+$('#txt-firstname').val()+','+$('#txt-lastname').val()+','+$('#txt-nickname').val()+','+$('#txt-address').val()+','+$('#txt-address2').val()+','+$('#province :selected').html()+','+$('#district :selected').html()+','+$('#txt-sub_district').val()+','+$('#txt-zipcode').val()+','+$('#txt-tel').val()+','+$('#txt-email').val()+','+$('#txt-lineid').val()
	}, function(data){
		if (data.success) {
			claimData(claimNo);
		}
	},'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}

function claimData(claimNo){
	delete claimInfo;
	$.post($('#apiUrlSite').val()+'/claim/info', {
		apiKey: $('#apiKey').val(),
		shop: '',
		id: claimNo,
		barcode: '',
		claimdate_from: '',
		claimdate_to: '',
		status: '',
		firstname: '',
		lineid: '',
		tel: ''
	}, function(data){
			if (data.success) {
				if(data.result[0].length > 0){
					claimInfo = data.result[0][0];
					productInfo(data.result[0][0].barcode);
				}
			}
	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
};

function productInfo(barcode_info){
	$('html, body').animate({ scrollTop: 0 }, 'fast');
	$.post($('#apiUrlSite').val()+'/warranty/info', {
		apiKey: $('#apiKey').val(),
		barcode: barcode_info
	}, function(data){
		if (data.success) {
			if (data.result.length != 0){
				
				$('#claim-Massage').hide();
				//$('#claim-Massage').html(' * กรุณานำเลขที่การเคลมอ้างอิงกับเจ้าหน้าที่เพื่อติดตามสถานะงานเคลมที่ Line @remaxserive ค่ะ').addClass('text-success');
				$('#claim-ClaimNo').html('<b>เลขที่การเคลม: </b>'+ '<b class="text-danger">' + claimNo + '</b>');
				//$('#claim-ClaimStatus').html('<b>สถานะ : </b>'+ (data.result[0].status == 'CI' ? ' <u>ตรวจสอบข้อมูล </u>' : '-')).addClass('text-danger');
				$('#claim-ProductName').html($('#tab-ProductName').html());
				$('#claim-Barcode').html($('#tab-Barcode').html());
				$('#claim-Description').html('<b>รายละเอียด : </b>'+$('#claim_description').val());

				$('#sum-name').html('คุณ '+$('#txt-firstname').val()+' '+$('#txt-lastname').val()+($('#txt-nickname').val() != '' ? ' ('+$('#txt-nickname').val()+')' : ''));
				$('#sum-address').html($('#txt-address').val())
				$('#sum-address2').html($('#txt-address2').val())
				$('#sum-location').html('แขวง/ตำบล'+$('#txt-sub_district').val()+' '+'เขต/อำเภอ'+$('#district :selected').html()+' '+'จังหวัด'+$('#province :selected').html()+' '+$('#txt-zipcode').val())
				if ( $('#txt-tel').val().length == 10 ) {
					var mobile = $('#txt-tel').val();
					$('#sum-tel').html('เบอร์โทร '+ mobile.substr(0, 3)+'-'+mobile.substr(3, 4)+'-'+mobile.substr(7, 3) );
				}else{$('#sum-tel').html('เบอร์โทร '+$('#txt-tel').val())}
				$('#sum-email').html($('#txt-email').val() != '' ? 'อีเมล '+$('#txt-email').val() : '')
				$('#sum-lineid').html($('#txt-lineid').val() != '' ? 'Line ID '+$('#txt-lineid').val() : '')
				
				$('#form-loading').hide();
				$('#dv-claim_info').show();
				//$('#dv-track').show();
				
			}
		}
	},'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
};

function convertDataToArray(sign, data) {
	if (data == null) {
		var arr = [];
		return arr;
	}
	else if ( data.indexOf(sign) != -1) {
		var sp = data.split(sign);
		for(i=0; i<sp.length; i++) sp[i] = sp[i].trim();
		return sp;
	}
	else {
		var arr = [data];
		return arr;
	}
};

function login() {
	$.post('https://24fin-api.remaxthailand.co.th/member/login', {
		apiKey: apiKey24,
		username: $.trim($('#username').val()),
		password: $('#password').val(),
		remember: ($("#remember").is(':checked'))? 1 : 0
	}, function(data) {
		if (data.success) {
			if(data.correct){
				$('#message').html( '<i class="fa fa-spinner fa-pulse"></i> กำลังเข้าสู่ระบบ กรุณารอสักครู่ค่ะ' ).addClass('text-primary').removeClass('text-danger');
				setCookie("memberKey", data.authKey, 365);
				$('#hTitle').html('ส่งข้อมูลสินค้าเคลม ('+'คุณ'+ data.name +')');
				$('#tablogin').hide();
				$('#btn-logout_claim').show();
				$('#tabbarcode').show();

			}else{
				$('#btn-login').removeClass('disabled');
				$('#username, #password').removeAttr('disabled');
				$('#message').html( '<i class="fa fa-warning"></i> ชื่อผู้ใช้ หรือ รหัสผ่านไม่ถูกต้องค่ะ' ).addClass('text-danger').removeClass('text-primary');
			}

		}
		else {
			$('#btn-login').removeClass('disabled');
			$('#username, #password').removeAttr('disabled');
			$('#message').html( '<i class="fa fa-warning"></i> ชื่อผู้ใช้ หรือ รหัสผ่านไม่ถูกต้องค่ะ' ).addClass('text-danger').removeClass('text-primary');
		}
	});
};

function logout() {
	$.post('https://24fin-api.remaxthailand.co.th/member/logout', {
		apiKey: apiKey24,
		authKey: getCookie("memberKey")
	}, function(data) {
		if (data.success) {
			//claimClick();
			location.reload();
		}
	});
};

function loadAddress(){
	if ($('#username').val() != '' && typeof $('#username').val() != 'undefined'){
		_username = $('#username').val();
	}
	$.post($('#apiUrlSite').val()+'/claim/customerAddress', {
		apiKey: $('#apiKey').val(),
		username: _username
	}, function(data){
			
			if (data.success) {
				if(data.result.length != 0){
					$('#txt-firstname').val(data.result[0].firstname);
					$('#txt-lastname').val(data.result[0].lastname);
					$('#txt-nickname').val(data.result[0].nickname);
					$('#txt-address').val(data.result[0].address);
					$('#txt-address2').val(data.result[0].address2);					
					$('#txt-tel').val(data.result[0].tel);
					$('#txt-email').val(data.result[0].email);
					$('#txt-lineid').val(data.result[0].customerLineId);
					
					

					findProvinceID(data.result[0].province,data.result[0].district,data.result[0].subDistrict);

				} 
			} else {
					loadDistrict();
				}

	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
};

function findProvinceID(province,district,sub_district){

	$.post($('#apiUrlSite').val()+'/province/IdByName', {
		apiKey: $('#apiKey').val(),
		province: province,
		district: district
	}, function(data){
		if (data.success) {
			$('#district').attr('data-selected', data.result[0].districtId).attr('data-zipcode', data.result[0].zipcode);
			$('#province').val( data.result[0].provinceId ).attr('data-selected', data.result[0].proviprovinceIdnce);
			$('#txt-sub_district').val(sub_district);
			$('#txt-zipcode').val(data.result[0].zipcode);
		}
		loadDistrict();
	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
};

function setCookie(cname, cvalue, exphr) {
    var d = new Date();
    d.setTime(d.getTime() + (exphr*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
};

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
};

function checkUser(){
	$.post('https://24fin-api.remaxthailand.co.th/member/info/auth', {
		authKey: getCookie("memberKey")
	}, function(data){
		if (data.success) {
			if(data.correct){
				if(data.result[0].length > 0 ){
					_username = data.result[0][0].username;
					
					//loadAddress();
					$('#hTitle').html('ส่งข้อมูลสินค้าเคลม ('+'คุณ'+ data.result[0][0].name +')');
					$('#tablogin').hide();
					$('#tab-warranty-load').hide();
					$('#btn-logout_claim').show();
					$('#tabbarcode').show();
				}else{
					$('#tab-warranty-load').hide();
					$('#tablogin').show();
				}
			}else{
				$('#tab-warranty-load').hide();
				$('#tablogin').show();
			}
		}
		else {
			$('#tab-warranty-load').hide();
			$('#tablogin').show();
		}
		loadProvince();
	});
};

function barcodeExist(){
	$.post($('#apiUrlSite').val()+'/claim/barcodeExist', {
		apiKey: $('#apiKey').val(),
		barcode: $.trim($('#txt-barcode').val())
	}, function(data){
		if (data.success) {
			if (data.result[0].exist) {
				$('#tab-warranty-load').hide();
				$('#alert-barcode_exist').show();
			}else{
				$('#alert-barcode_exist').hide();
				warrantyInfo();
			}
		}else{
			$('#alert-barcode_exist').hide();
			warrantyInfo();
		}
	});
	
};
