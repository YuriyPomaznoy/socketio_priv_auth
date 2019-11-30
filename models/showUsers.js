var mongoose = require('mongoose');
var User = require('./User');

User.find({}).select('username').then(function(data) {
	console.log(data);
	mongoose.disconnect();
}).catch( err => console.log(err));