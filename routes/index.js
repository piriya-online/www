var request = require('request');

exports.index = function(req, res, data){
	if (data.screen == 'index') {
		data.title = 'หน้าหลัก : ' + data.systemName;
		data.description = 'หน้าหลัก';
	}else if(data.screen == 'claim_info'){
		data.title = 'ข้อมูลการเคลม : ' + data.systemName;
		data.description = 'ข้อมูลการเคลม';
	}else if(data.screen == 'shop_register'){
		data.title = 'สนใจเปิดช็อป : ' + data.systemName;
		data.description = 'สนใจเปิดช็อป';
	}else if(data.screen == 'payment'){
		data.title = 'วิธีการชำระเงิน : ' + data.systemName;
		data.description = 'วิธีการชำระเงิน';
	}else if(data.screen == 'contact_us'){
		data.title = 'ติดต่อเรา : ' + data.systemName;
		data.description = 'ติดต่อเรา';
	}else if(data.screen == 'about_us'){
		data.title = 'เกี่ยวกับเรา : ' + data.systemName;
		data.description = 'เกี่ยวกับเรา';
	}else if(data.screen == 'warranty_condition'){
		data.title = 'เงื่อนไขการรับประกัน : ' + data.systemName;
		data.description = 'เงื่อนไขการรับประกัน';
	}else if(data.screen == 'category'){
		data.title = 'หมวดหมู่สินค้า : ' + data.systemName;
		data.description = 'หมวดหมู่สินค้า';
	}else if(data.screen == 'register'){
		data.title = 'สมัครตัวแทนจำหน่าย : ' + data.systemName;
		data.description = 'สมัครตัวแทนจำหน่าย';
	}else if(data.screen == 'premium_product'){
		data.title = 'สินค้าพรีเมี่ยม : ' + data.systemName;
		data.description = 'สินค้าพรีเมี่ยม';
	}else if(data.screen == 'shop'){
		data.title = 'Remax Shop : ' + data.systemName;
		data.description = 'Remax Shop';
	}else if(data.screen == 'claim_status'){
		data.title = 'ตรวจสอบสถานะการเคลม : ' + data.systemName;
		data.description = 'ตรวจสอบสถานะการเคลม';
	}else if(data.screen == 'event_checkprice'){
		data.title = 'เช็คราคางานอีเว้นท์ : ' + data.systemName;
		data.description = 'เช็คราคางานอีเว้นท์';
	}else if(data.screen == 'wk_event_checkprice'){
		data.title = 'เช็คราคางานอีเว้นท์ : ' + data.systemName;
		data.description = 'เช็คราคางานอีเว้นท์';
	}else if(data.screen == 'search'){
		data.title = 'ผลการค้นหา : ' + data.systemName;
		data.description = 'ผลการค้นหา';
	}else if(data.screen == 'order-detail'){
		data.title = 'สถานที่เก็บสินค้า : ' + data.systemName;
		data.description = 'สถานที่เก็บสินค้า';
	}else if(data.screen == 'product-location'){
		data.title = 'สถานที่เก็บสินค้า : ' + data.systemName;
		data.description = 'สถานที่เก็บสินค้า';
	}

	//## Get Category Menu ##//
	try{
		request.post({headers: { 'referer': 'https://'+req.headers['x-host'] }, url: data.apiUrl+'/category/info',
			form: {
				apiKey: data.apiKey,
				shop: data.shop
			}
		},
		function (error, response, body) {
			if (!error) {
				var json = JSON.parse(body);
				findAndRemove(json.result,'category', '24');
				data.category = json.result;
				if(data.screen == 'category'){
					data.categorySelected = data.subUrl;
					exports.getProductByCategory(req, res, data);
				}else if(data.screen == 'product'){
					var url = req.url.split('-');
					data.productId = url[url.length-1];
					exports.getProductByItem(req, res, data);
				}else if(data.screen == 'premium_product'){
					data.categorySelected = data.subUrl;
					exports.getProductByCategoryPremium(req, res, data);
				}else if(data.screen == 'shop_register'){
					exports.getShop(req, res, data);
				}else if(data.screen == 'shop'){
					data.shopCode = data.subUrl;
					exports.getShopDetail(req, res, data);
				}else if(data.screen == 'search'){
					data.shopCode = data.subUrl;
					exports.getProductByName(req, res, data);
				}else{
					res.render(data.screen, { data: data });
				}

			} else{
				data.error = error.message;
				data.stack = error.stack;
				res.render('error', { data: data });
			}
		});


	}
	catch(error) {
		data.error = error.message;
		data.stack = error.stack;
		res.render('error', { data: data });
	}
	//## End Get Category Menu ##//

};


//## Get Product by Category ##//
exports.getProductByCategoryPremium = function(req, res, data){
	try{
		request.post({headers: { 'referer': 'https://'+req.headers['x-host'] }, url: data.apiUrl+'/product/info',
			form: {
				apiKey: data.apiKey,
				shop: data.shop,
				type: 'byCategoryUrl4Web',
				value: 'premium'
			} 
		},
		function (error, response, body) {
			if (!error) {
				var json = JSON.parse(body);
				data.product = json.result;
				//res.send(data);
				res.render(data.screen, { data: data});
			} else{
				data.error = error.message;
				data.stack = error.stack;
				res.render('error', { data: data });
			}
		});
	}
	catch(error) {
		data.error = error.message;
		data.stack = error.stack;
		res.render('error', { data: data });
	}
};

exports.getProductByCategory = function(req, res, data){
	try{
		request.post({headers: { 'referer': 'https://'+req.headers['x-host'] }, url: data.apiUrl+'/product/info',
			form: {
				apiKey: data.apiKey,
				shop: data.shop,
				type: 'byCategoryUrl4Web',
				value: data.subUrl
			}
		},
		function (error, response, body) {
			if (!error) {
				var json = JSON.parse(body);
				data.product = json.result;
				//res.send(data);
				res.render(data.screen, { data: data});
			} else{
				data.error = error.message;
				data.stack = error.stack;
				res.render('error', { data: data });
			}
		});
	}
	catch(error) {
		data.error = error.message;
		data.stack = error.stack;
		res.render('error', { data: data });
	}
};
//## Get Product by Item ##//
exports.getProductByItem = function(req, res, data){
	try{
		request.post({headers: { 'referer': 'https://'+req.headers['x-host'] }, url: data.apiUrl+'/product/info',
			form: {
				apiKey: data.apiKey,
				shop: data.shop,
				type: 'item',
				value: data.productId
			}
		},
		function (error, response, body) {
			if (!error) {
				var json = JSON.parse(body);
				data.productDetail = json.result;
				//res.send(data.product);
				data.title = data.productDetail.name+' : '+ data.systemName;
				data.description = data.productDetail.detail;
				res.render(data.screen, { data: data});
			} else{
				data.error = error.message;
				data.stack = error.stack;
				res.render('error', { data: data });
			}
		});
	}
	catch(error) {
		data.error = error.message;
		data.stack = error.stack;
		res.render('error', { data: data });
	}
};

exports.getProductByName = function(req, res, data){
	try{
		request.post({headers: { 'referer': 'https://'+req.headers['x-host'] }, url: data.apiUrl+'/product/info',
			form: {
				apiKey: data.apiKey,
				shop: data.shop,
				type: 'byProductName',
				value: data.subUrl.replace(/%20/g, ' ')
			}
		},
		function (error, response, body) {
			if (!error) {
				var json = JSON.parse(body);
				data.product = json.result;
				//res.send(data);
				res.render(data.screen, { data: data});
			} else{
				data.error = error.message;
				data.stack = error.stack;
				res.render('error', { data: data });
			}
		});
	}
	catch(error) {
		data.error = error.message;
		data.stack = error.stack;
		res.render('error', { data: data });
	}
};

exports.getShop = function(req, res, data){
	try{
		request.post({headers: { 'referer': 'https://'+req.headers['x-host'] }, url: data.apiUrl+'/shop/detail',
			form: {
				apiKey: data.apiKey,
				shop: ''
			} 
		},
		function (error, response, body) {
			if (!error) {
				var json = JSON.parse(body);
				data.shopDetail = json.result;
				//res.send(data);
				res.render(data.screen, { data: data});
			} else{
				data.error = error.message;
				data.stack = error.stack;
				res.render('error', { data: data });
			}
		});
	}
	catch(error) {
		data.error = error.message;
		data.stack = error.stack;
		res.render('error', { data: data });
	}
};

exports.getShopDetail = function(req, res, data){
	try{
		request.post({headers: { 'referer': 'https://'+req.headers['x-host'] }, url: data.apiUrl+'/shop/detail',
			form: {
				apiKey: data.apiKey,
				shop: data.shopCode
			} 
		},
		function (error, response, body) {
			if (!error) {
				var json = JSON.parse(body);
				data.shopDetailData = json.result[0];

				//res.send(data);

				if ( json.result[0].image != '' )
				{
					var imageList = json.result[0].image.split(',');
					data.shopImage = imageList;	
				} else{
					data.shopImage = '';
				}
				

				res.render(data.screen, { data: data});
			} else{
				data.error = error.message;
				data.stack = error.stack;
				res.render('error', { data: data });
			}
		});
	}
	catch(error) {
		data.error = error.message;
		data.stack = error.stack;
		res.render('error', { data: data });
	}
};

function findAndRemove(array, property, value) {
  array.forEach(function(result, index) {
    if(result[property] === value) {
      //Remove from array
      array.splice(index, 1);
    }    
  });
}