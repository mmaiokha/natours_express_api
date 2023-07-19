const express = require('express')
const router = require('./routes/index')
const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')

const app = express()

// middlewares
app.use(express.json())

// routes
app.use('/api', router)
app.all('*', (req, res, next) => {
    next(new AppError(`Cant find ${req.originalUrl} on this server`, 400))
})

app.use(globalErrorHandler)

module.exports = app