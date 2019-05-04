const passport = require('passport');
const isLoggedIn = require('../services/isLoggedIn');
const db = require('../models/index');


module.exports = app => {
  // Login Form
  app.get('/login', function(req, res) {
    res.render('login',{ message: req.flash('error')});
  });

  app.get('/signup', function(req, res) {
    res.render('signup', { message: req.flash('error')});
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

  app.post('/signup', passport.authenticate('local-signup', { failureRedirect: '/signup', failureFlash: true }), function(req, res) {
    res.redirect('/write');
  });
};
