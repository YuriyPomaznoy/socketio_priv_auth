function SocketIoCode(myFace) {

		var mySocketId = document.getElementById('my-socket-id');
		var thisRoom = document.getElementById('this-room');
		var friends = document.getElementById('friends');
		var writeMessage = document.getElementById('write-message');
		var sendButton = document.getElementById('send-button');
		var talker = document.getElementById('talker');
		var folder = document.getElementById('folder');
		var kross = document.getElementById('kross');
		var tolkField = document.getElementById('folder-text');
		
		var strAddress = 'http://site2.su/sockkkk';
		console.log(strAddress);

		var socket = io('http://localhost:5000/sockkkk', {transports:['websocket']}); //('http://10.0.4.102:3001/sock');
		// При коннекте меня получаю свой id, id-шники всех других,
		// кто уже подключился (обмениваемся),
		// или при коннекте нового клиента получаю его id
		socket.on('myID', myID => {
			console.log('my id: ' + myID);
			mySocketId.value = myID;
			socket.emit('i_m_hear', { id: myID, name: myFace.name, avatar: myFace.avatar });
		});
		// "или"
		socket.on('take my io', data => {
			var elem = document.createElement('li');
			elem.id = data.from;
			elem.setAttribute('data-ind', '');
			var point = `
				<div class="person">
				<img src="${data.avatar}" class="avaimage">
				<div class="logname">${data.name}<div>
				</div>
			`;
			elem.style.cursor = 'pointer';
			elem.innerHTML = point;
			friends.appendChild(elem);

			socket.emit('take our data', {
				from: mySocketId.value,
				nameFrom: myFace.name,
				avatar: myFace.avatar,
				to: data.from
			});
		});

		socket.on('take our data too', data => {
			var elem = document.createElement('li');
			elem.id = data.myId;
			elem.setAttribute('data-ind', '');
			var point = `
				<div class="person">
				<img src="${data.avatar}" class="avaimage">
				<div class="logname">${data.myName}<div>
				</div>
			`;
			elem.style.cursor = 'pointer';
			elem.innerHTML = point;
			friends.appendChild(elem);
		});
		//////////////////////////////////////////
		// Приглашаю я
		friends.onclick = function(ev) {
			var target = ev.target;
			var targetData;
			if(target.parentElement.hasAttribute('data-ind'))
				targetData = target.parentElement;
			else if(target.parentElement.parentElement.hasAttribute('data-ind'))
				targetData = target.parentElement.parentElement;
			
			if(targetData.tagName == 'LI') {
				console.log('call into the room: ' + targetData.id);
				// Создать имя комнаты из логинов клиентов
				var roomnameArr = [];
				var logname = targetData.querySelector('.logname');
				roomnameArr.push(logname.firstChild.data);
				roomnameArr.push(myFace.name);
				roomnameArr.sort();
				var randomRoom = roomnameArr[0] + ':/:' + roomnameArr[1];
				//var randomRoom = Math.random().toString(36).slice(2);
				thisRoom.value = randomRoom;
				talker.innerHTML = `<b>${targetData.children[0].children[1].innerHTML}</b>`;
				console.log('room-name: ' + thisRoom.value);

				socket.emit('create petit room', {
					to: targetData.id, //????????????????????????????????????????????
					petitRoom: thisRoom.value,
					from: myFace.name
				}, (arrayMessagesCallback) => {
					//////////////////////////////////////////////////////////////
					arrayMessagesCallback.forEach( (msg) => {
						if(msg.username == myFace.name) {
							addMsg(msg.message, '1px dashed red', 'right');
						} else {
							addMsg(msg.message, '1px dashed blue', 'left');
						}
					});
				});
			}
			folder.className = 'folder-uptop';
			sendButton.removeAttribute('disabled');
			writeMessage.focus();
			return false;
		};
		// Отклонение приглашения
		socket.on('constrained', text => {
			//thisRoom.value = '';
			talker.innerHTML = `<b>${text}</b>`;
		});
		// Приглашают меня
		socket.on('go room', data => {
			if(thisRoom.value == '') {
				console.log('go room ' + data.goRoom);
				thisRoom.value = data.goRoom;
				talker.innerHTML = `<b>${data.call}</b>`;
				folder.className = 'folder-uptop';
				sendButton.removeAttribute('disabled');
				writeMessage.focus();
				
				data.arrayMsg.forEach( (msg) => {
					if(msg.username == myFace.name) {
						addMsg(msg.message, '1px dashed red', 'right');
					} else {
						addMsg(msg.message, '1px dashed blue', 'left');
					}
				});
				
				socket.emit('join', { joinToRoom: thisRoom.value });
				console.log('this room: ' + thisRoom.value);
			} else {
				socket.emit('not single', { toRoom: data.goRoom });
			}
		});
		// Собсна общение в комнате
		sendButton.onclick = function() {
			var data = {
				toRoom: thisRoom.value,
				message: writeMessage.value,
				from: myFace.name
			};
			socket.emit('message', data, back => {
				addMsg(back, '1px dashed red', 'right');
			});
			writeMessage.value = '';
			writeMessage.focus();
			return false;
		};

		socket.on('msg', text => {
			addMsg(text, '1px dashed blue', 'left');
		});

		socket.on('end-session', data => {
			var elem = document.getElementById(data.userId);
			var parent = elem.parentElement;
			parent.removeChild(elem);
			
			if(thisRoom.value == data.room) {
				folder.className = 'folder-place';
				sendButton.setAttribute('disabled', '');
				tolkField.innerHTML = '';
				thisRoom.value = '';
			}
		});
		// Закрытие комнаты
		kross.onclick = function() {
			var r = thisRoom.value;
			folder.className = 'folder-place';
			sendButton.setAttribute('disabled', '');
			tolkField.innerHTML = '';
			thisRoom.value = '';
			socket.emit('end this room', { room: r });
		};

		socket.on('close room', data => {
			folder.className = 'folder-place';
			sendButton.setAttribute('disabled', '');
			tolkField.innerHTML = '';
			socket.emit('i_m_too', { room: data.room });
			thisRoom.value = '';
		});

		function addMsg(text, color, float) {
			var elem = document.createElement('div');
			elem.style.padding = '5px';
			elem.style.marginBottom = '3px';
			elem.style.border = color;
			elem.style.borderRadius = '3px';
			elem.style.width = '80%';
			elem.style.float = float;
			elem.innerHTML = text;
			tolkField.appendChild(elem);
			tolkField.scrollTop = 200;
		}

}