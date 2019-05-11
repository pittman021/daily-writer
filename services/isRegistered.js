function isLoggedIn(req, res, next) {
  
    if (!req.user) {
      req.flash('info', 'Create an account or login to purchase a plan.');
      res.redirect('/signup')
    } else {
        next();
    }
  }
  
  module.exports = isLoggedIn;
  