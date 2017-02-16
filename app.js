var express = require("express");
var cors = require('cors');
var url = require('url');
var app = express();
var port = process.env.PORT || 8080;
var Jimp = require("jimp");

// cors config
var whitelist = [
	'http://localhost:3000',
	'http://danwild.github.io'
];

var corsOptions = {
	origin: function(origin, callback){
		var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
		callback(null, originIsWhitelisted);
	}
};

// http://localhost:8080/?red=0&green=5.5&blue=6&url=http://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Aqua_CorrectedReflectance_TrueColor/default/2017-01-25/GoogleMapsCompatible_Level9/7/78/37.jpeg


function validateParams(queryData){
	if(!queryData) return false;
	if(!queryData.url) return false;
	if(!queryData.red) return false;
	if(!queryData.green) return false;
	if(!queryData.blue) return false;
	return true;
}

app.listen(port, function(err){
	console.log("running server on port "+ port);
});

app.get('/', cors(corsOptions), function(req, res){

	var queryData = url.parse(req.url, true).query;
	if(!validateParams(queryData)) res.end('Invalid request params');

	Jimp.read(queryData.url, function (err, image) {

		if(err){
			console.log('err');
			console.log(err);
		}
		else {

			image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
				// x, y is the position of this pixel on the image
				// idx is the position start position of this rgba tuple in the bitmap Buffer
				// this is the image

				var red = this.bitmap.data[ idx + 0 ];
				red = red * queryData.red;
				this.bitmap.data[ idx + 0 ] = red;

				var green = this.bitmap.data[ idx + 1 ];
				green = green * queryData.green;
				this.bitmap.data[ idx + 1 ] = green;

				var blue  = this.bitmap.data[ idx + 2 ];
				blue = blue * queryData.blue;
				this.bitmap.data[ idx + 2 ] = blue;

			});

			image.getBuffer('image/jpeg', function(err, buffer){

				if(err){
					res.end(err);
				}
				else {
					res.end(buffer);
				}
			});
		}

	});


});

