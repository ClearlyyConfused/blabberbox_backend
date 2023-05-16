var express = require('express');
var router = express.Router();
var userSchema = require('../schemas/users');
var chatSchema = require('../schemas/chat');

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('index', { title: 'Express' });
});

/* route to create a user */
router.post('/createUser', function (req, res, next) {
	const newUser = new userSchema({
		username: req.body.username,
		password: req.body.password,
		chats: [],
	});

	newUser.save();
});

/* route to create a chat */
router.post('/createChat', function (req, res, next) {
	const newChat = new chatSchema({
		name: req.body.name,
		password: req.body.password,
	});

	newChat.save();
});

/* route to get a chat */
router.get('/getChat', function (req, res, next) {
	async function getChat() {
		return await chatSchema.find({ name: req.body.name, password: req.body.password });
	}

	getChat().then((item) => res.json(item));
});

/* route to get a user */
router.get('/getUser', function (req, res, next) {
	async function getUser() {
		return await userSchema.find({
			username: req.body.username,
			password: req.body.password,
		});
	}

	getUser().then((item) => res.json(item));
});

/* route to message a chat */
router.post('/messageChat', function (req, res, next) {
	async function getChat() {
		return await chatSchema.findById(req.body.chatID);
	}

	getChat().then((chat) => {
		findUser(req.body.user).then((user) => {
			const updatedChat = new chatSchema({
				_id: chat._id,
				users: chat.users.includes(req.body.user)
					? [...chat.users]
					: [...chat.users, req.body.user],
				messages: [...chat.messages, { user: req.body.user, message: req.body.message }],
			});

			const updatedUser = new userSchema({
				_id: user._id,
				username: user.username,
				password: user.password,
				chats: user.chats.includes(chat._id)
					? [...user.chats]
					: [...user.chats, chat._id],
			});

			async function updateChat() {
				await chatSchema.findByIdAndUpdate(req.body.chatID, updatedChat).exec();
			}
			async function updateUser() {
				await userSchema.findByIdAndUpdate(user._id, updatedUser).exec();
			}

			updateChat();
			updateUser();
		});
	});
});

module.exports = router;
