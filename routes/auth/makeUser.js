var fs = require('fs');
var path = require('path');
var formidable = require('formidable');
var childProcessExecFile = require('../../lib/childProcessExecFile');
var User = require('../../models/User');
var conf = require('../../lib/conf');
var secr = conf.secretOrKey;

module.exports = function(req, res, next) {
	
	var form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files) {
		if(err) console.log(err);
		
		var convert = {};
		convert.height = fields.heightPict;
		convert.X = fields.X;
		convert.Y = fields.Y;
		var n = Math.random().toString(36).slice(2, 8);
		convert.finName = path.join(__dirname, '../../tmp/' + n + '.png');
		
		childProcessExecFile('gm', 'convert', files.file.path, '-resize', 'x' + convert.height,
												'-crop', `350x350+${convert.X}+${convert.Y}`, '-resize', '150x150', convert.finName)
			.then( pathDisk => {
				var user = new User({
					username: fields.username
				});
				user.password = user.encryptPassword(fields.password, secr);
				var dataFileEnd = fs.readFileSync(pathDisk);
				user.avatar = dataFileEnd.toString('base64');

				user.save( err => {
					if(err) console.log(err);
					res.send('/');
				});
			})
			.catch( err => {
				console.log(err);
			});
	});
	/*
	var finalData = require('../../tmp/temp.json');
	var nn = Math.random().toString().slice(2, 8);
	var fileName = path.join(__dirname, '../../tmp/' + nn + '.' + finalData.fileType);
	
	var writeStream = fs.createWriteStream(fileName);
	req.pipe(writeStream);
	
	req.on('end', function() {
		var convert = {};
		convert.height = finalData.heightPict;
		convert.X = finalData.X;
		convert.Y = finalData.Y;
		var n = Math.random().toString(36).slice(2, 8);
		convert.finName = path.join(__dirname, '../../tmp/' + n + '.png');
					
		childProcessExecFile('gm', 'convert', fileName, '-resize', 'x' + convert.height,
												'-crop', `350x350+${convert.X}+${convert.Y}`, '-resize', '150x150', convert.finName)
			.then( pathDisk => {
				var user = new User({
					username: finalData.username
				});
				user.password = user.encryptPassword(finalData.password, secr);
				var dataFileEnd = fs.readFileSync(pathDisk);
				user.avatar = dataFileEnd.toString('base64');

				user.save( err => {
					if(err) console.log(err);
					res.send('/');
				});
			})
			.catch( err => {
				console.log(err);
			});
	});
	
	writeStream.on('error', function (err) {
		console.error(err);
	});
	*/
};