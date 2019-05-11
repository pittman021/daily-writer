const passport = require('passport');
const isLoggedIn = require('../services/isLoggedIn');
const db = require('../models/index');
const mail = require('../services/nodeMailer');
const crypto = require('crypto');
const Op = require('sequelize').Op
const generateHash = require('../services/generateHash');

module.exports = app => {
  // Login Form
  app.get('/login', function(req, res) {
    res.render('auth/login',{ message: req.flash('error')});
  });

  app.get('/signup', function(req, res) {
    res.render('auth/signup', { message: req.flash('error')});
  });

  // Logout
  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/',);
  });

  // Login Route
  app.post('/login', passport.authenticate('local-login', { failureRedirect: '/login', failureFlash: true }), function(req, res) {
    res.redirect('/write');
  });

  app.post('/signup', passport.authenticate('local-signup', { failureRedirect: '/signup', failureFlash: true }), async function(req, res) {
    

   await mail.sendMail({
      from: 'hello@freewritten.com',
      to: req.body.email,
      subject: 'Welcome to Simple Journal!',
      text: 'Welcome to Simple Journal. Do ya thang!',
      html: '<p>Welcome to Simple Journal. Do ya thang</p>'
    }).then(sentMail => {
      console.log(sentMail.messageId);
      res.redirect('/write');
    }).catch(err => {
      console.log(err);
    });
    
  });

  app.get('/forgot', function(req,res,next) {
    res.render('auth/forgot', { message: req.flash('error')});
  });

  app.post('/forgot', async function(req, res, ) {

    console.log('forgot password post route');

    try {

      const token = await crypto.randomBytes(20).toString('hex');
    
      const user = await db.user.findOne({ where: { email: req.body.email }});

      if(!user) {
        req.flash('error', 'Oops. No account with that email address. Try again')
        res.redirect('/forgot');
      } else {

      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000 // 1 hour

      const newUser = await user.save();

      await mail.sendMail({
        from: 'hello@freewritten.com',
        to: user.email,
        subject: 'Simple Journal Password Reset',
        text: `You are receiving this email because you requested a password reset link.  Please click on the following link or 
        paste into your address bar: http://${req.headers.host}/reset/${token}
        If you did not request this link, please ignore this email`,
        html: `<p>You are receiving this email because you requested a password reset link.<p>
              <p>Please click on the following link: 
                <a href="http://${req.headers.host}/reset/${token}">Password Reset Link</a>
              </p>`
      });

      console.log('mail sent!');

      req.flash('success', `An email has been sent to ${user.email} with further instructions`)
      res.redirect('/login');

      }

    } catch(err) {
      console.log(err);
      req.flash('error');
    }
  });

  app.get('/reset/:token', async (req,res) => {

    const user = await db.user.findOne({ 
      where: { 
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {
          [Op.gt]: Date.now()
        }
      }
    });

    if(!user) {
      req.flash('error', 'Password reset token has expired or is invalid');
      res.redirect('/forgot');
    } else {

    res.render('auth/reset', {token: req.params.token });

    }
  });

  app.post('/reset/:token', async (req,res) => {

    try {

    const user = await db.user.findOne({ 
      where: { 
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {
          [Op.gt]: Date.now()
        }
      }
    });

    console.log(user);

    if(!user) {
      req.flash('error', 'Password reset token has expired or is invalid');
      res.redirect('/forgot');
    } 
    
    if(req.body.new_password === req.body.confirm_password) {

      const userPassword = await generateHash(req.body.new_password);
  
      user.resetPasswordExpires = undefined;
      user.resetPasswordToken = undefined;
      user.password = userPassword;

      const newUser = user.save();

      await mail.sendMail({
        from: 'hello@freewritten.com',
        to: user.email,
        subject: 'Your password has been changed',
        text: `Hello!
        The password for ${user.email} has been changed.`,
        html: `<p>The password for ${user.email} has been changed.</p>`
      });

      req.flash('success', 'Success! Your password has been changed');
      res.redirect('/login');

    } else {
      req.flash('error', 'Passwords do not match. Try again');
      res.redirect('back');
    }

  } catch(err) {
    console.log(err);
    req.flash('error', 'Oops, something went wrong');
    res.redirect('/reset');
  }

  })
};
