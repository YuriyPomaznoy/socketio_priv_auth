var execFile = require('child_process').execFile;

function childProcessExecFile(p, ...args) {
	return new Promise(function(resolve, reject) {
		var pr = execFile(p, args, function(err) {
			if(err) resolve(err);
			resolve(args[args.length-1]);
		});
		
		//console.log(pr.pid);
		
		//pr.on('close', function(data) {
		//	console.log(data);
		//});
		
		//pr.stdout.on('data', data => console.log(data));
		
	});
}

module.exports = childProcessExecFile;