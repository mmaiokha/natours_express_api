const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const User = require('../models/userModel')
const {generateAuthResponse} = require('../controllers/authController')
const crypto = require('crypto')
const sendMail = require('../utils/email')

const resetPassword = catchAsync(async (req, res, next) => {
    const {oldPassword, newPassword, newPasswordConfirm} = req.body
    const user = await User.findById(req.user.id)
    if (!oldPassword || !newPassword || !newPasswordConfirm) {
        next(new AppError('Please fill all required fills', 400))
    }

    if (!await user.correctPassword(oldPassword, user.password)) {
        return next(new AppError('Your current password is wrong', 401))
    }

    if (newPassword !== newPasswordConfirm) {
        return next(new AppError('New password mismatch', 400))
    }

    user.password = newPassword
    await user.save()

    generateAuthResponse(res, user, 200)
})

const forgotPassword = catchAsync(async (req, res, next) => {
    const user = await User.findOne({email: req.body.email})
    if (!user) {
        return next(new AppError('User with this email does not exist', 404))
    }
    const resetToken = user.createResetToken()
    await user.save({validationBefore: false})

    const resetURL = `${req.protocol}://${req.get(
        'host'
    )}/api/users/forgot-password/${resetToken}`;
    const message = `Forgot your password? Submit a PUT request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
    try {
        await sendMail({
            email: user.email,
            subject: 'Your password reset token (valid for 10 min)',
            message
        })
        return res.status(200).json({
            status: 'success',
            message: 'Reset password link sent to your email.'
        })
    } catch (e) {
        console.log(e)
        return next(new AppError('There was an error sending the email. Try again later', 500))
    }

})

const resetForgottenPassword = catchAsync(async (req, res, next) => {
    const {password, passwordConfirm} = req.body
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    })

    if (!user) {
        return next(new AppError('Token invalid or expired', 400))
    }

    if (password !== passwordConfirm) {
        return next(new AppError('Password mismatch', 400))
    }

    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    user.password = password
    await user.save()
    generateAuthResponse(res, user, 200)
})

module.exports = {
    resetPassword,
    forgotPassword,
    resetForgottenPassword
}