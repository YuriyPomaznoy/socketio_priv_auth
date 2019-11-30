var Room = require('../models/RoomSocket');
var sockIo = require('socket.io');
///////////////////////////////////////////////////////////////////////////
var fs = require('fs');
//var n = require('../server.js').nameJson;
//console.log('!!!!!!!!!!!!!!!!! ' + n);
//var frFile = fs.readFileSync('./' + n + '.json');
///////////////////////////////////////////////////////////////////////////

var io;

exports = module.exports = function(server) {
	io = sockIo(server);

	var chat = io.of('/sockkkk');
	//auth = io.of('/auth-sock');
	
	chat.on('connection', socket => {
		//////////////////////////////////////////////////////////////
		//console.log('connect to !!!!!!!!!!!!!!!!! ' + frFile);
		//////////////////////////////////////////////////////////////
		// Получить собственный id
		socket.emit('myID', socket.id);
		// Получение подключающимся всех id-шников уже подключившихся (обмениваемся)
		socket.on('i_m_hear', data => {
			socket.broadcast.emit('take my io', { from: data.id, name: data.name, avatar: data.avatar });
		});

		socket.on('take our data', data => {
			chat.to(data.to).emit('take our data too', {
				myId: data.from,
				myName: data.nameFrom,
				avatar: data.avatar
			});
		});
		///////////////////////////////////////////////////
		// Соединение двух клиентов в комнате
		socket.on('create petit room', (data, callback) => {
			socket.join(data.petitRoom);
			console.log('creat room: ' + data.petitRoom);  // НУЖНЫ ПОСЛЕДНИЕ 10 МЕССАДЖЕЙ
			Room.
				findOne({roomname: data.petitRoom}).
				slice('messages', -10).
				exec( function(err, roomDoc) {
					if(err) console.error(err);
					if(roomDoc != null) {
						chat.to(data.to).emit('go room', {
							goRoom: data.petitRoom,
							call: data.from,
							arrayMsg: roomDoc.messages
						});
						callback(roomDoc.messages);
					} else {
						new Room({roomname: data.petitRoom}).save( err => {
							if(err) console.error(err);
						});
					}
				});
		});

		socket.on('join', data => {
			console.log('join to room: ' + data.joinToRoom)
			socket.join(data.joinToRoom);
			// console.log(io.sockets.adapter.rooms[data.joinToRoom]);
		});
		// Если юзер занят
		socket.on('not single', data => {
			socket.to(data.toRoom).emit('constrained', 'Sorry, the user is busy.');
		});
		// Собсна общение
		socket.on('message', (data, cb) => {
			socket.to(data.toRoom).emit('msg', data.message);
			///////////////////////////////////////////////////////////////////////////////////////////
			Room.findOne({roomname: data.toRoom}).
				then( room => {
					room.addMessage(data.from, data.message);
					room.save( err => {
						if(err) console.error(err);
					});
				}).
				catch( err => {
					console.error(err);
				});
			cb(data.message);
		});

		socket.on('disconnecting', (reason) => {
			var rooms = Object.keys(socket.rooms);
			console.log('disconnecting:');
			console.log(rooms);				// [ 'LXUBeiYNBZxGlTpPAAAA', 'xsxqad8a7g' ]
			//console.log(reason);
			socket.broadcast.emit('end-session', {
				userId: rooms[0],
				room: rooms[1]
			});
		});
		// Закрытие комнатки
		socket.on('end this room', data => {
			socket.leave(data.room);
			socket.to(data.room).emit('close room', { room: data.room });
		});

		socket.on('i_m_too', data => {
			socket.leave(data.room);
		});

	});
	
	// НЕ НУЖНОЕ
	var authSocket = io.of('/auth-sock');
	authSocket.on('connection', function(socket) {
		
		socket.emit('mySocketId', socket.id);
		
		socket.on('regdata', data => {
			fs.writeFile('./tmp/temp.json', data, function(err) {
				if(err) console.log(err);
				var str = typeof data;
				socket.emit('dataokey', str);
			});
		})
	});

};

exports.io = io;
