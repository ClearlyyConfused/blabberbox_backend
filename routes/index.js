require('dotenv').config();
var express = require('express');
var router = express.Router();
var userSchema = require('../schemas/users');
var chatSchema = require('../schemas/chat');
var cloudinary = require('cloudinary').v2;

// cloudinary configuration
cloudinary.config({
	cloud_name: process.env.CLOUDNAME,
	api_key: process.env.CLOUDAPI,
	api_secret: process.env.CLOUDSECRET,
});

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('index', { title: 'Express' });
});

/* route to create a user */
router.post('/createUser', function (req, res, next) {
	// find chat with same name as the inputted name
	async function getUser() {
		return await userSchema.find({ username: req.body.username });
	}

	getUser().then((user) => {
		if (user.length === 0) {
			const newUser = new userSchema({
				username: req.body.username,
				password: req.body.password,
				chats: [],
			});
			newUser.save().then(res.json({ success: true }));
		} else {
			res.json({ success: false });
		}
	});
});

/* route to create a chat */
router.post('/createChat', function (req, res, next) {
	const newChat = new chatSchema({
		name: req.body.name,
		password: req.body.password,
		users: [req.body.user],
		messages: [],
	});

	// find chat with same name as the inputted name
	async function getChat() {
		return await chatSchema.find({ name: req.body.name });
	}

	async function getUser() {
		return await userSchema.findById(req.body.user);
	}

	getChat().then((chat) => {
		// if there are no chats with the inputted name
		if (chat.length === 0) {
			getUser().then((user) => {
				// add the new chat to the user's list of chats
				const updatedUser = {
					_id: user._id,
					username: user.username,
					password: user.password,
					chats: [...user.chats, newChat._id],
				};
				async function updateUser() {
					await userSchema.findByIdAndUpdate(req.body.user, updatedUser).then(res.json({ success: true }));
				}

				// save new chat and updated user info with the chat
				newChat.save();
				updateUser();
			});
		} else {
			res.json({ success: false });
		}
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
			// add the new user to chat's list of users
			const updatedChat = {
				_id: chat._id,
				name: chat.name,
				password: chat.password,
				users: chat.users.includes(req.body.userID) ? [...chat.users] : [...chat.users, req.body.userID],
				messages: chat.messages,
			};

			// add the chat to user's list of chats
			const updatedUser = {
				_id: user._id,
				username: user.username,
				password: user.password,
				chats: user.chats.includes(chat._id) ? [...user.chats] : [...user.chats, chat._id],
			};

			// update both user and chat
			async function updateUser() {
				await userSchema.findByIdAndUpdate(req.body.userID, updatedUser).then(res.json({ success: true }));
			}
			async function updateChat() {
				await chatSchema.findByIdAndUpdate(chat._id, updatedChat);
			}
			updateChat();
			updateUser();
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
	async function uploadImage() {
		return await cloudinary.uploader.upload(req.body.image);
	}

	getChat().then((chat) => {
		getUser().then((user) => {
			// if message contains an image
			if (req.body.image !== '') {
				// upload image to cloudinary
				uploadImage().then((image) => {
					// update chat with new message
					const updatedChat = new chatSchema({
						_id: chat._id,
						users: chat.users.includes(user.username) ? [...chat.users] : [...chat.users, user.username],
						messages: [
							...chat.messages,
							{
								user: user.username,
								message: req.body.message,
								timeSent: new Date(),
								image: image.secure_url,
							},
						],
					});
					async function updateChat() {
						await chatSchema
							.findByIdAndUpdate(req.body.chatID, updatedChat)
							.exec()
							.then(res.json({ success: true }));
					}
					updateChat();
				});
			} // if message does not contain an image
			else {
				// update chat with new message
				const updatedChat = new chatSchema({
					_id: chat._id,
					users: chat.users.includes(user.username) ? [...chat.users] : [...chat.users, user.username],
					messages: [
						...chat.messages,
						{
							user: user.username,
							message: req.body.message,
							timeSent: new Date(),
							image: '',
						},
					],
				});
				async function updateChat() {
					await chatSchema
						.findByIdAndUpdate(req.body.chatID, updatedChat)
						.exec()
						.then(res.json({ success: true }));
				}
				updateChat();
			}
		});
	});
});

module.exports = router;
