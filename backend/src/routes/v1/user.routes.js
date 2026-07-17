const express = require('express');
const { userAuth } = require('../../middlewares/Auth');
const UserController = require('../../controllers/user.Controller');
const userRouter = express.Router();

userRouter.get('/feed',userAuth, UserController.userFeed)

module.exports = userRouter