
function userAuth (req,res,next){

    try{

        const authToken = 'user-auth-token'
        const isAuthorised = authToken.includes('user')

        if(req.path.includes('/login') || req.path.includes('/signup'))
            return next()

        if(!isAuthorised){
            throw new Error("user redentials doesn't match please try again");
        }

        return next()

    }catch(error){
        console.log(`[USER AUTH LOG] : user credentials doesn't match`)
        
        return res.status(401).json({
            'success' : false,
            'data': {},
            'error' : error.message
        })
    }

}

module.exports = {
    userAuth
}