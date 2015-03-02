var AlchemyAPI = require('../lib/alchemy/alchemyapi');
var alchemyapi = new AlchemyAPI();
var unirest = require('unirest');
var request = require('request');
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.render('index', {});
});

router.get('/alchemy', function(req, res, next) {	
	request('http://bldata.herokuapp.com/images/random', function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	    var url = JSON.parse(response.body).flickr_thumb_jpeg;
		alchemyapi.image_keywords('url', url, {}, function(response) {
			res.render( 'image', { title:'Alchemy API' ,url: response.url, results: response.imageKeywords } );
		});
	  } else {
	  	console.log(error);
	  	res.send('<h2>ERROR<h2><br>' + error);
	  }
	});
});

router.get('/camfind',function(req, res, next) {
	request('http://bldata.herokuapp.com/images/random', function (error, response, body) {
	  if (!error && response.statusCode == 200) {
		var url = JSON.parse(response.body).flickr_thumb_jpeg;
		request.post({
			url : 'https://camfind.p.mashape.com/image_requests',
			headers: {
				'X-Mashape-Key':'0PHOUEsrVsmsh4kV3i9X5FFqfof4p1maU5Vjsn62WwTuW8AIxn',
				'Content-Type' :'application/x-www-form-urlencoded',
				'Accept' : 'application/json'
			},
			form:{
				focus : {
					x: 480,
					y: 640
				},
				image_request : {
					locale: 'en_US',
					remote_image_url : url
				}
			}
		}, function (error, httpResponse, body){
			console.log(body);
			console.log(JSON.parse(body));
			console.log(JSON.parse(body).token);
			var uri = 'https://camfind.p.mashape.com/image_responses/';
			console.log('uri >>>' + uri.concat(JSON.parse(body).token));
			var uriFinal = uri.concat(JSON.parse(body).token) ;
			/*
			var options = {
				url: uriFinal ,
				headers :{
					'X-Mashape-Key':'0PHOUEsrVsmsh4kV3i9X5FFqfof4p1maU5Vjsn62WwTuW8AIxn',
					'Accept' : 'application/json'
				}
			}
			request(options, function (error, httpResponse, body){
				console.log(body);
			});
			*/
			console.log("var :: " + uriFinal);
			console.log("string :: " + "https://camfind.p.mashape.com/image_responses/" + "x06pZGUbLV-85wAdqhxEDw");

			unirest.get("https://camfind.p.mashape.com/image_responses/" + "x06pZGUbLV-85wAdqhxEDw")
			.header("X-Mashape-Key", "0PHOUEsrVsmsh4kV3i9X5FFqfof4p1maU5Vjsn62WwTuW8AIxn")
			.header("Accept", "application/json")
			.end(function (result) {
				console.log(result.status, result.headers, result.body);
			});			
		});
		res.render('image' , { title : 'Camfind API', url: 'http://d1spq65clhrg1f.cloudfront.net/uploads/image_request/image/22/22700/22700121/11307056475_a8bca6fbd9_q.jpg'} );

	  }
	});

});


router.get('/imagga',function(req, res, next) {
	request('http://bldata.herokuapp.com/images/random', function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	    var uri = JSON.parse(response.body).flickr_thumb_jpeg;
		request.get({
		    url:'https://api.imagga.com/v1/tagging?url='+ uri,
		    auth: {
		    	username:"acc_3a8a3280ff382f5",
		    	password: "a5c945ee52846e612ff5705d6ce2e1a8"
		    }
		}, function (err, httpResponse, body) {
			var response = JSON.parse(body);
		    res.render('image', {title : 'Imagga API', url:uri, results: response.results[0].tags});
		});
	  } else {
	  	console.log(error);
	  	res.send('<h2>ERROR<h2><br>' + error);
	  }
	});

});

module.exports = router;
