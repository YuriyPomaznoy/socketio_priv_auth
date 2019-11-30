var User = require('../models/User');
var conf = require('./conf');
var passportJWT = require('passport-jwt');
var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

function admin(passport) {
	var jwtOptions = {};
	jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
	jwtOptions.secretOrKey = conf.secretOrKey;
	
	passport.use(new JwtStrategy(jwtOptions, function(jwt_payload, done) {
																	//console.log(jwt_payload.id);
		User.findById(jwt_payload.id)
			.then( user => {
																	//console.log(user);
				if (user.isAdmin) {
					return done(null, user);	
				} else {
					return done(null, false);
					// or you could create a new account
				}
			})
			.catch( err => {
				console.error(err);
			});
	}));
}

function user(passport) {
	var jwtOptions = {};
	jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
	jwtOptions.secretOrKey = conf.secretOrKey;
	
	passport.use(new JwtStrategy(jwtOptions, function(jwt_payload, done) {
																	//console.log(jwt_payload.id);
		User.findById(jwt_payload.id)
			.then( user => {
																	//console.log(user);
				if (user) {
					return done(null, user);	
				} else {
					return done(null, false);
					// or you could create a new account
				}
			})
			.catch( err => {
				console.error(err);
			});
	}));
}

exports.admin = admin;
exports.user = user;