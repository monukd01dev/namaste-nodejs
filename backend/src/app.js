const express = require('express')
const app = express()
const PORT = 8080
const {userAuth,adminAuth} = require('./middlewares')

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

//! Episode 6 Code starts here 
// TODO define the admin route here 
    app.use('/api/v1/admin',adminAuth)
// TODO define 2 admin sub routes here
    app.all('/api/v1/admin/sales',(req,res)=>{
        return res.send('Here is you all saled data')
    })

    app.get('/api/v1/admin/users', (req,res)=> {
        return res.send("Here is you all users data")
    })

// TODO define the user route here 
    app.use('/api/v1/user',userAuth)
// TODO define 2 user sub routes here 
    app.post('/api/v1/user/login/:id/:pass',(req,res)=>{
        return res.status(200).json({
            "success" : true,
            "data" : req.params,
            "error" : {},
            "message" : "User login successfully"
        })
    })
    app.post('/api/v1/user/signup/:id/:pass',(req,res)=>{
        return res.status(200).json({
            "success" : true,
            "data" : req.params,
            "error" : {},
            "message" : "User signup successfully"
        })
    })

    app.get('/api/v1/user/profile',(req,res)=>{
        return res.send("this is you profile after successfull userAuth middleware")
    })

//! Episode 6 Code ends here 

// ---------------------------------------------------------
// STATION for checking the server status on the client side
// ---------------------------------------------------------
app.use('/info',(req,res)=>{
    return res.send('Sever is up and running brother')
})

// ---------------------------------------------------------
// STATION: 404 Catch-All (Wildcard Route)
// Agar upar wala koi bhi route match nahi hua, toh request yahan giregi.
// ---------------------------------------------------------
app.use( (req, res) => {
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


//put the app.listen() below
app.listen(PORT, function listenCallback() {
    console.log(`[DEV LOG] : App is up and running on PORT ${PORT}`)
})


