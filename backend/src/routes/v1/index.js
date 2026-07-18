const express = require('express');
const authRouter = require('./auth.routes');
const profileRouter = require('./profile.routes')
const userRouter = require('./user.routes')
const v1Router = express.Router();
const {healthCheck} = require('../../controllers/health.controller');
const { userAuth } = require('../../middlewares/Auth');

v1Router.use('/health',healthCheck)
v1Router.use('/auth',authRouter)
v1Router.use('/user/profile',userAuth,profileRouter)
v1Router.use('/user',userRouter)

module.exports = v1Router;