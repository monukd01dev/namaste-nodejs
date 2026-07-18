const { User } = require("../models")

const getFeed = async function(loggedInUser){

    const {_id} = loggedInUser;
    const feed = await User.find({"_id" : {"$ne" : _id}}).select("firstName lastName age gender photoUrl about skills");

    return feed
}

module.exports = {
    getFeed
}