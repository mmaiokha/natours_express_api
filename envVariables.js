require('dotenv').config()

exports.SERVER_PORT = process.env.PORT

exports.DB = process.env.DB
exports.DB_PASSWORD = process.env.DB_PASSWORD

exports.BCRYPT_SALT = process.env.BCRYPT_SALT

exports.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET
exports.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN