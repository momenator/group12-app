var http = require('http');
var AlchemyAPI = require('../lib/alchemy/alchemyapi');
var alchemyapi = new AlchemyAPI();
var request = require('request');


// this is the function to make calls to 
//var demo_url = 'https://farm3.staticflickr.com/2877/11232456223_0aa1e12247_q.jpg';
function image_keywords(req, res, output) {
	alchemyapi.image_keywords('url', demo_url, {}, function(response) {
		output['image_keywords'] = { url:demo_url, response:JSON.stringify(response,null,4), results:response };
		res.render('example',output);
	});
}

var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
	
	request('http://bldata.herokuapp.com/images/random', function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	    console.log("original jpeg > " + JSON.parse(response.body).flickr_original_jpeg); 
	    console.log(JSON.parse(response.body).flickr_thumb_jpeg);// Show the HTML for the Google homepage. 
		var url = JSON.parse(response.body).flickr_thumb_jpeg;
		alchemyapi.image_keywords('url', url, {}, function(response) {
			console.log(response);
			console.log(response.imageKeywords);
			res.render( 'index', { url: response.url, results: response.imageKeywords } );
		});
	  }
	});
});

module.exports = router;
