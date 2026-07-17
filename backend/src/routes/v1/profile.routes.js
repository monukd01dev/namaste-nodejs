const express = require('express')
const profileRouter = express.Router()

const ProfileController = require('../../controllers/profile.controller')
const { userAuth } = require('../../middlewares/Auth')


profileRouter.patch('/edit', userAuth, ProfileController.updateProfile)
profileRouter.get('/', userAuth, ProfileController.getProfile)
profileRouter.delete('/', userAuth, ProfileController.deleteProfile)

module.exports = profileRouter;
