const { StatusCodes, ReasonPhrases } = require("http-status-codes")
const UserService = require("../services/user.service")

const userFeed = async function (req, res, next) {
    try {
        const loggedInUser = req.user;
        const feed = await UserService.getFeed(loggedInUser)
        return res.status(StatusCodes.OK).json({
            success: true,
            message: ReasonPhrases.OK,
            data: {
                "totalUsers": feed.length,
                "feed": feed
            },
            error: null
        })
    } catch (error) {

        next(error)
    }
}

module.exports = {
    userFeed
}