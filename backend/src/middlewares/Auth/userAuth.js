
const jwt = require('jsonwebtoken')
const {User} = require('../../models')

async function userAuth (req,res,next){

    try{

        // get the jwtToken from the cookie
        const {token} = req.cookies;

        if(!token) throw new Error("Invalid Token Please Login Again")

        //verify the token 
        const jwtPayload = jwt.verify(token , process.env.JWT_TOKEN_KEY)
        
        //extracting the user for the _id we got inside the jwtPayload
        const {_id} = jwtPayload;
        const user = await User.findById(_id);
        if(!user){
            res.clearCookie("token")
            throw new Error("User no longer exists. Session cleared.");
        }

        // and if we got the user then we log the name of the user and send its the 
        //attaching the user in the request body so the handler get the user to and i have to find the user only once
        req.user = user;
        return next();
    }catch(error){

        console.log(`[USER AUTH LOG] : user credentials doesn't match`)
        
        if (error.name === 'TokenExpiredError') {
            // Token expire ho gaya
            return res.status(401).send("Session Expired! Please login again.");
        } 
        
        if (error.name === 'JsonWebTokenError') {
            // Token manipulate hua hai ya invalid hai
            return res.status(401).send("Invalid Token! Unauthorized access.");
        }


        return res.status(401).json({
            'error' : error.message
        })
    }

}

module.exports = {
    userAuth
}