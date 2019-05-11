const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bCrypt = require('bcrypt-nodejs');
const db = require('../models/index');
const moment = require('moment');
const generateHash = require('../services/generateHash');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  db.user.findOne({
    where: { id: id }
  }).then(user => {
    return done(null, user);
  });
});

passport.use(
  'local-signup',
  new LocalStrategy(function(username, password, done) {
    db.user.findOne({
      where: { email: username }
    }).then(user => {
      if (user) {
        return done(null, false, {
          message: 'email is taken'
        });
      } else {
        const userPassword = generateHash(password);

        const today = new Date();

        var data = {
          email: username,
          password: userPassword,
          is_trialing: true,
          trial_end_date:  moment(new Date(), "YYYY-MM-DD HH:mm:ss").add(14, 'days').toISOString()
        };
        db.user.create(data).then(newUser => {
          return done(null, newUser);
        });
      }
    });
  })
);

passport.use(
  'local-login',
  new LocalStrategy(function(username, password, done) {
    const isValidPassword = function(userpass, password) {
      return bCrypt.compareSync(password, userpass);
    };

    db.user.findOne({
      where: { email: username }
    })
      .then(user => {
        if (!user) {
          console.log('user not found');
          return done(null, false, {
            message: 'User does not exist'
          });
        }

        if (!isValidPassword(user.password, password)) {
          return done(null, false, {
            message: 'Incorrect password'
          });
        }

        const userinfo = user.get();
        
        return done(null, userinfo);
      })
      .catch(err => {
        return done(err, false, {
          message: 'something went wrong :('
        });
      });
  })
);
