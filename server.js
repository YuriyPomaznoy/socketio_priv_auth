var http = require('http');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var auth = require('./routes/auth/registration');
//var passport = require('passport');
////////////////////////////////////////////////////////////////////
//var fs = require('fs');
//var nameJson = Math.random().toString(36).slice(2, 8);
//var objIdent = {
//	name: nameJson
//};
//fs.writeFileSync('./'+nameJson+'.json', JSON.stringify(objIdent));
//exports.nameJson = nameJson;
/////////////////////////////////////////////////////////////////////
var index = require('./routes/index');
var admin = require('./routes/admin');

var app = express();
var normalizePort = require('./lib/normalizePort');
var port = normalizePort(process.env.PORT || '5000');
app.set('port', port);

// view engine setup
app.set('views', path.join(__dirname, 'templates/views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// Игнор Middleware
/*
var unless = require('express-unless');
var lo = logger(':method :url :status :response-time ms');
lo.unless = unless;
app.use(lo.unless(function(req) {
	return /\./g.test(req.path);
}));
*/
app.use(logger(':method :url :status :response-time ms'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../Socketio_priv_auth')));

//var Strategies = require('./lib/autnJWTStrategy');
//Strategies.admin(passport);
//Strategies.user(passport);
/*
	var User = require('./models/User');
	var passportJWT = require('passport-jwt');
	var ExtractJwt = passportJWT.ExtractJwt;
	var JwtStrategy = passportJWT.Strategy;

	var jwtOptions = {};
	jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
	jwtOptions.secretOrKey = 'tasmanianDevilhdhdhdhdh';
	
	passport.use(new JwtStrategy(jwtOptions, function(jwt_payload, done) {
		
		console.log(jwt_payload);
		
		User.findOne({id: jwt_payload.sub})
			.then( user => {
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
*/
//app.use(passport.initialize());
var expressSession = require('./lib/expressSession.js');
app.use(expressSession);

auth.authorization(app);

app.use('/', index);
app.use('/admin', admin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var server = http.createServer(app);

function Server_START() {
	server.listen(app.get('port'), function() {
		console.log(`
	---------------------------------
	| Server running on PORT:  ${app.get('port')} |
	---------------------------------
	`);
	});
}

// KILL children_process
//process.on('message', function(m) {
//	if(m == 'kill') this.exit();
//});

// SOCKET_IO
require('./socket_io/socketIo')(server);

if(require.main === module) {
	// console.log(require.main);
	Server_START();
} else {
	// console.log(require.main);
	expotrs = module.exports = Server_START;
}
