const {Router} = require('express')
const toursRouter = require('./toursRouter')
const usersRouter = require('./usersRouter')

const router = Router()

router.use('/tours', toursRouter)
router.use('/users', usersRouter)


module.exports = router