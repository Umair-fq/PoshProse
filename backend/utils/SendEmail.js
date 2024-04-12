const nodemailer = require('nodemailer')
require('dotenv').config();


const sendEmail = async (email, subject, body) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.USER,
                pass: process.env.PASSWORD,
            },
        });

        await transporter.sendMail({
        from: process.env.USER,
        to: email,
        subject: subject,
        text: body,
    })
    console.log('email sent successfully');

    } catch (error) {
        console.log('email not sent')
        console.log(error)
        return error;
    }
}

module.exports = sendEmail