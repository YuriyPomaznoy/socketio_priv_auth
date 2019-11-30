var User = require('../../models/User');
var conf = require('../../lib/conf');
var jwt = require('jsonwebtoken');
var secret = conf.secretOrKey;

module.exports = function(req, res) {
	
  if(req.body.username && req.body.password){
    var username = req.body.username;
    var password = req.body.password;
  }
	
	User.findOne({username: username})
		.then( function(user) {
			
			if(!user) res.status(401).json({message:'no such user found'});
			
			if(user.validPassword(password, secret)) {
				var payload = { id: user.id };
				var token = jwt.sign(payload, secret);
				res.json({message: 'ok', user: user.username, isAdmin: user.isAdmin, avatar: user.avatar, token: token});
			} else {
				res.status(401).json({message:'passwords did not match'});
			}
		})
		.catch( function(err){
			console.error(err);
		});
};