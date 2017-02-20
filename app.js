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

// http://localhost:8080/?r_min=4&r_max=70&g_min=4&g_max=40&b_min=4&b_max=40&url=http://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Aqua_CorrectedReflectance_TrueColor/default/2017-01-25/GoogleMapsCompatible_Level9/7/78/37.jpeg

function validateParams(queryData){
	if(!queryData) return false;
	if(!queryData.url) return false;
	if(!queryData.r_min) return false;
	if(!queryData.r_max) return false;
	if(!queryData.g_min) return false;
	if(!queryData.g_max) return false;
	if(!queryData.b_min) return false;
	if(!queryData.b_max) return false;
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

				// RED
				var red = this.bitmap.data[ idx + 0 ];
				if(red >= queryData.r_min && red <= queryData.r_max){
					red = rescale(red, queryData.r_min, queryData.r_max, 0, 255);
				}
				else if(red < queryData.r_min) {
					red = 0;
				}
				else if(red > queryData.r_max) {
					red = 255;
				}
				this.bitmap.data[ idx + 0 ] = red;

				// GREEN
				var green = this.bitmap.data[ idx + 1 ];
				if(green >= queryData.g_min && green <= queryData.g_max){
					green = rescale(green, queryData.g_min, queryData.g_max, 0, 255);
				}
				else if(green < queryData.g_min) {
					green = 0;
				}
				else if(green > queryData.g_max) {
					green = 255;
				}
				this.bitmap.data[ idx + 1 ] = green;

				// BLUE
				var blue = this.bitmap.data[ idx + 2 ];
				if(blue >= queryData.b_min && blue <= queryData.b_max){
					blue = rescale(blue, queryData.b_min, queryData.b_max, 0, 255);
				}
				else if(blue < queryData.b_min) {
					blue = 0;
				}
				else if(blue > queryData.b_max) {
					blue = 255;
				}
				this.bitmap.data[ idx + 2 ] = blue;

				if(red == 255 && green == 255 && blue == 255){
					this.bitmap.data[ idx + 3 ] = 0;
				}

			});

			image.getBuffer('image/png', function(err, buffer){

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

function rescale(value, oldMin, oldMax, newMin, newMax){
	var oldRange = oldMax - oldMin;
	var newRange = newMax - newMin;
	return Math.round( ((value - oldMin) * newRange / oldRange) + newMin );
}

