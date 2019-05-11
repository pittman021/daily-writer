const nodemailer = require('nodemailer');
const keys = require('../config/keys');

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: keys.ETHEREAL_EMAIL,
        pass: keys.ETHEREAL_PASS
    }
});

  module.exports = transporter;
  