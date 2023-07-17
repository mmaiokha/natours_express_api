
const express = require('express')
const router = require('./routes/index')

const app = express()

// middlewares
app.use(express.json())

// routes
app.use('/api', router)

module.exports = app