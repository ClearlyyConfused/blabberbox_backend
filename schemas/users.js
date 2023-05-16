var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Users = new Schema({
	username: { type: String, required: true },
	password: { type: String, required: true },
	chats: [{ type: Schema.Types.ObjectId, ref: 'Chats', required: true }],
});

module.exports = mongoose.model('Users', Users);
