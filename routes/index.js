var http = require('http');
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
	    console.log("original jpeg > " + JSON.parse(response.body).flickr_original_jpeg); 
	    console.log(JSON.parse(response.body).flickr_thumb_jpeg);// Show the HTML for the Google homepage. 
		var url = JSON.parse(response.body).flickr_thumb_jpeg;
		alchemyapi.image_keywords('url', url, {}, function(response) {
			console.log(response);
			console.log(response.imageKeywords);
			res.render( 'image', { title:'Alchemy API' ,url: response.url, results: response.imageKeywords } );
		});
	  }
	});
});

router.get('/camfind',function(req, res, next) {

	res.render('image', { title: 'Camfind API' });

});


router.get('/imagga',function(req, res, next) {
	request('http://bldata.herokuapp.com/images/random', function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	    console.log("original jpeg > " + JSON.parse(response.body).flickr_original_jpeg); 
	    console.log(JSON.parse(response.body).flickr_thumb_jpeg);// Show the HTML for the Google homepage. 
		var uri = JSON.parse(response.body).flickr_thumb_jpeg;
		request({
			method:'GET',
			uri: 'https://api.imagga.com/v1/tagging?url='+ uri,
			api_key: 'acc_3a8a3280ff382f5',
			api_secret: 'a5c945ee52846e612ff5705d6ce2e1a8'
		}, function (error , response, body){
			if (!error && response.statusCode == 200) {
				console.log(uri);
				res.render('image', {title : 'Imagga API'});
				console.log(response.body);
			}
		});
	  }
	});

});

module.exports = router;
