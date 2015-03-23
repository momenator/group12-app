var app = require('./helpers/app');
var should = require('should');
var supertest = require('supertest');
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var client = new MongoClient();


describe('group12-app-test', function () {
	
	/* test all the end points */

	it('should connect to the database successfully', 
	function (done) {
		client.connect("mongodb://***:***@ds049171.mongolab.com:49171/bl-dataset",function(err, db) {
		  if(err) {
		    console.log(err);
		    console.log("> Connection to database failed.");
		  } else {
		    console.log("> Connection to database succeded.");
		    done();
		  }
		});
	});
	
	it('should successfully calls the home page', 
	function (done) {
		supertest(app)
		.get('/')
		.expect(200)
		.end(function (err, res) {
			done();
		});
	});

	it('should successfully calls the search page', 
	function (done) {
		supertest(app)
		.get('/search')
		.expect(200)
		.end(function (err, res) {
			done();
		});
	});

	it('should successfully calls the image with id 54f615fb4bdf80530b020176 page', 
	function (done) {
		supertest(app)
		.get('/search/54f615fb4bdf80530b020176')
		.expect(200)
		.end(function (err, res) {
			done();
		});
	});

	it('should redirect to error 404 page', 
	function (done) {
		supertest(app)
		.get('/randompagethatdoesntexist')
		.expect(404)
		.end(function (err, res) {
			done();
		});
	});


});

