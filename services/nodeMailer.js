const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'judson43@ethereal.email',
        pass: 'jur7U3z2gn2sJVyKKD'
    }
});

  module.exports = transporter;
  