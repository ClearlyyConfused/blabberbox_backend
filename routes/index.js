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
	res.json({ success: true });
});

/* route to create a chat */
router.post('/createChat', function (req, res, next) {
	const newChat = new chatSchema({
		name: req.body.name,
		password: req.body.password,
		users: [req.body.user],
		messages: [],
	});

	async function getUser() {
		return await userSchema.findById(req.body.user);
	}

	getUser().then((user) => {
		const updatedUser = {
			_id: user._id,
			username: user.username,
			password: user.password,
			chats: [...user.chats, newChat._id],
		};

		async function updateUser() {
			await userSchema.findByIdAndUpdate(req.body.user, updatedUser);
		}

		newChat.save();
		updateUser();
		res.json({ success: true });
	});
});

/* route to join a chat */
router.post('/joinChat', function (req, res, next) {
	async function getChat() {
		return await chatSchema.findOne({
			name: req.body.chatName,
			password: req.body.chatPassword,
		});
	}
	async function getUser() {
		return await userSchema.findById(req.body.userID);
	}

	getChat().then((chat) => {
		getUser().then((user) => {
			const updatedChat = {
				_id: chat._id,
				name: chat.name,
				password: chat.password,
				users: chat.users.includes(req.body.userID)
					? [...chat.users]
					: [...chat.users, req.body.userID],
				messages: chat.messages,
			};

			const updatedUser = {
				_id: user._id,
				username: user.username,
				password: user.password,
				chats: user.chats.includes(chat._id)
					? [...user.chats]
					: [...user.chats, chat._id],
			};

			async function updateUser() {
				await userSchema.findByIdAndUpdate(req.body.userID, updatedUser);
			}
			async function updateChat() {
				await chatSchema.findByIdAndUpdate(chat._id, updatedChat);
			}
			updateChat();
			updateUser();
			res.json({ success: true });
		});
	});
});

/* route to get a chat */
router.post('/getChat', function (req, res, next) {
	async function getChat() {
		return await chatSchema.findById(req.body.chatID);
	}

	getChat().then((item) => res.json(item));
});

/* route to get a user */
router.post('/getUser', function (req, res, next) {
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
	async function getUser() {
		return await userSchema.findById(req.body.userID);
	}

	getChat().then((chat) => {
		getUser().then((user) => {
			const updatedChat = new chatSchema({
				_id: chat._id,
				users: chat.users.includes(user.username)
					? [...chat.users]
					: [...chat.users, user.username],
				messages: [...chat.messages, { user: user.username, message: req.body.message }],
			});

			async function updateChat() {
				await chatSchema.findByIdAndUpdate(req.body.chatID, updatedChat).exec();
			}

			updateChat();
		});
	});
	res.json({ success: true });
});

module.exports = router;
