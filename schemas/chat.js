var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Chats = new Schema({
	name: { type: String, required: true },
	password: { type: String, required: true },
	users: [{ type: Schema.Types.ObjectId, ref: 'Users', required: true }],
	messages: [
		{
			type: {
				user: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
				message: { type: String, required: true },
			},
			required: true,
		},
	],
});

module.exports = mongoose.model('Chats', Chats);
