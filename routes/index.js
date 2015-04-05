module.exports = function (collection){

	var AlchemyAPI = require('../lib/alchemy/alchemyapi');
	var alchemyapi = new AlchemyAPI();
	var request = require('request');
	var express = require('express');
	var exphbs  = require('express-handlebars');
	var router = express.Router();
	var objectId = require('mongodb').ObjectID;

	var shortenStringHelper = function (string) {
		return String(string).substring(0, 35) + "..."
	}; 

	var shortenDecimalHelper = function (num) { 
		return Number(num).toFixed(2); 
	};

	var convertToPercentageHelper = function (num) { 
		return Number(num*100).toFixed(2);
	};

	var functions = {};

	functions.getHomePage = function(req, res, next) {
		res.render('index', {});
	};

	functions.getSearchPage = function(req, res, next){
		res.render('search',{});
	};

	functions.postSearchByTitlePage = function(req, res, next){
		console.log("searched for title : " + req.body.query);
		collection.find({
			"$text" : {
				"$search" : req.body.query
			}
		}).limit(50).toArray(function (err, docs){
			if (err) {
				console.log (err);
				res.render('error', { message:err });
			} else {
				if (docs.length == 0){
					res.render('search', {
						searchByTitle: 'checked',
						noResults : "No results found",
						searchType: "title" ,
						searchQuery: req.body.query,
						helpers:{
							shortenString : shortenStringHelper 
						} 
					});
				} else {
					res.render('search',{
						searchByTitle: 'checked',
						imageResults : docs,
						searchType: "title" ,
						searchQuery: req.body.query,
						helpers:{
							shortenString : shortenStringHelper
						} 
					});
				}
			}
		});
	};

	functions.postSearchByTagPage = function(req, res, next){
		console.log("searched for tag : " + req.body.query);
		var query = (req.params.query == undefined) ? req.body.query : req.params.query;
		var result = [];
		collection.find({
			"alchemyTags": {
		        "$elemMatch": {
		            "text": query
		        }
		    }
		}).limit(50).toArray(function (err, docs){
			if (err) {
				console.log(err);
				res.render('error', { message:err });
			} else {
				result.push.apply(result, docs);
				collection.find({
				    "imaggaTags": {
				        "$elemMatch": {
				            "tag": query
				        }
				    }
				}).limit(50).toArray(function (err, docs){
					if (err) {
						console.log(err);
						res.render('error', { message:err });
					} else {
						result.push.apply(result, docs);
						console.log("result tags : " + result);
						if (result.length == 0){
							res.render('search', { 
								searchByTags: 'checked',
								noResults : "No results found" ,
								searchType: "tags", 
								searchQuery: query,
								helpers:{
									shortenString : shortenStringHelper 
								}  
							});
						} else {
							res.render('search',{
								searchByTags: 'checked',
								imageResults : result, 
								searchType: "tags", 
								searchQuery: query,
								helpers:{
									shortenString : shortenStringHelper
								}  
							});
						}
					}
				});
			}
		});
	};

	functions.getStatsPage = function (req, res, next){
		collection.count(function (err, count){
			var collectionSize = count;
			console.log(collectionSize);
			var query1 = {
			    "$or": [
			        {
			            "imaggaTags": {
			                "$exists": "true"
			            }
			        },
			        {
			            "alchemyTags": {
			                "$exists": "true"
			            }
			        }
			    ]
			};
			collection.find(query1).toArray(function (err, taggedDocs){
				var taggedImages = taggedDocs.length;
				console.log(taggedImages);
				var query2 = {
				    "$and": [
				        {
				            "imaggaTags":  {
				                "$ne": null
				            }
				        },
				        {
				            "alchemyTags":  {
				                "$ne": null
				            }
				        }
				    ]
				}
				collection.find(query2).toArray(function (err, nullTags1){
					var bothTags = nullTags1.length;
					var query3 = {
					    "$and": [
					        {
					            "imaggaTags": []
					        },
					        {
					            "alchemyTags": []
					        }
					    ]
					}
					collection.find(query3).toArray(function (err, nullTags2){
						var bothNullTags = nullTags2.length;
						collection.aggregate(
							[
								{ "$unwind" : "$imaggaTags" },
								{ "$group" : { "_id" : "$imaggaTags.tag" , "number" : { "$sum" : 1 } } },
								{ "$sort" : { "number" : -1 } },
								{ "$limit" : 10 }
							],function (err, topTenImaggaTags){
								collection.aggregate(
									[
										{ "$unwind" : "$alchemyTags" },
										{ "$group" : { "_id" : "$alchemyTags.text" , "number" : { "$sum" : 1 } } },
										{ "$sort" : { "number" : -1 } },
										{ "$limit" : 10 }
									], function (err, topTenAlchemyTags ){
										res.render('stats', {
											collectionSize : collectionSize,
											taggedImages : taggedImages,
											eitherNullTags : taggedImages,
											bothTags : bothTags,
											bothNullTags : bothNullTags,
											topTenImaggaTags : topTenImaggaTags,
											topTenAlchemyTags : topTenAlchemyTags
										});
								});
						});
						
					});
				});
			});
		});
	}
	
	functions.getImagePage = function(req, res, next){
		console.log("visited image id : " + req.params.imageid);
		var query;
		var options;
		if (req.params.imageid == 'random'){
			query = {};
			options = {
				"limit": 1,
            	"skip": Math.floor(Math.random()*(25699))
			}
		} else {
			query = {'_id':new objectId(req.params.imageid)};
			options = {};
		}
		collection.findOne(query, {}, options, function (err, doc){
			if (err) {
				console.log (err);
				res.render('error', { message:err } );
			} else if (doc == undefined){ 
				console.log ('Image Not found, redirecting to error 404 page');
				res.redirect('/invalid-image-id');
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
			            shortenDecimal: shortenDecimalHelper,
			            convertToPercentage : convertToPercentageHelper
			        }
				});
			} else {
				var url = doc.flickr_small_source;
				alchemyapi.image_keywords('url', url, {}, function (response) {	
					var alchemyTags = response.imageKeywords;
					request.get({
					    url:'https://api.imagga.com/v1/tagging?url='+ url,
					    auth: {
					    	username:"acc_3a8a3280ff382f5",
					    	password: "a5c945ee52846e612ff5705d6ce2e1a8"
					    }
					}, function (err, httpResponse, body) {
						var imaggaTags = (JSON.parse(body).results == undefined) ? [] : JSON.parse(body).results[0].tags;
						collection.update({
							'_id':new objectId(doc._id)
						}, {
							$set : {
								alchemyTags: alchemyTags, 
								imaggaTags: imaggaTags
							}
						},function(){ 
							console.log('inserted tags') 
						});
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
			            		shortenDecimal: shortenDecimalHelper,
			            		convertToPercentage : convertToPercentageHelper
					        }
						});
					});

				}); 		
			}
		});
	};
	
	return functions;
}