var fs = require('fs');
//var path = require('path');
//var childProcessExecFile = require('../../lib/childProcessExecFile');
var User = require('../../models/User');
var conf = require('../../lib/conf');
var secr = conf.secretOrKey;

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user) {
		if(err || !user) return done(err, null);
		done(null, user);
	});
});

function authorization(app) {

	passport.use(new LocalStrategy(
		function(username, password, done) {
			User.findOne({ username: username }, function(err, user) {
				if (err) return done(err);
				
				if(user && user.validPassword(password, secr)) {
					return done(null, user);
				}
				if(user) {
					if (!user.validPassword(password, secr)) {
						return done(null, false);//, { message: 'Incorrect password.' });
					}
				}
				if(!user) {
					return done(null, false);
				}
			});
		}
	));

	app.use(passport.initialize());
	app.use(passport.session());
}

function authentication(req, res, next) {
	
		passport.authenticate('local', function(err, user, info) {
			if (err) {
				return next(err);
			}
			if (!user) {
				console.log('no user');
				return res.redirect('back');
			}				
			req.logIn(user, function(err) {
				if (err) return next(err);

				if(user.isAdmin) {
					return res.redirect('/admin');
				} else {
					return res.redirect('/');
				}
			});
		})(req, res, next);
	
}

exports.authorization = authorization;
exports.authentication = authentication;