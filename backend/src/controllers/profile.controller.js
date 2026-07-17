const { StatusCodes, ReasonPhrases } = require("http-status-codes")
const { AppError } = require("../utils/customErrors")
const { validateEditProfileData } = require("../utils/validators")
const ProfileService = require("../services/profile.service")

const updateProfile = async function (req, res, next) {

    try {
        //extracting the user which userAuth have attached to the req
        const { user } = req
        //extracting the safe fields / allowed field for update
        const { emailId, password, ...safeFields } = req.body;

        const cleanUpdates = validateEditProfileData(safeFields);

        //sending the data cleanUpdates to the profile.service updateUserProfile
        const savedUser = await ProfileService.updateUser(cleanUpdates, user);

        return res.status(StatusCodes.OK).json({
            success: true,
            message: 'Update successfull!!',
            data: savedUser,
            error: null
        })

    } catch (error) {

        next(error)
    }
}

const getProfile = function (req, res, next) {
    try {

        const { user } = req;
        return res.status(StatusCodes.OK).json({
            success: true,
            message: ReasonPhrases.OK,
            data: user,
            error: null
        })

    } catch (error) {
        next(error)
    }
}

const deleteProfile = async function (req, res, next) {
    try {
        const { user } = req
        const deletedUser = await ProfileService.deleteUser(user)

        res.clearCookie("token")
        return res.status(StatusCodes.OK).json({
            success: true,
            message: ReasonPhrases.OK,
            data: deletedUser,
            error: null
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    updateProfile,
    getProfile,
    deleteProfile
}