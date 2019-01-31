var http = require('http')
	, express = require('express')
	, favicon = require('serve-favicon')
	, fs = require('fs')
	, path = require('path')
	, methodOverride = require('method-override')
	, bodyParser = require('body-parser')
	, errorHandler = require('errorhandler')
	, routes = require('./routes')
	//, sitemap = require('express-sitemap');
	, robots = require('express-robots')
	, os = require("os");

global.config = require('./config.js');

var app = express();

app.set('port', config.port || 9999);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(favicon(__dirname + '/favicon.ico'));
app.use(methodOverride());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(robots(__dirname + '/robots.txt'));

if ('development' == app.get('env')) {
	app.use(errorHandler());
}

app.get('*', function(req, res) {
	//## Initial Data ##//	
	data = {};
	data.screen = 'index';
	data.shop = config.shop;
	data.apiUrl = config.apiUrl;
	data.apiUrlSite = config.apiUrlSite;
	data.apiKey = config.apiKey;
	data.websiteUrl = config.systemUrl;
	data.systemUrl = config.systemUrl;
	data.systemName = config.systemName;
	data.categorySelected = '';
	//data.Moment = require('moment');
	data.viewsPath = config.viewsPath;
	data.javascriptPath = config.javascriptPath;

	var url = req.url.split('/');
	url = url.filter(function(n){ return n !== ''; });
	data.url = url;
	if ( url.length != undefined && url.length >= 1 ) {
		data.screen = url[0];
		fs.exists(data.viewsPath + data.screen + '.jade', function (exists) {
			if (exists) {			
				fs.exists(data.javascriptPath + data.screen + '.js', function (exists) {
					data.script = (exists) ? '/javascripts/' + data.screen + '.js' : '';
					data.subUrl = (url.length == 1 ) ? '' : url[1];
					routes.index(req, res, data);
				});	
			}
			else {
				routes.index(req, res, data);
			}
		});
	}
	else {
		routes.index(req, res, data);
	}
});

var server = http.createServer(app);
server.listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port') + ' at '+os.hostname());
});
