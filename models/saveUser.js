var mongoose = require('mongoose');
var User = require('./User');
var conf = require('../../lib/conf');
var secr = = conf.secretOrKey;
console.log(s);

var user = new User({
	username: 'Y',
	avatar: '',
	isAdmin: true
});

user.password = user.encryptPassword('f,hbrjc', secr);

user.save( err => {
	console.log(err);
	mongoose.disconnect();
});
