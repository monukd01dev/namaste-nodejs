const express = require('express')
const app = express()
const PORT = 8080
//put all the app.use below

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

//ab jo main next kiya tha vo is neeche wale ko kiya tha 
// ---------------------------------------------------------
// STATION 2: The Dev-Only Security Gate
// This only runs for routes starting with /api/connect
// ---------------------------------------------------------
app.use('/api/connect', (req, res, next) => {
    const isVerified = true;
    if (!isVerified)
        return res.status(402).send("Access Denied: devTinder is for developers only!")

    console.log("[LOG] User verified. Passing to the route handler...");
    return next()
})


// ---------------------------------------------------------
// STATION 3: The Final Route Handler
// ---------------------------------------------------------
app.use('/api/connect', (req, res) => {
    return res.send('Successfully connected with another developer!')
})

// ---------------------------------------------------------
// Station with specific route only for checking the global error handler
// ---------------------------------------------------------
app.use('/error-checking',(req,res,next)=>{
    //my sole purpose is to run the 4 argument app.use handler method 
    try{
        throw new Error('Man Made Error')
    }
    catch(err){
        return next(err)
    }
})

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

//mai thoda flow flow me aage chala gya lekin thodi cheeje google kar lena tum log 

/**
 * ============================================================================
 * devTinder Backend - Express Middleware & Routing Flow (Episode 4)
 * ============================================================================
 * * Yeh file Express.js ke "Conveyor Belt" (Middleware) architecture ko implement
 * karti hai. Har incoming request top-to-bottom travel karti hai jab tak use 
 * koi response (res.send) na mil jaye, ya koi error throw na ho.
 * * THE REQUEST LIFECYCLE:
 * * 1. Global Logger (app.use): 
 * Har request yahan se guzarti hai. Yeh request method aur path ko log 
 * karta hai (ignoring favicon) aur `return next()` ke through aage bhejta hai.
 * * 2. Security Gate (/api/connect): 
 * Specific middleware jo sirf dev verification check karta hai. Agar user
 * verified nahi hai, toh yahin se 402 Unauthorized bhej kar request rok deta hai.
 * * 3. Final Handlers (/api/connect, /info): 
 * Agar request yahan tak pohochi aur path match hua, toh yeh actual business 
 * logic execute karke response bhejte hain. Yahan aakar safar khatam hota hai.
 * * 4. Error Simulator (/error-checking): 
 * Yeh route intentionally `throw new Error()` karta hai aur `next(err)` 
 * ko call karke request ko seedha "Emergency Department" (Error Handler) 
 * mein drop kar deta hai. Baki sab routes skip ho jate hain.
 * * 5. 404 Catch-All Wildcard (app.use): 
 * Agar upar diya gaya koi bhi path match NAHI hua, toh request girti girti 
 * yahan aayegi. Yeh route user ko ek clean 404 "Galat gali" JSON message dega.
 * * 6. Global Error Handler (app.use with 4 arguments): 
 * Yeh pure app ka safety net hai. Agar kisi bhi upar wale route mein code 
 * fatt gaya aur `next(err)` call hua, toh yeh handler us ugly stack trace 
 * ko intercept karke frontend ko ek clean 500 Internal Server Error JSON bhejta hai.
 * ============================================================================
 */