const {Router} = require('express')
const toursRouter = require('./toursRouter')

const router = Router()

router.use('/tours', toursRouter)


module.exports = router