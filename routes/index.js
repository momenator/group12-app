var AlchemyAPI = require('../lib/alchemy/alchemyapi');
var alchemyapi = new AlchemyAPI();
var request = require('request');
var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var client = new MongoClient();
var db;

client.connect("mongodb://***:***@ds049171.mongolab.com:49171/bl-dataset",function(err, db) {
    if(err) {
    	console.log(err);
        console.log("Connection to database failed.");
    } else {
        collection = db.collection("images");
        console.log("Connection to database succeded.")
    }
});

router.get('/', function(req, res, next) {
	res.render('index', {});
});

router.get('/search', function(req, res, next){
	res.render('search',{});
});

router.get('/search', function(req, res, next){
	res.render('search',{});
});


router.get('/alchemy', function(req, res, next) {	
	collection.findOne({}, function (err, doc){
		if (err) {
			console.log (err);
			res.render('error', { message:err });
		} else {			
			alchemyapi.image_keywords('url', doc.flickr_small_source, {}, function (response) {	
				res.render( 'image', { 
					apiName:'Alchemy API',
					results: response.imageKeywords,
					url: doc.flickr_original_source, 
					volume: doc.volume,
					publisher : doc.publisher,
					imageTitle : doc.title,
					author :doc.first_author,
					publicationPlace: doc.pubplace,
					bookID : doc.book_identifier,
					year: doc.date,
					page: doc.page
				});
			});
		}
	});
});

router.get('/imagga',function(req, res, next) {
	collection.findOne({}, function (err, doc){
		if (err) {
			console.log (err);
			res.render('error', { message:err });
		} else {			
			request.get({
			    url:'https://api.imagga.com/v1/tagging?url='+ doc.flickr_small_source,
			    auth: {
			    	username:"acc_3a8a3280ff382f5",
			    	password: "a5c945ee52846e612ff5705d6ce2e1a8"
			    }
			}, function (err, httpResponse, body) {
				var response = JSON.parse(body);
			    res.render('image', {
			    	apiName : 'Imagga API', 
			    	results: response.results[0].tags, 
			    	url: doc.flickr_original_source, 
					volume: doc.volume,
					publisher : doc.publisher,
					imageTitle : doc.title,
					author :doc.first_author,
					publicationPlace: doc.pubplace,
					bookID : doc.book_identifier,
					year: doc.date,
					page: doc.page
			    });
			});
		}
	});
});

module.exports = router;
