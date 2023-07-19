const {Router} = require('express')
const authController = require('../controllers/authController')

const usersRouter = Router()

usersRouter.route('/signup').post(authController.signup)
usersRouter.route('/login').post(authController.login)
usersRouter.route('/me').get(authController.authProtect, authController.currentUser)

module.exports = usersRouter