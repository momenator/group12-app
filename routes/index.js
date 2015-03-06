var AlchemyAPI = require('../lib/alchemy/alchemyapi');
var alchemyapi = new AlchemyAPI();
var request = require('request');
var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var objectId = require('mongodb').ObjectID;
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

router.post('/search', function(req, res, next){
	collection.find({
		"$text" : {
			"$search" : req.body.query
		}
	}).limit(100).toArray(function (err, docs){
		if (err) {
			console.log (err);
			console.log(req.body.query);
			res.render('error', { message:err });
		} else {
			if (docs.length == 0){
				res.render('search', { noResults : "No results found" });
			} else {
				console.log(req.body.query);
				res.render('search',{imageResults : docs});
			}
		}
	});
});

router.post('/searchAlchemyTags', function(req, res, next){
	collection.find({
		"alchemyTags": {
	        "$elemMatch": {
	            "text": req.body.query
	        }
	    }
	}).limit(100).toArray(function (err, docs){
		if (err) {
			console.log (err);
			console.log(req.body.query);
			res.render('error', { message:err });
		} else {
			if (docs.length == 0){
				res.render('search', { noResults : "No results found" });
			} else {
				console.log(req.body.query);
				res.render('search',{imageResults : docs});
			}
		}
	});
});

router.post('/searchImaggaTags', function(req, res, next){
	collection.find({
	    "imaggaTags": {
	        "$elemMatch": {
	            "tag": req.body.query
	        }
	    }
	}).limit(100).toArray(function (err, docs){
		if (err) {
			console.log (err);
			console.log(req.body.query);
			res.render('error', { message:err });
		} else {
			if (docs.length == 0){
				res.render('search', { noResults : "No results found" });
			} else {
				console.log(req.body.query);
				res.render('search',{imageResults : docs});
			}
		}
	});
});

var getTagsAlchemyAPI = function (url){
	alchemyapi.image_keywords('url', url, {}, function (response) {	
		return response.imageKeywords;
	}); 
}


var getTagsImaggaAPI = function (url){
	request.get({
	    url:'https://api.imagga.com/v1/tagging?url='+ url,
	    auth: {
	    	username:"acc_3a8a3280ff382f5",
	    	password: "a5c945ee52846e612ff5705d6ce2e1a8"
	    }
	}, function (err, httpResponse, body) {
		var response = JSON.parse(body);
	    return response.results[0].tags;
	});
}

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

router.get('/search/:imageid',function(req, res, next){
	collection.findOne({'_id':new objectId(req.params.imageid)}, function (err, doc){
		console.log(doc);
		var url = doc.flickr_small_source;
		if (err) {
			console.log (err);
			res.render('error', { message:err } );
		} else if (doc.alchemyTags != undefined || doc.alchemyTags != undefined ){
			res.render('image', { 
				url: doc.flickr_original_source, 
				volume: doc.volume,
				publisher : doc.publisher,
				imageTitle : doc.title,
				author :doc.first_author,
				publicationPlace: doc.pubplace,
				bookID : doc.book_identifier,
				year: doc.date,
				page: doc.page,
				alchemyTags : doc.alchemyTags,
				imaggaTags : doc.imaggaTags
			});
		} else {
			alchemyapi.image_keywords('url', url, {}, function (response) {	
				var alchemyTags = response.imageKeywords;
				console.log(alchemyTags);
				request.get({
				    url:'https://api.imagga.com/v1/tagging?url='+ url,
				    auth: {
				    	username:"acc_3a8a3280ff382f5",
				    	password: "a5c945ee52846e612ff5705d6ce2e1a8"
				    }
				}, function (err, httpResponse, body) {
					var imaggaTags = JSON.parse(body).results[0].tags;
					console.log(imaggaTags);
					collection.update({'_id':new objectId(req.params.imageid)}, {$set : {alchemyTags: alchemyTags, imaggaTags: imaggaTags}},function(){console.log('inserted tags')});
					res.render('image', { 
						url: doc.flickr_original_source, 
						volume: doc.volume,
						publisher : doc.publisher,
						imageTitle : doc.title,
						author :doc.first_author,
						publicationPlace: doc.pubplace,
						bookID : doc.book_identifier,
						year: doc.date,
						page: doc.page,
						alchemyTags : alchemyTags,
						imaggaTags : imaggaTags
					});
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
