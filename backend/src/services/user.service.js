const { User } = require("../models")

const getFeed = async function(currentUser){

    const {_id} = currentUser;
    const feed = await User.find({"_id" : {"$ne" : _id}}).select("firstName lastName age gender photoUrl about skills");

    return feed
}

module.exports = {
    getFeed
}