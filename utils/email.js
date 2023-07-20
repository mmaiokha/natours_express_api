const nodemailer = require('nodemailer')
const {EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS} = require('../envVariables')

const sendEmail = async options => {
    const transport = nodemailer.createTransport({
        host: EMAIL_HOST,
        port: EMAIL_PORT,
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS
        }
    });

    const mailOptions = {
        from: 'Natours',
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    await transport.sendMail(mailOptions)
}

module.exports = sendEmail;

