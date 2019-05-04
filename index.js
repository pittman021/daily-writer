const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const methodOverride = require('method-override');
const flash = require('express-flash');


// Turn these on when you initiate the DB // 
require('./services/passport');
const db = require('./models/index');

const bCrypt = require('bcrypt-nodejs');

// configuration
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});
app.use(flash());

  app.locals.site =  {
      title: 'simple journal',
      description: 'the simplest place to write everyday and create your streak'
  }
  app.locals.author = {
      name: 'tim pittman',
      email: 'email address',
      twitter: '@twitterhandle',
      linkedIn: 'linkedin.com'
  }
  app.locals.google_analytics = {
    UA: 'UA-######-##'
  }

// Passport Config //
// db.sequelize
//   .authenticate()
//   .then(() => {
//     console.log('connection established');
//   })
//   .catch(err => {
//     console.log('unable to connect', err);
//   });

// var generateHash = function(password) {
//   return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
// };
// const userPassword = generateHash('pass');
// var admin = {
//   id: 0,
//   username: 'tim',
//   password: userPassword,
//   createdAt: new Date(),
//   updatedAt: new Date()
// };
//
// db.AdminUsers.create(admin).then(newUser => {
//   console.log('user created');
// });

db.sequelize.sync();

// ROUTES //
require('./routes/adminRoutes')(app);
require('./routes/writeRoutes')(app);
require('./routes/api/notesRoutes')(app);
require('./routes/pageRoutes')(app);


let port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('server is up and running');
});