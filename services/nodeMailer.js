const nodemailer = require('nodemailer');
const keys = require('../config/keys');

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: keys.SENDGRID_USERNAME,
        pass: keys.SENDGRID_PASSWORD
    }
});

  module.exports = transporter;
  