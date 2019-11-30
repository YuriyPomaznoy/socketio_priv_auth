var express = require('express');
var admin = express.Router();
var passport = require('passport');
var adminStrategy = require('../lib/autnJWTStrategy').admin;
adminStrategy(passport);

/* GET users listing. */
admin.get('/', function(req, res, next) {
	res.render('admin');
});
admin.get('/get', passport.authenticate('jwt', { session: false }),
	function(req, res, next) {
		res.send('/');
	});

module.exports = admin;