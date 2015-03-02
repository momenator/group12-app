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
	/*
	request('http://bldata.herokuapp.com/images/random', function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	    console.log("original jpeg > " + JSON.parse(response.body).flickr_original_jpeg); 
	    console.log(JSON.parse(response.body).flickr_thumb_jpeg);// Show the HTML for the Google homepage. 
		var url = JSON.parse(response.body).flickr_thumb_jpeg;
		unirest.post("https://camfind.p.mashape.com/image_requests")
			.header("X-Mashape-Key", "GTBYDQFyOxmshDs2wkncNpnUSw4Op1RII4XjsniOkwIP1IIJab")
			.header("Content-Type", "application/x-www-form-urlencoded")
			.header("Accept", "application/json")
			.send("focus[x]", "480")
			.send("focus[y]", "640")
			.send("image_request[altitude]", "27.912109375")
			.send("image_request[language]", "en")
			.send("image_request[latitude]", "35.8714220766008")
			.send("image_request[locale]", "en_US")
			.send("image_request[longitude]", "14.3583203002251")
			.send("image_request[remote_image_url]", "http://upload.wikimedia.org/wikipedia/en/2/2d/Mashape_logo.png")
			.end(function (result) {
			  console.log(result.body);
			});
	  }
	});
	*/
	res.render('image' , {title : 'Camfind API'} );
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
		}, function(err, httpResponse, body) {
		    res.render('image', {title : 'Imagga API', url:uri, results: response.results[0].tags});
		});
	  } else {
	  	console.log(error);
	  	res.send('<h2>ERROR<h2><br>' + error);
	  }
	});

});

module.exports = router;
