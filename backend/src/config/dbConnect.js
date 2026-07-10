const mongoose = require('mongoose')
const connectionString = process.env.DB_CONNECTION_STRING
/**
 * Accha yaha pe bina try catch ke bhi ho sakta tha bas dbConnect funciton me 
 * await mongoose.connect(connectionString) likh ke chor dena tha aur fir app.js me .then() aur .catch() se handle ho jata 
 * lekin main kaha db ka log db me he raihe do aur server ka log server me he sahi rahega 
 * bas yaha main important cheej ye the ke iske catch me hame throw kar dena tha error ke app.js me jo main() hai vaha pe ho error aa jaae
 */
const dbConnect = async function () {
    try{
        await mongoose.connect(connectionString)
        console.log(`[DB LOG] : Connection stablish successfully`)
    }catch(error){
        
        console.log(`[DB LOG ERROR] : Database connection failed!`,error.message)
        throw error; //ye important hai varna yaha error silently handle ho jaaega aur app.js me main() funciton ko pata bhi nhi chalega 

    }
}

module.exports = dbConnect