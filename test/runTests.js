var app = require('./helpers/app');

var should = require('should'),
	supertest = require('supertest');

describe('group12-app', function () {
	it('should successfully calls the home page', 
	function (done) {
		supertest(app)
		.get('/')
		.expect(200)
		.end(function (err, res) {
			done();
		});
	});
});

