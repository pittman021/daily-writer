const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
const keys = require('../config/keys');

const options = {
    auth: {
        api_user: keys.SENDGRID_USERNAME,
        api_key: keys.SENDGRID_PASSWORD
    }
}

const transporter = nodemailer.createTransport(sgTransport(options));

module.exports = transporter;