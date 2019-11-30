var expressSession = require('express-session')
	, conf = require('./conf');

module.exports = expressSession({
	resave: false,
	saveUninitialized: false,
	secret: conf.cookieSecret,
	//cookie: {
	//	maxAge: 1000*60*60
	//}
});