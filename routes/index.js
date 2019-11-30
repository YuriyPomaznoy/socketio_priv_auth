var express = require('express');
var router = express.Router();
var passport = require('passport');
var userStrategy = require('../lib/autnJWTStrategy').user;
userStrategy(passport);
var auth = require('./auth/registration');
///////////////////////////////////////////////////////
//var fs = require('fs');
//var n = require('../server.js').nameJson;
//console.log('!!!!! ' + n);
//var frFile = fs.readFileSync('./' + n + '.json');
///////////////////////////////////////////////////////

/* GET home page. */
router.get('/', function(req, res, next) {
	var locals = res.locals;
	locals.title = 'Express';
	if(req.session.passport) {
		locals.user = req.session.passport.user;
	}
	//console.log(frFile.toString());
  res.render('index');
});

router.get('/registr-page', function(req, res) {
	res.render('registrPage', { title: 'Регистрация' });
});
router.post('/registration-pict', require('./auth/makeUser'));
router.post('/signin', auth.authentication);

router.post('/login', require('./auth/login'));

module.exports = router;
