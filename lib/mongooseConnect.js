/*
var mongoose = require('mongoose');
mongoose.Promise = Promise;

var options = {
	useNewUrlParser: true
};

mongoose.connect('mongodb://localhost:27017/signapp', options);

module.exports = mongoose;
*/
//var Mongoose = require('mongoose').Mongoose;
//var mong = new Mongoose();
//mong.Promise = Promise;

var mong = require('mongoose');
mong.Promise = Promise;

var options = {
	useNewUrlParser: true,
	useUnifiedTopology: true
};

mong.connect('mongodb://localhost:27017/privatechat', options);

module.exports = mong;