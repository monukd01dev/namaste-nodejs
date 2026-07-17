const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const v1Router = require('./routes/v1')
const {globalLogger} = require('./middlewares/logger')
const {notFoundHandler,globalErrorHandler} = require('./middlewares/errorHandler')

//-----Middleware-----
app.use(express.json()) 
app.use(cookieParser())
app.use(globalLogger)

//-----Routes-----
app.use('/api/v1/',v1Router)

//-----Error Handling-----
app.use(notFoundHandler)
app.use(globalErrorHandler)




module.exports = app;





