const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bCrypt = require('bcrypt-nodejs');
const db = require('../models/index');

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

var generateHash = function(password) {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
};

passport.use(
  'local-signup',
  new LocalStrategy(function(username, password, done) {
    db.user.findOne({
      where: { username: username }
    }).then(user => {
      if (user) {
        return done(null, false, {
          message: 'Username is taken'
        });
      } else {
        const userPassword = generateHash(password);
        var data = {
          username: username,
          password: userPassword
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
      where: { username: username }
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
        console.log(userinfo);
        return done(null, userinfo);
      })
      .catch(err => {
        return done(err, false, {
          message: 'something went wrong :('
        });
      });
  })
);
