var app = require('./helpers/app');

var should = require('should'),
	supertest = require('supertest');

describe('group12-app', function () {
	/* test all the end points */
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

