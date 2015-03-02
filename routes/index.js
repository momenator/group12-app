var AlchemyAPI = require('../lib/alchemy/alchemyapi');
var alchemyapi = new AlchemyAPI();
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
	    console.log("original jpeg > " + JSON.parse(response.body).flickr_original_jpeg); 
	    console.log(JSON.parse(response.body).flickr_thumb_jpeg);// Show the HTML for the Google homepage. 
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
			var uri = JSON.parse(body).token;
			request.get({
				url: 'https://camfind.p.mashape.com/image_responses/' + uri,
				headers :{
					'X-Mashape-Key':'0PHOUEsrVsmsh4kV3i9X5FFqfof4p1maU5Vjsn62WwTuW8AIxn',
					'Accept' : 'application/json'
				}
			}, function (error, httpResponse, body){
				console.log(body);
				res.render('image' , { title : 'Camfind API', url: url} );
			});
			
		});
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
