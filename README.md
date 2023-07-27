# Blabberbox (backend) 🌳

![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)

Backend for Blabberbox. Stores, retrieves and adjusts user account and chat room information.

## Deployment 🚀

https://blabberbox-backend.vercel.app/

## API Reference 🧩

#### Create new account

```http
  POST /createUser
```

| Parameter  | Type     | Description                                         |
| :--------- | :------- | :-------------------------------------------------- |
| `username` | `string` | **Required**. Username to create a new account with |
| `password` | `string` | **Required**. Password to create a new account with |

#### Get an account's information

```http
  POST /getUser
```

| Parameter  | Type     | Description                                               |
| :--------- | :------- | :-------------------------------------------------------- |
| `username` | `string` | **Required**. Username of account to get information from |
| `password` | `string` | **Required**. Password of account to get information from |

#### Change a user's profile picture

```http
  POST /changeProfileImage
```

| Parameter | Type     | Description                                                                      |
| :-------- | :------- | :------------------------------------------------------------------------------- |
| `userID`  | `string` | **Required**. UserID of the user to change the profile picture of                |
| `image`   | `string` | **Required**. Base64 string of an image to be used as the user's profile picture |

#### Get a user's profile picture

```http
  POST /getProfileImage
```

| Parameter  | Type     | Description                                                           |
| :--------- | :------- | :-------------------------------------------------------------------- |
| `username` | `string` | **Required**. Username of the user to retrieve the profile picture of |

#### Create a new chat

```http
  POST /createChat
```

| Parameter  | Type     | Description                                            |
| :--------- | :------- | :----------------------------------------------------- |
| `name`     | `string` | **Required**. Name of the new chat                     |
| `password` | `string` | **Required**. Password of the new chat                 |
| `user`     | `string` | **Required**. UserID of user that is creating the chat |

#### Join a chat

```http
  POST /joinChat
```

| Parameter      | Type     | Description                                           |
| :------------- | :------- | :---------------------------------------------------- |
| `chatName`     | `string` | **Required**. Name of the chat to join                |
| `chatPassword` | `string` | **Required**. Password of the chat to join            |
| `userID`       | `string` | **Required**. UserID of user that is joining the chat |

#### Leave a chat

```http
  POST /leaveChat
```

| Parameter | Type     | Description                                           |
| :-------- | :------- | :---------------------------------------------------- |
| `chatID`  | `string` | **Required**. ChatID of the chat to leave             |
| `userID`  | `string` | **Required**. UserID of user that is leaving the chat |

#### Get a chat's information

```http
  POST /getChat
```

| Parameter | Type     | Description                                                   |
| :-------- | :------- | :------------------------------------------------------------ |
| `chatID`  | `string` | **Required**. ChatID of the chat to retrieve information from |

#### Message a chat

```http
  POST /messageChat
```

| Parameter | Type     | Description                                                 |
| :-------- | :------- | :---------------------------------------------------------- |
| `chatID`  | `string` | **Required**. ChatID of the chat to message                 |
| `userID`  | `string` | **Required**. UserID of the user that is messaging the chat |
| `message` | `string` | **Required**. Text message to send to the chat              |
| `image`   | `string` | **Required**. Base64 string of image to send in the message |

## Related

- [Blabberbox Frontend](https://github.com/ClearlyyConfused/blabberbox-frontend)
