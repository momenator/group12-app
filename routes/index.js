var http = require('http');
var AlchemyAPI = require('../alchemyapi');
var alchemyapi = new AlchemyAPI();
var request = require('request');


// this is the function to make calls to 
var demo_url = 'https://farm3.staticflickr.com/2877/11232456223_0aa1e12247_q.jpg';
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
	alchemyapi.image_keywords('url', demo_url, {}, function(response) {
		res.render( 'index', { title: 'Express' } );
		console.log(response);
		//res.render('index',{title: output});
	});

	request('http://bldata.herokuapp.com/images/random', function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	    //console.log(body); 
	    console.log(JSON.parse(response.body)._id);// Show the HTML for the Google homepage. 
	  }
	});
  	//res.render( 'index', { title: 'Express' } );	
});

module.exports = router;
