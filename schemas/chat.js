var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Chats = new Schema({
	name: { type: String, required: true },
	password: { type: String, required: true },
	users: [{ type: String, required: true }],
	messages: [
		{
			type: {
				user: { type: String, required: true },
				message: { type: String, required: true },
				timeSent: { type: Date, required: true },
			},
			required: true,
		},
	],
});

module.exports = mongoose.model('Chats', Chats);
