const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'config.ethereal.username',
        pass: 'config.ethereal.pass'
    }
});

  module.exports = transporter;
  