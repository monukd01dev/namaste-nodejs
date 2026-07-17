const { StatusCodes } = require("http-status-codes")
const { AppError } = require("../utils/customErrors")
const { User } = require("../models")

const updateUser = async function(cleanUpdates,user){

    if(Object.keys(cleanUpdates).length === 0){
        throw new AppError("No valid data is provided to update",StatusCodes.BAD_REQUEST)
    }

    //if the we have some data then we have the user already from the auth serverice
    for(let key in cleanUpdates){
        user[key] = cleanUpdates[key]
    }

    const savedUser = await user.save();

    return savedUser
}

const deleteUser = async function(user){

    const deletedUser = await user.deleteOne();

    return deletedUser;
}
 
module.exports =  {
    updateUser,
    deleteUser
}