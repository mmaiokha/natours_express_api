const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const {BCRYPT_SALT} = require('../envVariables')

const userSchema = new mongoose.Schema({
    fullName: {
       type: String,
       required: [true, 'User must have a full name']
    },
    email: {
        type: String,
        required: [true, 'User must have an email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'User must have a password'],
    },
    photo: {
        type: String,
    }
})

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, parseInt(BCRYPT_SALT));
    next();
});

userSchema.methods.correctPassword = async (password, candidatePassword) => {
    return await bcrypt.compare(password, candidatePassword)
}

const User = mongoose.model('users', userSchema)

module.exports = User