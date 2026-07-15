require('dotenv').config()

const express = require('express')
const jwt = require('jsonwebtoken')
const app = express()
const { dbConnect } = require('./config')
const { User } = require('./models')
const validator = require('validator')
const { signupValidator, validateEditProfileData} = require('./utils/validators')
const {throwValidationError} = require('./utils/customErrors')
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const { userAuth } = require('./middlewares/Auth')
const PORT = process.env.PORT
const secretKey = "@monukd01dev-have-secrete-key-for-this-token-for-you";//for jwt secretKey

//TODO add the midderware that read the json from request body and convert it to the js object and put it in the req.body
//! As we know that order matter in the express that why we put this middleware at the top of the file 
// Middleware: Har request yahan se guzregi. 
// Ye incoming JSON string ko pakdega, JS Object me parse karega, aur req.body me daal dega.
app.use(express.json()) // pata hai na vo yaha koe route kyon nhi specify kiya cause we want every request to go through it same like we have did in the STATION 1
app.use(cookieParser())

// ---------------------------------------------------------
// STATION 1: The Global Logger
// This runs for EVERY single request that hits the server.
// ---------------------------------------------------------
app.use((req, res, next) => {
    if (req.url != '//favicon.ico')//are vo saala favicon ico ka request by default chalta hai to usko hatane ke liye google karle
        console.log(`[LOG] someone made a ${req.method} request to ${req.url}`)

    //yaha se request aage nhi jaaega jab tak mai mext() ko call ya return nhi karta return kyonkiya hai vo notes me hai dekhlo
    return next()
})


//TODO create an api route to handle /signup request
app.post('/api/v1/signup', async (req, res) => {

    try {

        const newUser = signupValidator(req.body)


        //*paihle model ka instance banana hota hai fir hum instance ke method se use save karte hai 
        //* const data = await User.save(dummyUser);
        const user = new User(newUser);
        const savedUser = await user.save();

        return res.status(201).json({
            success: true,
            message: 'User created successfully!',
            data: savedUser,
            error: null

        });
    } catch (error) {
        console.log(`[SIGNUP LOG ERROR] : `, error.message)

        //for mongoose validation error 
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: "Invalid data provided!",
                data: null,
                error: error.message
            })
        }

        return res.status(500).json({
            success: false,
            message: "Oops! Something went wrong on the server.",
            data: null,
            error: error.message
        })
    }
})



// TODO patch method to update the whitelisted fields not unique and restricted attributes like phone and password and email
//* read the patch route creation .md file otherwise fof!
app.patch('/api/v1/user',userAuth, async (req, res) => {
    try {
        const {user} = req; 
        const { emailId, password, ...safeFields } = req.body

        const cleanUpdates = validateEditProfileData(safeFields)
        
        // 🚀 THE FIX: Prevent Useless DB Calls
        if (Object.keys(cleanUpdates).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No valid fields provided for update."
            });
        }
        //* performing the actual update 
        const updatedUser = await User.findOneAndUpdate({ "emailId": user.emailId }, cleanUpdates, { "returnDocument": "after", "runValidators": true }).select('-_id ')
        // sending the not found response 
        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "Invalid credentials!"
            });
        }

        //*  sending the final response
        return res.status(200).json({
            success: true,
            message: "user updated successfully!",
            data: updatedUser
        })


    } catch (error) {

        //for mongoose validation error 
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: "Invalid data provided!",
                data: null,
                error: error.message
            })
        }

        return res.status(500).json({
            success: false,
            message: "Oops! Something went wrong on the server.",
            data: null,
            error: error.message
        })
    }
})

//TODO delete route with delete method basically it will take the email from the request body and with that it will findOneAndDelete
//* read the delete route creation .md file otherwise fof!
app.delete('/api/v1/user',userAuth, async (req, res) => {
    try {

        const {user} = req;

        const deletedUser = await User.findOneAndDelete({ "emailId": user.emailId });

        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: 'invalid credentials',
            })
        }

        return res.status(200).json({
            success: true,
            message: `User with EmailId : ${user.emailId} is deleted successfully!!`,
            data: deletedUser,
            error: null
        })

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: 'something went wrong on our side',
            data: null,
            error: error.message
        })
    }
})

//TODO Feed route to get all users
app.get('/api/v1/feed',userAuth, async (req, res) => {
    try {
        const feed = await User.find({}).select('-_id -__v -createdAt -updatedAt')
        if (feed.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'collections is empty',
                data: null
            })
        }

        return res.status(200).json({
            success: true,
            totalUsers: feed.length,
            message: 'all user fetched successfully',
            data: feed
        })

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: 'something went wrong on our side',
            data: null,
            error: error.message
        })
    }
})

// ! Ep-11 code starts here 
// TODO Login API
app.get('/api/v1/login', async(req,res)=>{

    try {

        const {emailId,password} = req.body;

        //validation checks for emailId and password
        if(!emailId || typeof emailId !== 'string' || emailId.trim().length > 100 || !validator.isEmail(emailId.trim()))
            throwValidationError('Invalid Credentials')


        if(!password || typeof password !== 'string' || !validator.isStrongPassword(password.trim()))
            throwValidationError('Invalid Credentials')
        
        //now finding the user with the given emailId here we definetly get null instead of an random user cause we have not sending email as undefined and null in any case that's why we have validation
        const user = await User.findOne({"emailId" : emailId.trim()})

        //checking is user exists or not
        if(!user)
            throwValidationError("Invalid Credentials")

        //now we compare the password with bcrypt
        const isPasswordMatch = await user.isPasswordMatch(password.trim())

        if(!isPasswordMatch){
            throwValidationError('Invalid Credentials')
        }

        //jwt after validation 
        
        const payLoad = {"_id" : user._id};

        //token generation
        const token = await user.getJwtToken()
        //before sending the cookie

        res.cookie('token',token)

        res.status(200).json({
            success: true,
            message : "Login Successfull"
        })

    } catch (error) {

        console.log('[USER LOGIN ERROR]: from the catch block : ', error.message)

        if(error.name === 'ValidationError'){
            return res.status(400).json({
                success : false,
                message : "Invalid Credentials"
            })
        }
        
        return res.status(500).json({
            success: false,
            message: "Something went wrong on our side!!",
            data: null,
            error: error.message
        })
    }
})

// TODO Get method to get user with the user email cause email is also unique usind _id is not the food option here 
//? get router creation.md pad lena theek hai usme sahi se explain kiya hua hai 
app.get('/api/v1/user/profile',userAuth, async (req, res) => {

    try {
        const {user} = req;

        
        console.log(user.firstName + " Have maded the request to profile")

        //final response sending when we got the user details  
        return res.status(200).json({
            success: true,
            message: `User found Successfully`,
            data: user,
        })

    }
    catch (error) {

        console.log('[USER GET ERROR]: from the catch block : ', error.message)

        return res.status(500).json({
            success: false,
            message: "Something went wrong on our side!!",
            data: null,
            error: error.message
        })
    }
})//tested and working

// ! Ep-11 code ends here 


// ---------------------------------------------------------
// STATION for checking the server status on the client side
// ---------------------------------------------------------
app.use('/api/v1/info', (req, res) => {
    return res.send('Sever is up and running brother')
})

// ---------------------------------------------------------
// STATION: 404 Catch-All (Wildcard Route)
// Agar upar wala koi bhi route match nahi hua, toh request yahan giregi.
// ---------------------------------------------------------
app.use((req, res) => {
    return res.status(404).json({
        success: false,
        message: "Route not found. Tum galat gali me aa gaye ho bhai!"
    });
});

//put the app.use() with four argument just before the app.listen()
app.use((err, req, res, next) => {
    // 1. Log the ugly error for yourself (the backend engineer)
    console.log(`[DEV LOG] Error : ${err.message}`)

    // 2. Send a clean, structured JSON response to your React frontend
    res.status(500).json({
        "success": false,
        "message": "Oops! Something went wrong on the devTinder servers.",
        "error": err.message,
    })
})



async function main() {
    try {
        await dbConnect(); //jaisa ke hume pata hai humne error throw kar diya tha dbConnect function ke try catch me to to yaha aaega vo error agar dbConnect ne kuch bhi error aya to
        app.listen(PORT, () => {
            console.log(`[SERVER LOG] : App is up and running on PORT ${PORT}`)
        })
    } catch (error) {
        // console.log(`[SERVER LOG] : Failed to start server on PORT ${PORT} `, error.message) //ye main isliye hata diya kyonki error.message me redundancy ho rahi thi db ke problem to mai pahle he log kar chuka tha dbConnect() function me 
        console.log(`[SERVER LOG ERROR] : Server startup aborted due to database connection failure.`)

        //log which have redundancy 
        // [DB LOG ERROR] : Database connection failed! bad auth : Authentication failed.
        // [SERVER LOG] : Failed to start server on PORT 8080  bad auth : Authentication failed.
        //log after
        // [DB LOG ERROR] : Database connection failed! bad auth : Authentication failed.
        // [SERVER LOG ERROR] : Server startup aborted due to database connection failure.

    }
}

main()




