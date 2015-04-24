module.exports = function (imageCollection, tagCollection){

	var AlchemyAPI = require('../lib/alchemy/alchemyapi');
	var alchemyapi = new AlchemyAPI();
	var request = require('request');
	var express = require('express');
	var exphbs  = require('express-handlebars');
	var router = express.Router();
	var objectId = require('mongodb').ObjectID;
	var config = require('../config/config.js');

	var shortenStringHelper = function (string) {
		return String(string).substring(0, 50) + "..."
	}; 

	var shortenDecimalHelper = function (num) { 
		return Number(num).toFixed(2); 
	};

	var convertToPercentageHelper = function (num) { 
		return Number(num*100).toFixed(2);
	};

	var addTrailingZero = function (str, max) {
  		str = str.toString();
  		return str.length < max ? addTrailingZero("0" + str, max) : str;
	}

	var sortByRank = function (a,b) {
		if (a.rank < b.rank){
			return 1;
		}
		if (a.rank > b.rank) {
			return -1;
		}
		return 0;
	}

	var functions = {};

	functions.getHomePage = function(req, res, next) {
		res.render('index', {});
	};

	functions.getSearchPage = function(req, res, next){
		res.render('search',{});
	};

	functions.postSearchByTitlePage = function(req, res, next){
		//console.log("searched for title : " + req.body.query);
		imageCollection.find({
			"$text" : {
				"$search" : req.body.query
			}
		}).limit(50).toArray(function (err, docs){
			if (err) {
				//console.log (err);
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
		//console.log("searched for tag : " + req.body.query);
		var query = (req.params.query == undefined) ? req.body.query : req.params.query;
		var result = [];
		imageCollection.find({
			"alchemyTags": {
		        "$elemMatch": {
		            "text": query
		        }
		    }
		}).sort({"alchemyTags.score" : -1}).limit(100).toArray(function (err, docs){
			console.log("AlchemyAPI :: " + docs.length);
			if (err) {
				//console.log(err);
				res.render('error', { message:err });
			} else {
				for (var i = 0; i < docs.length; i++){
					var currRank = 0;
					if (docs[i]['alchemyTags'] != null){
						for (var j = 0; j < docs[i]['alchemyTags'].length; j++){						
							if (docs[i]['alchemyTags'][j]['text'] == query){
								var buffRank = parseFloat(convertToPercentageHelper(docs[i]['alchemyTags'][j]['score']));
								if (currRank < buffRank){
									currRank = buffRank
								}
							}
						}
					}
					
					if (docs[i]['imaggaTags'] != null){
						for (var j = 0; j < docs[i]['imaggaTags'].length; j++){						

							if (docs[i]['imaggaTags'][j]['tag'] == query){
								var buffRank = parseFloat((docs[i]['imaggaTags'][j]['confidence']));
								if (currRank < buffRank){
									currRank = buffRank
								}
							}
						}
					}

					if (docs[i]['machineTags'] != null){

						for (var j = 0; j < docs[i]['machineTags'].length; j++){						

							if (docs[i]['machineTags'][j]['tag'] == query){
								var buffRank = parseFloat((docs[i]['machineTags'][j]['confidence']));
								if (currRank < buffRank){
									currRank = buffRank
								}
							}
						}
					}

					docs[i]['rank'] = currRank;

				}
				result.push.apply(result, docs);
				imageCollection.find({
				    "imaggaTags": {
				        "$elemMatch": {
				            "tag": query
				        }
				    }
				}).sort({"imaggaTags.confidence" : -1}).limit(100).toArray(function (err, docs){
					console.log("imaggaTags :: " + docs.length);
					if (err) {
						//console.log(err);
						res.render('error', { message:err });
					} else {
						for (var i = 0; i < docs.length; i++){
							var currRank = 0;
							if (docs[i]['alchemyTags'] != null){
								for (var j = 0; j < docs[i]['alchemyTags'].length; j++){						
									if (docs[i]['alchemyTags'][j]['text'] == query){
										var buffRank = parseFloat(convertToPercentageHelper(docs[i]['alchemyTags'][j]['score']));
										if (currRank < buffRank){
											currRank = buffRank
										}
									}
								}
							}
							
							if (docs[i]['imaggaTags'] != null){
								for (var j = 0; j < docs[i]['imaggaTags'].length; j++){						

									if (docs[i]['imaggaTags'][j]['tag'] == query){
										var buffRank = parseFloat((docs[i]['imaggaTags'][j]['confidence']));
										if (currRank < buffRank){
											currRank = buffRank
										}
									}
								}
							}

							if (docs[i]['machineTags'] != null){

								for (var j = 0; j < docs[i]['machineTags'].length; j++){						

									if (docs[i]['machineTags'][j]['tag'] == query){
										var buffRank = parseFloat((docs[i]['machineTags'][j]['confidence']));
										if (currRank < buffRank){
											currRank = buffRank
										}
									}
								}
							}

							docs[i]['rank'] = currRank;
						}
						result.push.apply(result, docs);
						imageCollection.find({
						    "machineTags": {
						        "$elemMatch": {
						            "tag": query
						        }
						    }
						}).sort({"machineTags.confidence" : -1}).limit(100).toArray(function (err, docs){
							console.log("machineTags :: " + docs.length);
							if (err) {
								//console.log(err);
								res.render('error', { message:err });
							} else {
								for (var i = 0; i < docs.length; i++){
									var currRank = 0;
									if (docs[i]['alchemyTags'] != null){
										for (var j = 0; j < docs[i]['alchemyTags'].length; j++){						
											if (docs[i]['alchemyTags'][j]['text'] == query){
												var buffRank = parseFloat(convertToPercentageHelper(docs[i]['alchemyTags'][j]['score']));
												if (currRank < buffRank){
													currRank = buffRank
												}
											}
										}
									}
									
									if (docs[i]['imaggaTags'] != null){
										for (var j = 0; j < docs[i]['imaggaTags'].length; j++){						

											if (docs[i]['imaggaTags'][j]['tag'] == query){
												var buffRank = parseFloat((docs[i]['imaggaTags'][j]['confidence']));
												if (currRank < buffRank){
													currRank = buffRank
												}
											}
										}
									}

									if (docs[i]['machineTags'] != null){

										for (var j = 0; j < docs[i]['machineTags'].length; j++){						

											if (docs[i]['machineTags'][j]['tag'] == query){
												var buffRank = parseFloat((docs[i]['machineTags'][j]['confidence']));
												if (currRank < buffRank){
													currRank = buffRank
												}
											}
										}
									}

									docs[i]['rank'] = currRank;
								}
								result.push.apply(result, docs);
								result.sort(sortByRank);
								result.splice(100, result.length - 1);
								console.log("length :: " + result.length);
								
								//console.log("result tags : " + result);
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
			}
		});
	};

	functions.getStatsPage = function (req, res, next){
		res.render('stats', {});
	};
	
	functions.getImagePage = function(req, res, next){
		//console.log("visited image id : " + req.params.imageid);
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
		imageCollection.findOne(query, {}, options, function (err, doc){
			//console.log(doc);
			if (err) {
				//console.log (err);
				res.render('error', { message:err } );
			} else if (doc == undefined){ 
				//console.log ('Image Not found, redirecting to error 404 page');
				res.redirect('/invalid-image-id');
			} else if (doc.alchemyTags == undefined && doc.imaggaTags == undefined ){
				var url = doc.flickr_small_source;
				alchemyapi.image_keywords('url', url, {}, function (response) {	
					var alchemyTags = response.imageKeywords;
					request.get({
					    url:'https://api.imagga.com/v1/tagging?url='+ url,
					    auth: {
					    	username:config.imaggaUsername,
					    	password: config.imaggaPassword
					    }
					}, function (err, httpResponse, body) {
						var imaggaTags = (JSON.parse(body).results == undefined) ? [] : JSON.parse(body).results[0].tags;
						imageCollection.update({
							'_id':new objectId(doc._id)
						}, {
							$set : {
								alchemyTags: alchemyTags, 
								imaggaTags: imaggaTags
							}
						},function(){ 
							//console.log('inserted tags') 
						});
						res.render('image', { 
							url: doc.flickr_original_source, 
							volume: doc.volume,
							publisher : doc.publisher,
							imageTitle : doc.title,
							author :doc.first_author,
							publicationPlace: doc.pubplace,
							bookID : addTrailingZero(doc.book_identifier, 9),
							year: doc.date,
							page: doc.page,
							machineTags : doc.machineTags,
							alchemyTags : alchemyTags,
							imaggaTags : imaggaTags,
							helpers: {
			            		shortenDecimal: shortenDecimalHelper,
			            		convertToPercentage : convertToPercentageHelper
					        }
						});
					});

				});
			} else {
				res.render('image', { 
					url: doc.flickr_original_source, 
					volume: doc.volume,
					publisher : doc.publisher,
					imageTitle : doc.title,
					author :doc.first_author,
					publicationPlace: doc.pubplace,
					bookID : addTrailingZero(doc.book_identifier, 9),
					year: doc.date,
					page: doc.page,
					machineTags : doc.machineTags,
					alchemyTags : doc.alchemyTags,
					imaggaTags : doc.imaggaTags,
					helpers: {
			            shortenDecimal: shortenDecimalHelper,
			            convertToPercentage : convertToPercentageHelper
			        }
				}); 		
			}
		});
	};

	functions.RestAPIgetCoOccurringTags = function (req, res, next){
		//console.log('Rest API : get tag : ' + req.params.tagName);
		var tagQuery = req.params.tagName;
		var query = {
			tag : tagQuery
		};

		if (tagQuery == undefined){
			res.jsonp({});
		} else {
			tagCollection.findOne(query, function (err, doc) {
				if (err) {
					//console.log(err);
					res.jsonp({error : err, message : 'an error has occured'});
				}
				if (doc == undefined) {
					res.jsonp('{}');
				} else {
					var coOccuringTags = doc['coOccuringTags'].split(',');
					res.jsonp({
						tag : tagQuery, 
						coOccuringTags : coOccuringTags
					});
				}
			});
		}
	};

	functions.RestAPIgetSearchByTitle = function(req, res, next){
		//console.log("Rest API : searched for title : " + req.params.title);
		imageCollection.find({
			"$text" : {
				"$search" : req.params.title
			}
		}).limit(50).toArray(function (err, docs){
			if (err) {
				//console.log (err);
				res.render('error', { message:err });
			} else {
				if (docs.length == 0){
					res.jsonp('{}');
				} else {
					res.jsonp({
						imageResults : docs,
						searchType: "title" ,
						searchQuery: req.params.title
					});
				}
			}
		});
	};

	functions.RestAPIgetSearchByTag = function(req, res, next){
		//console.log("Rest API : searched for tag : " + req.params.tag);
		var query = req.params.tag;
		var result = [];
		imageCollection.find({
			"alchemyTags": {
		        "$elemMatch": {
		            "text": query
		        }
		    }
		}).sort({"alchemyTags.score" : -1}).limit(100).toArray(function (err, docs){
			console.log("AlchemyAPI :: " + docs.length);
			if (err) {
				//console.log(err);
				res.render('error', { message:err });
			} else {
				for (var i = 0; i < docs.length; i++){
					var currRank = 0;
					if (docs[i]['alchemyTags'] != null){
						for (var j = 0; j < docs[i]['alchemyTags'].length; j++){						
							if (docs[i]['alchemyTags'][j]['text'] == query){
								var buffRank = parseFloat(convertToPercentageHelper(docs[i]['alchemyTags'][j]['score']));
								if (currRank < buffRank){
									currRank = buffRank
								}
							}
						}
					}
					
					if (docs[i]['imaggaTags'] != null){
						for (var j = 0; j < docs[i]['imaggaTags'].length; j++){						

							if (docs[i]['imaggaTags'][j]['tag'] == query){
								var buffRank = parseFloat((docs[i]['imaggaTags'][j]['confidence']));
								if (currRank < buffRank){
									currRank = buffRank
								}
							}
						}
					}

					if (docs[i]['machineTags'] != null){

						for (var j = 0; j < docs[i]['machineTags'].length; j++){						

							if (docs[i]['machineTags'][j]['tag'] == query){
								var buffRank = parseFloat((docs[i]['machineTags'][j]['confidence']));
								if (currRank < buffRank){
									currRank = buffRank
								}
							}
						}
					}

					docs[i]['rank'] = currRank;

				}
				result.push.apply(result, docs);
				imageCollection.find({
				    "imaggaTags": {
				        "$elemMatch": {
				            "tag": query
				        }
				    }
				}).sort({"imaggaTags.confidence" : -1}).limit(100).toArray(function (err, docs){
					console.log("imaggaTags :: " + docs.length);
					if (err) {
						//console.log(err);
						res.render('error', { message:err });
					} else {
						for (var i = 0; i < docs.length; i++){
							var currRank = 0;
							if (docs[i]['alchemyTags'] != null){
								for (var j = 0; j < docs[i]['alchemyTags'].length; j++){						
									if (docs[i]['alchemyTags'][j]['text'] == query){
										var buffRank = parseFloat(convertToPercentageHelper(docs[i]['alchemyTags'][j]['score']));
										if (currRank < buffRank){
											currRank = buffRank
										}
									}
								}
							}
							
							if (docs[i]['imaggaTags'] != null){
								for (var j = 0; j < docs[i]['imaggaTags'].length; j++){						

									if (docs[i]['imaggaTags'][j]['tag'] == query){
										var buffRank = parseFloat((docs[i]['imaggaTags'][j]['confidence']));
										if (currRank < buffRank){
											currRank = buffRank
										}
									}
								}
							}

							if (docs[i]['machineTags'] != null){

								for (var j = 0; j < docs[i]['machineTags'].length; j++){						

									if (docs[i]['machineTags'][j]['tag'] == query){
										var buffRank = parseFloat((docs[i]['machineTags'][j]['confidence']));
										if (currRank < buffRank){
											currRank = buffRank
										}
									}
								}
							}

							docs[i]['rank'] = currRank;
						}
						result.push.apply(result, docs);
						imageCollection.find({
						    "machineTags": {
						        "$elemMatch": {
						            "tag": query
						        }
						    }
						}).sort({"machineTags.confidence" : -1}).limit(100).toArray(function (err, docs){
							console.log("machineTags :: " + docs.length);
							if (err) {
								//console.log(err);
								res.render('error', { message:err });
							} else {
								for (var i = 0; i < docs.length; i++){
									var currRank = 0;
									if (docs[i]['alchemyTags'] != null){
										for (var j = 0; j < docs[i]['alchemyTags'].length; j++){						
											if (docs[i]['alchemyTags'][j]['text'] == query){
												var buffRank = parseFloat(convertToPercentageHelper(docs[i]['alchemyTags'][j]['score']));
												if (currRank < buffRank){
													currRank = buffRank
												}
											}
										}
									}
									
									if (docs[i]['imaggaTags'] != null){
										for (var j = 0; j < docs[i]['imaggaTags'].length; j++){						

											if (docs[i]['imaggaTags'][j]['tag'] == query){
												var buffRank = parseFloat((docs[i]['imaggaTags'][j]['confidence']));
												if (currRank < buffRank){
													currRank = buffRank
												}
											}
										}
									}

									if (docs[i]['machineTags'] != null){

										for (var j = 0; j < docs[i]['machineTags'].length; j++){						

											if (docs[i]['machineTags'][j]['tag'] == query){
												var buffRank = parseFloat((docs[i]['machineTags'][j]['confidence']));
												if (currRank < buffRank){
													currRank = buffRank
												}
											}
										}
									}

									docs[i]['rank'] = currRank;
								}
								result.push.apply(result, docs);
								result.sort(sortByRank);
								result.splice(100, result.length - 1);
								console.log("length :: " + result.length);
								
								//console.log("result tags : " + result);
								if (result.length == 0){
									res.jsonp('{}');
								} else {
									res.jsonp({
										imageResults : result, 
										searchType: "tags", 
										searchQuery: query, 
									});
								}
							}
							
						});
					}
				});
			}
		});
	};

	functions.RestAPIgetImageDetails = function(req, res, next){
		//console.log("Rest API : visited image id : " + req.params.imageid);
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
		imageCollection.findOne(query, {}, options, function (err, doc){
			if (err) {
				//console.log (err);
				res.render('error', { message:err } );
			} else if (doc == undefined){ 
				//console.log ('Image Not found, redirecting to error 404 page');
				res.jsonp('{}');
			} else if (doc.alchemyTags != undefined || doc.alchemyTags != undefined ){
				res.jsonp({ 
					url: doc.flickr_original_source, 
					volume: doc.volume,
					publisher : doc.publisher,
					imageTitle : doc.title,
					author :doc.first_author,
					publicationPlace: doc.pubplace,
					bookID : addTrailingZero(doc.book_identifier, 9),
					year: doc.date,
					page: doc.page,
					machineTags : doc.machineTags,
					alchemyTags : doc.alchemyTags,
					imaggaTags : doc.imaggaTags
				});
			} else {
				var url = doc.flickr_small_source;
				alchemyapi.image_keywords('url', url, {}, function (response) {	
					var alchemyTags = response.imageKeywords;
					request.get({
					    url:'https://api.imagga.com/v1/tagging?url='+ url,
					    auth: {
					    	username:config.imaggaUsername,
					    	password: config.imaggaPassword
					    }
					}, function (err, httpResponse, body) {
						var imaggaTags = (JSON.parse(body).results == undefined) ? [] : JSON.parse(body).results[0].tags;
						imageCollection.update({
							'_id':new objectId(doc._id)
						}, {
							$set : {
								alchemyTags: alchemyTags, 
								imaggaTags: imaggaTags
							}
						},function(){ 
							//console.log('inserted tags') 
						});
						res.jsonp({ 
							url: doc.flickr_original_source, 
							volume: doc.volume,
							publisher : doc.publisher,
							imageTitle : doc.title,
							author :doc.first_author,
							publicationPlace: doc.pubplace,
							bookID : addTrailingZero(doc.book_identifier, 9),
							year: doc.date,
							page: doc.page,
							machineTags : doc.machineTags,
							alchemyTags : alchemyTags,
							imaggaTags : imaggaTags
						});
					});

				}); 		
			}
		});
	};

	functions.RestAPIgetStatistics = function (req, res, next){
		//console.log("Rest API : get statistics");
		imageCollection.count(function (err, count){
			var collectionSize = count;
			//console.log(collectionSize);
			var query1 = {
			    "$or": [
			        {
			            "imaggaTags": {
			                "$ne": "null"
			            }
			        },
			        {
			            "alchemyTags": {
			                "$ne": "null"
			            }
			        },
			        {
			            "machineTags": {
			                "$ne": "null"
			            }
			        }
			    ]
			};
			imageCollection.find(query1).toArray(function (err, taggedDocs){
				var taggedImages = taggedDocs.length;
				//console.log(taggedImages);
				var query2 = {
				    "$and": [
				        {
				            "imaggaTags": {
				                "$exists": "true"
				            }
				        },
				        {
				            "alchemyTags": {
				                "$exists": "true"
				            }
				        },
				        {
				            "machineTags": {
				                "$exists": "true"
				            }
				        }
				    ]
				};
				imageCollection.find(query2).toArray(function (err, nullTags1){
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
					imageCollection.find(query3).toArray(function (err, nullTags2){
						var bothNullTags = nullTags2.length;
						imageCollection.aggregate(
							[
								{ "$unwind" : "$imaggaTags" },
								{ "$group" : { "_id" : "$imaggaTags.tag" , "number" : { "$sum" : 1 } } },
								{ "$sort" : { "number" : -1 } },
								{ "$limit" : 10 }
							],function (err, topTenImaggaTags){
								imageCollection.aggregate(
									[
										{ "$unwind" : "$alchemyTags" },
										{ "$group" : { "_id" : "$alchemyTags.text" , "number" : { "$sum" : 1 } } },
										{ "$sort" : { "number" : -1 } },
										{ "$limit" : 10 }
									], function (err, topTenAlchemyTags ){
										imageCollection.aggregate(
											[
												{ "$unwind" : "$machineTags" },
												{ "$group" : { "_id" : "$machineTags.tag" , "number" : { "$sum" : 1 } } },
												{ "$sort" : { "number" : -1 } },
												{ "$limit" : 10 }
											],function (err, topTenMachineTags){
												res.jsonp({
													collectionSize : collectionSize,
													taggedImages : taggedImages,
													eitherNullTags : taggedImages,
													bothTags : bothTags,
													bothNullTags : bothNullTags,
													topTenImaggaTags : topTenImaggaTags,
													topTenAlchemyTags : topTenAlchemyTags,
													topTenMachineTags : topTenMachineTags
												});
											});
								});
						});
					});
				});
			});
		});
	};
	
	return functions;
}