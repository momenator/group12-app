var db;
var collection;
var should = require('should');
var supertest = require('supertest');
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var client = new MongoClient();
var mongodbHost = "mongodb://***:***@ds049171.mongolab.com:49171/bl-dataset";


describe('group12-app-test', function () {
	
	/* test all the end points */

	it('should connect to the database successfully', 
	function (done) {
		client.connect(mongodbHost,function(err, db) {
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
		client.connect(mongodbHost,function(err, db) {
		  if(err) {
		    console.log(err);
		    console.log("> Connection to database failed.");
		  } else {
		  	collection = db.collection('images');
		  	var app = require('../app')(collection)
		    console.log("> Connection to database succeded.");
		    supertest(app)
			.get('/')
			.expect(200)
			.end(function (err, res) {
				res.status.should.equal(200);
				done();
			});
		  }
		});
	});

	it('should successfully calls (GET) the search page', 
	function (done) {
		client.connect(mongodbHost,function(err, db) {
		  if(err) {
		    console.log(err);
		    console.log("> Connection to database failed.");
		  } else {
		  	collection = db.collection('images');
		  	var app = require('../app')(collection)
		    console.log("> Connection to database succeded.");
		    supertest(app)
			.get('/search')
			.expect(200)
			.end(function (err, res) {
				res.status.should.equal(200);
				done();
			});
		  }
		});
	});

	it('should successfully calls (POST) the search by title page', 
	function (done) {
		client.connect(mongodbHost,function(err, db) {
		  if(err) {
		    console.log(err);
		    console.log("> Connection to database failed.");
		  } else {
		  	collection = db.collection('images');
		  	var app = require('../app')(collection)
		    console.log("> Connection to database succeded.");
		    supertest(app)
			.post('/search')
			.expect(200)
			.end(function (err, res) {
				res.status.should.equal(200);
				done();
			});
		  }
		});
	});

	it('should successfully calls (POST) the search by tags page', 
	function (done) {
		this.timeout(5000);
		client.connect(mongodbHost,function(err, db) {
		  if(err) {
		    console.log(err);
		    console.log("> Connection to database failed.");
		  } else {
		  	collection = db.collection('images');
		  	var app = require('../app')(collection)
		    console.log("> Connection to database succeded.");
		    supertest(app)
			.post('/searchTags')
			.expect(200)
			.end(function (err, res) {
				res.status.should.equal(200);
				done();
			});
		  }
		});
	});

	it('should successfully calls (GET) the search by tags by query in parameter page', 
	function (done) {
		this.timeout(5000);
		client.connect(mongodbHost,function(err, db) {
		  if(err) {
		    console.log(err);
		    console.log("> Connection to database failed.");
		  } else {
		  	collection = db.collection('images');
		  	var app = require('../app')(collection)
		    console.log("> Connection to database succeded.");
		    supertest(app)
			.get('/searchTags/animal')
			.expect(200)
			.end(function (err, res) {
				res.status.should.equal(200);
				done();
			});
		  }
		});
	});

	it('should successfully calls (GET) the search by tags by query in body page', 
	function (done) {
		this.timeout(5000);
		client.connect(mongodbHost,function(err, db) {
		  if(err) {
		    console.log(err);
		    console.log("> Connection to database failed.");
		  } else {
		  	collection = db.collection('images');
		  	var app = require('../app')(collection)
		    console.log("> Connection to database succeded.");
		    supertest(app)
			.get('/searchTags')
			.expect(200)
			.end(function (err, res) {
				res.status.should.equal(200);
				done();
			});
		  }
		});
	});

	it('should successfully calls the image with id 54f615fb4bdf80530b020176 page', 
	function (done) {
		client.connect(mongodbHost,function(err, db) {
		  if(err) {
		    console.log(err);
		    console.log("> Connection to database failed.");
		  } else {
		  	collection = db.collection('images');
		  	var app = require('../app')(collection)
		    console.log("> Connection to database succeded.");
		    supertest(app)
			.get('/search/54f615fb4bdf80530b020176')
			.expect(200)
			.end(function (err, res) {
				res.status.should.equal(200);
				done();
			});
		  }
		});
	});

	it('invalid url should redirect to error 404 page', 
	function (done) {
		client.connect(mongodbHost,function(err, db) {
		  if(err) {
		    console.log(err);
		    console.log("> Connection to database failed.");
		  } else {
		  	collection = db.collection('images');
		  	var app = require('../app')(collection)
		    console.log("> Connection to database succeded.");
		    supertest(app)
			.get('/randompagethatdoesntexist')
			.expect(404)
			.end(function (err, res) {
				res.status.should.equal(404);
				done();
			});
		  }
		});
	});

	it('invalid image search id should redirect to error page', 
	function (done) {
		client.connect(mongodbHost,function(err, db) {
		  if(err) {
		    console.log(err);
		    console.log("> Connection to database failed.");
		  } else {
		  	collection = db.collection('images');
		  	var app = require('../app')(collection)
		    console.log("> Connection to database succeded.");
		    supertest(app)
			.get('/search/54f615fb4bdf80530b0201dd')
			.expect(302)
			.end(function (err, res) {
				res.status.should.equal(302);
				done();
			});
		  }
		});
	});

	it('should successfully (GET) retrieve random image', 
	function (done) {
		this.timeout(10000);
		client.connect(mongodbHost,function(err, db) {
		  if(err) {
		    console.log(err);
		    console.log("> Connection to database failed.");
		  } else {
		  	collection = db.collection('images');
		  	var app = require('../app')(collection)
		    console.log("> Connection to database succeded.");
		    supertest(app)
			.get('/search/random')
			.expect(200)
			.end(function (err, res) {
				res.status.should.equal(200);
				done();
			});
		  }
		});
	});

	it('should successfully (GET) retrieve statistics page', 
	function (done) {
		this.timeout(10000);
		client.connect(mongodbHost,function(err, db) {
		  if(err) {
		    console.log(err);
		    console.log("> Connection to database failed.");
		  } else {
		  	collection = db.collection('images');
		  	var app = require('../app')(collection)
		    console.log("> Connection to database succeded.");
		    supertest(app)
			.get('/stats')
			.expect(200)
			.end(function (err, res) {
				res.status.should.equal(200);
				done();
			});
		  }
		});
	});
});

