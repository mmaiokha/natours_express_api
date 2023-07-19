const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const {JWT_EXPIRES_IN, JWT_ACCESS_SECRET} = require('../envVariables')

const generateAuthResponse = (res, user, status) => {
    const token = jwt.sign({id: user.id}, JWT_ACCESS_SECRET, {
        expiresIn: JWT_EXPIRES_IN
    })

    user.password = undefined

    return res.status(status).json({
        status: 'success',
        data: {
            user,
            token
        }
    })
}

exports.signup = catchAsync(async (req, res, next) => {
    const {fullName, email, password, passwordConfirm} = req.body
    if (await User.findOne({email})) {
        return next(new AppError('User is already exist', 401))
    }
    if (password !== passwordConfirm) {
        return next(new AppError('Password mismatch', 401))
    }
    const newUser = await User.create({
        fullName, email, password
    })

    generateAuthResponse(res, newUser, 201)
})

exports.login = catchAsync(async (req, res, next) => {
    const {email, password} = req.body
    if (!email || !password) {
        return next(new AppError('Please send email and password', 401))
    }
    const user = await User.findOne({email})
    if (!user || !await user.correctPassword(password, user.password)) {
        return next(new AppError('Invalid data send', 401))
    }

    generateAuthResponse(res, user, 200)
})

exports.currentUser = catchAsync(async (req, res, next) => {
    return generateAuthResponse(res, req.user, 200)
})

exports.authProtect = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decode = jwt.verify(token, JWT_ACCESS_SECRET)
        if (!decode) {
            return next(AppError.UnauthorizedError())
        }
        const candidate = await User.findById(decode.id)
        if (!candidate) {
            return next(AppError.UnauthorizedError())
        }
        req.user = candidate
        next()
    } catch (e) {
        return next(AppError.UnauthorizedError())
    }

}