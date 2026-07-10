require('dotenv').config()

const express = require('express')
const app = express()
const { dbConnect } = require('./config')
const { User } = require('./models')
const PORT = process.env.PORT

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

//! Episode 7 Code starts here 
//TODO create an api route to handle /signup request
app.post('/api/v1/signup', async (req, res) => {
    try {
        const dummyUser = {
            "firstName": "Priya",
            "emailId": "priya.react@example.com",
            "password": "Secure#9876",
            "age": 27,
            "gender": "female"
        }
        //paihle model ka instance banana hota hai fir hum instance ke method se use save karte hai 
        // const data = await User.save(dummyUser);
        const user = new User(dummyUser);
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

//! Episode 7 Code ends here 

// ---------------------------------------------------------
// STATION for checking the server status on the client side
// ---------------------------------------------------------
app.use('/info', (req, res) => {
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

//! Episode 7 Code starts here 

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
//! Episode 7 Code ends here 



