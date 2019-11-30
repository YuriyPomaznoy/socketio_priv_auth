var mongoose = require('../lib/mongooseConnect');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
	username: String,
	message: String,
	createAt: {
		type: Date,
		default: Date.now
	}
});

var Message = mongoose.model('Message', messageSchema);

var roomSchema = new Schema({
	roomname: {
    type: String,
    unique: true
	},
	createAt: {
		type: Date,
		default: Date.now
	},
	messages: [messageSchema]
});

roomSchema.methods.addMessage = function(username, message) {
	var msg = new Message({username: username, message: message});
	this.messages.push(msg);
};

var Room = mongoose.model('Room', roomSchema);

module.exports = Room;

