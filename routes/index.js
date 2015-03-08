var AlchemyAPI = require('../lib/alchemy/alchemyapi');
var alchemyapi = new AlchemyAPI();
var request = require('request');
var express = require('express');
var exphbs  = require('express-handlebars');
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
	}).limit(250).toArray(function (err, docs){
		if (err) {
			console.log (err);
			console.log(req.body.query);
			res.render('error', { message:err });
		} else {
			if (docs.length == 0){
				res.render('search', {
					noResults : "No results found",
					searchType: "title" ,
					searchQuery: req.body.query,
					helpers:{
						shortenString : function (string) {return String(string).substring(0, 35) + "..."} 
					} 
				});
			} else {
				console.log(req.body.query);
				res.render('search',{
					imageResults : docs,
					searchType: "title" ,
					searchQuery: req.body.query,
					helpers:{
						shortenString : function (string) {return String(string).substring(0, 35) + "..."} 
					} 
				});
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
	}).limit(250).toArray(function (err, docs){
		if (err) {
			console.log (err);
			console.log(req.body.query);
			res.render('error', { message:err });
		} else {
			if (docs.length == 0){
				res.render('search', { 
					noResults : "No results found" ,
					searchType: "Alchemy API", 
					searchQuery: req.body.query,
					helpers:{
						shortenString : function (string) {return String(string).substring(0, 35) + "..."} 
					}  
				});
			} else {
				console.log(req.body.query);
				res.render('search',{
					imageResults : docs, 
					searchType: "Alchemy API", 
					searchQuery: req.body.query,
					helpers:{
						shortenString : function (string) {return String(string).substring(0, 35) + "..."} 
					}  
				});
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
	}).limit(250).toArray(function (err, docs){
		if (err) {
			console.log (err);
			console.log(req.body.query);
			res.render('error', { message:err });
		} else {
			if (docs.length == 0){
				res.render('search', {
					noResults : "No results found",
					searchType: "Imagga API", 
					searchQuery: req.body.query,
					helpers:{
						shortenString : function (string) {return String(string).substring(0, 35) + "..."} 
					}  
				});
			} else {
				console.log(req.body.query);
				res.render('search',{
					imageResults : docs, 
					searchType: "Imagga API",
					searchQuery: req.body.query,
					helpers:{
						shortenString : function (string) {return String(string).substring(0, 35) + "..."} 
					} 
				});
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
				imaggaTags : doc.imaggaTags,
				helpers: {
		            shortenDecimal: function (num) { return Number(num).toFixed(2); },
		            convertToPercentage : function (num) { return Number(num*100).toFixed(2); }
		        }
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
						imaggaTags : imaggaTags,
						helpers: {
		            		shortenDecimal: function (num) { return Number(num).toFixed(2); },
		            		convertToPercentage : function (num) { return Number(num).toFixed(2)*100.00; }
				        }
					});
				});

			}); 		
		}
	});
});

/* 

// This is the script to automate the tagging process.. currently under maintenance

router.get('/analyse/:keyword', function(req, res, next){
	collection.find({
		"$text" : {
			"$search" : req.params.keyword
		}
	}).toArray(function (err, docs){
		if (err) {
			console.log (err);
			console.log(req.body.query);
			res.render('error', { message:err });
		} else {
			if (docs.length == 0){
				res.send('no results found');
			} else {
				console.log(req.body.keyword);
				res.send("analysis in process");
				//for (var i = 0; i < (docs.length - 1); i++){
					analyseDocsFromQuery(docs);
				//}
			}
		}
	});
});

analyseDocsFromQuery = function(docs){
	for (var i = 0; i < docs.length; ){
		var url = docs[i].flickr_small_source;
		var currId = docs[i]._id;
		console.log("current url " + url);
		console.log("current ID: " + currId );
		alchemyapi.image_keywords('url', url, {}, function (response) {	
			var alchemyTags = response.imageKeywords;
			//console.log(alchemyTags);
			request.get({
			    url:'https://api.imagga.com/v1/tagging?url='+ url,
			    auth: {
			    	username:"acc_3a8a3280ff382f5",
			    	password: "a5c945ee52846e612ff5705d6ce2e1a8"
			    }
			}, function (err, httpResponse, body) {
				if (JSON.parse(body).results[0].tags != undefined){
					var imaggaTags = JSON.parse(body).results[0].tags;
					collection.update({'_id':new objectId(currId) }, {$set : {alchemyTags: alchemyTags, imaggaTags: imaggaTags}}, function(){ i++; console.log("tags inserted. Analysis progress: " + i + "of " + docs.length + " done." )});
				}
				//console.log(imaggaTags);
			});

		});
	}
}
*/
module.exports = router;
